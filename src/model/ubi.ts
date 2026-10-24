export interface CountryRawData {
  iso3: string
  iso_numeric?: string
  name: string
  gdp_usd?: number
  population?: number
  pop_0_14_pct?: number
  gdp_pc_ppa?: number
  tax_revenue_pct_gdp?: number
  gov_exp_pct_gdp?: number
  missing: string[]
  years: Record<string, string | undefined>
}

export interface UbiParams {
  // Cuantía
  ubiAmountType: 'pct_gdp_pc_ppa' | 'usd_month_ppa'
  ubiPctGdpPcPpa: number // % del PIB per cápita PPA
  ubiUsdMonthPpa: number // US$/mes PPA
  
  // Cobertura
  coverage: 'adults_only' | 'adults_and_children'
  childShare: number // % de adulto para menores (default 0.5 = 50%)
  
  // Sustitución
  publicSpendingReplacedPct: number // % del gasto público que sustituye
  
  // Crecimiento por IA
  aiGrowthG: number // crecimiento adicional del PIB por IA (%)
  stateCapturePct: number // % de esa producción extra que capta el Estado
  domesticAiPct: number // % de esa producción que queda en el país
  
  // Configuración
  fiscalPressureCeilingPctGdp: number // techo presión fiscal (default 50%)
}

export interface UbiResult {
  hasData: boolean
  missing: string[]
  
  // Población
  adultsCount?: number
  childrenCount?: number
  ubiAdultUsdMonth?: number
  ubiChildUsdMonth?: number
  
  // Costes
  grossCostUsdYear?: number
  grossCostPctGdp?: number
  netCostPctGdp?: number // tras sustitución
  
  // Fiscal
  currentTaxRevenuePctGdp?: number
  fiscalMarginPctGdp?: number // limitado al techo
  
  // IA
  aiExtraIncomePctGdp?: number
  
  // Brecha
  gapPctGdp?: number // coste neto - margen - ingreso IA
  
  // Necesario
  aiGrowthNeededPct?: number // crecimiento por IA necesario para cerrar brecha
  
  category: 'Viable hoy' | 'Viable con IA moderada' | 'Requiere IA extrema' | 'Inviable' | 'Sin datos'
  
  assumptions: string[]
}

const REQUIRED_FIELDS = ['gdp_usd', 'population', 'pop_0_14_pct', 'gdp_pc_ppa', 'tax_revenue_pct_gdp']

export function calculateUbi(country: CountryRawData, params: UbiParams): UbiResult {
  const assumptions: string[] = []
  
  // Check missing data
  const missing = country.missing.filter(m => REQUIRED_FIELDS.includes(m))
  if (missing.length > 0 || !country.gdp_usd || !country.population || country.pop_0_14_pct === undefined || !country.gdp_pc_ppa || country.tax_revenue_pct_gdp === undefined) {
    return {
      hasData: false,
      missing: missing.length > 0 ? missing : REQUIRED_FIELDS.filter(f => !(f in country) || country[f as keyof CountryRawData] === undefined),
      category: 'Sin datos',
      assumptions: ['Datos insuficientes del Banco Mundial (últimos 5 años). No se han inventado valores.'],
    }
  }
  
  // Validaciones básicas
  if (country.gdp_usd <= 0 || country.population <= 0 || country.gdp_pc_ppa <= 0) {
    return {
      hasData: false,
      missing: ['invalid_values'],
      category: 'Sin datos',
      assumptions: ['Valores inválidos (PIB/población/PIB pc PPA <= 0).'],
    }
  }
  
  const popTotal = country.population
  const pop0_14Pct = country.pop_0_14_pct
  const childrenPct = pop0_14Pct / 100
  const adultsPct = 1 - childrenPct
  
  const adultsCount = Math.round(popTotal * adultsPct)
  const childrenCount = Math.round(popTotal * childrenPct)
  
  // Calcular cuantía
  let ubiAdultUsdYear: number
  if (params.ubiAmountType === 'pct_gdp_pc_ppa') {
    const pct = params.ubiPctGdpPcPpa / 100
    ubiAdultUsdYear = country.gdp_pc_ppa * pct // anual
    assumptions.push(`Cuantía: ${params.ubiPctGdpPcPpa}% del PIB per cápita PPA = ${Math.round(ubiAdultUsdYear/12)} US$/mes`)
  } else {
    ubiAdultUsdYear = params.ubiUsdMonthPpa * 12
    assumptions.push(`Cuantía: ${params.ubiUsdMonthPpa} US$/mes PPA = ${params.ubiUsdMonthPpa * 12} US$/año`)
  }
  
  const ubiChildUsdYear = ubiAdultUsdYear * params.childShare
  const ubiAdultUsdMonth = ubiAdultUsdYear / 12
  const ubiChildUsdMonth = ubiChildUsdYear / 12
  
  if (params.coverage === 'adults_only') {
    assumptions.push('Cobertura: solo adultos (>=15 años)')
  } else {
    assumptions.push(`Cobertura: adultos + menores (menores reciben ${Math.round(params.childShare * 100)}% del adulto)`)
  }
  
  // Coste bruto
  let grossCostUsdYear: number
  if (params.coverage === 'adults_only') {
    grossCostUsdYear = adultsCount * ubiAdultUsdYear
  } else {
    grossCostUsdYear = adultsCount * ubiAdultUsdYear + childrenCount * ubiChildUsdYear
  }
  const grossCostPctGdp = (grossCostUsdYear / country.gdp_usd) * 100
  
  // Coste neto tras sustitución
  const netCostPctGdp = grossCostPctGdp * (1 - params.publicSpendingReplacedPct / 100)
  if (params.publicSpendingReplacedPct > 0) {
    assumptions.push(`Se sustituye el ${params.publicSpendingReplacedPct}% del gasto público actual (transferencias/programas)`)
  }
  
  // Margen fiscal actual
  const currentTaxRevenuePctGdp = country.tax_revenue_pct_gdp
  let fiscalMarginPctGdp = currentTaxRevenuePctGdp
  const ceiling = params.fiscalPressureCeilingPctGdp
  if (fiscalMarginPctGdp > ceiling) {
    fiscalMarginPctGdp = ceiling
    assumptions.push(`Margen fiscal limitado al techo de presión fiscal configurado (${ceiling}% del PIB)`)
  }
  assumptions.push(`Margen fiscal aproximado = ingresos fiscales actuales: ${currentTaxRevenuePctGdp.toFixed(1)}% del PIB (techo ${ceiling}%)`)
  
  // Ingreso captado por IA
  let aiExtraIncomePctGdp = 0
  if (params.aiGrowthG > 0 && params.domesticAiPct > 0 && params.stateCapturePct > 0) {
    const extraProductionPctGdp = params.aiGrowthG // % del PIB
    const domesticExtraPctGdp = extraProductionPctGdp * (params.domesticAiPct / 100)
    aiExtraIncomePctGdp = domesticExtraPctGdp * (params.stateCapturePct / 100)
    assumptions.push(`Crecimiento extra por IA: +${params.aiGrowthG}% PIB. ${params.domesticAiPct}% queda en el país, Estado captura ${params.stateCapturePct}% de lo doméstico → +${aiExtraIncomePctGdp.toFixed(2)}% PIB`)
  } else if (params.aiGrowthG > 0) {
    assumptions.push(`Crecimiento extra por IA: +${params.aiGrowthG}% PIB, pero factores de captación/domesticidad = 0 → ingreso captado 0`)
  }
  
  // Brecha
  const gapPctGdp = netCostPctGdp - fiscalMarginPctGdp - aiExtraIncomePctGdp
  
  // Crecimiento por IA necesario
  let aiGrowthNeededPct = 0
  if (gapPctGdp <= 0) {
    aiGrowthNeededPct = 0
  } else {
    const captureFactor = (params.domesticAiPct / 100) * (params.stateCapturePct / 100)
    if (captureFactor <= 0) {
      aiGrowthNeededPct = Infinity
    } else {
      aiGrowthNeededPct = gapPctGdp / captureFactor // % del PIB
    }
  }
  
  // Categoría
  let category: UbiResult['category']
  if (gapPctGdp <= 0) {
    // Viable hoy o con IA ya considerada
    if (params.aiGrowthG <= 0) {
      category = 'Viable hoy'
    } else {
      category = 'Viable con IA moderada'
    }
  } else {
    if (aiGrowthNeededPct === Infinity) {
      category = 'Inviable'
    } else if (aiGrowthNeededPct < 5) {
      category = 'Viable con IA moderada'
    } else if (aiGrowthNeededPct < 15) {
      category = 'Requiere IA extrema'
    } else {
      category = 'Inviable'
    }
  }
  
  assumptions.push('Metodología: herramienta divulgativa, NO es predicción. Ver docs/METHODOLOGY.md')
  
  return {
    hasData: true,
    missing: [],
    adultsCount,
    childrenCount,
    ubiAdultUsdMonth: Math.round(ubiAdultUsdMonth * 100) / 100,
    ubiChildUsdMonth: Math.round(ubiChildUsdMonth * 100) / 100,
    grossCostUsdYear,
    grossCostPctGdp: Math.round(grossCostPctGdp * 100) / 100,
    netCostPctGdp: Math.round(netCostPctGdp * 100) / 100,
    currentTaxRevenuePctGdp: Math.round(currentTaxRevenuePctGdp * 100) / 100,
    fiscalMarginPctGdp: Math.round(fiscalMarginPctGdp * 100) / 100,
    aiExtraIncomePctGdp: Math.round(aiExtraIncomePctGdp * 100) / 100,
    gapPctGdp: Math.round(gapPctGdp * 100) / 100,
    aiGrowthNeededPct: aiGrowthNeededPct === Infinity ? Infinity : Math.round(aiGrowthNeededPct * 100) / 100,
    category,
    assumptions,
  }
}
