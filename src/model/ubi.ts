export interface CountryRawData {
  iso3: string
  iso_numeric?: string
  name: string
  name_es?: string
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
  publicSpendingReplacedPct: number // % del gasto público que el UBI sustituye

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
  ubiAdultPppMonth?: number
  ubiChildPppMonth?: number
  ubiAdultNominalMonth?: number
  gdpPppTotal?: number
  pppToNominal?: number

  // Costes
  grossCostUsdYear?: number
  grossCostPctGdp?: number
  replacedSpendingPctGdp?: number
  netCostPctGdp?: number
  netCostUsdYear?: number

  // Fiscal
  currentTaxRevenuePctGdp?: number
  fiscalMarginPctGdp?: number

  // IA
  aiExtraIncomePctGdp?: number

  // Brecha
  gapPctGdp?: number

  // Necesario
  aiGrowthNeededPct?: number

  category: 'Viable hoy' | 'Viable con IA moderada' | 'Requiere IA extrema' | 'Inviable' | 'Sin datos'

  assumptions: string[]
}

export const REQUIRED_FIELDS = [
  'gdp_usd',
  'population',
  'pop_0_14_pct',
  'gdp_pc_ppa',
  'tax_revenue_pct_gdp',
  'gov_exp_pct_gdp',
] as const

function fieldValue(country: CountryRawData, field: string): number | undefined {
  return (country as unknown as Record<string, number | undefined>)[field]
}

export function calculateUbi(country: CountryRawData, params: UbiParams): UbiResult {
  const assumptions: string[] = []

  const missing = REQUIRED_FIELDS.filter((field) => {
    const value = fieldValue(country, field)
    return value === undefined || value === null || !Number.isFinite(value)
  }) as unknown as string[]

  if (missing.length > 0) {
    return {
      hasData: false,
      missing,
      category: 'Sin datos',
      assumptions: ['Datos insuficientes del Banco Mundial (últimos 5 años). No se han inventado valores.'],
    }
  }

  const gdpUsd = country.gdp_usd!
  const popTotal = country.population!
  const pop0_14Pct = country.pop_0_14_pct!
  const gdpPcPpa = country.gdp_pc_ppa!
  const taxRevenue = country.tax_revenue_pct_gdp!
  const govExp = country.gov_exp_pct_gdp!

  if (
    gdpUsd <= 0 ||
    popTotal <= 0 ||
    gdpPcPpa <= 0 ||
    pop0_14Pct < 0 ||
    pop0_14Pct > 100 ||
    taxRevenue < 0 ||
    govExp < 0
  ) {
    return {
      hasData: false,
      missing: ['invalid_values'],
      category: 'Sin datos',
      assumptions: ['Valores inválidos en los datos (PIB, población o porcentajes fuera de rango).'],
    }
  }

  const childrenPct = pop0_14Pct / 100
  const adultsPct = 1 - childrenPct
  const adultsCount = Math.round(popTotal * adultsPct)
  const childrenCount = Math.round(popTotal * childrenPct)

  // PIB en PPA implícito: mismo país, misma producción, valorada en PPA.
  // Todos los porcentajes se calculan en PPA; el importe nominal se obtiene
  // aplicando el deflactor implícito (PIB nominal / PIB PPA).
  const gdpPppTotal = gdpPcPpa * popTotal
  const pppToNominal = gdpUsd / gdpPppTotal

  // Cuantía en US$ PPA
  const ubiAdultPppYear =
    params.ubiAmountType === 'pct_gdp_pc_ppa'
      ? gdpPcPpa * (params.ubiPctGdpPcPpa / 100)
      : params.ubiUsdMonthPpa * 12
  const ubiChildPppYear = ubiAdultPppYear * params.childShare
  const ubiAdultPppMonth = ubiAdultPppYear / 12
  const ubiChildPppMonth = ubiChildPppYear / 12
  const ubiAdultNominalMonth = ubiAdultPppMonth * pppToNominal

  if (params.ubiAmountType === 'pct_gdp_pc_ppa') {
    assumptions.push(
      `Cuantía: ${params.ubiPctGdpPcPpa}% del PIB per cápita PPA = ${Math.round(ubiAdultPppMonth)} US$ PPA/mes (≈ ${Math.round(ubiAdultNominalMonth)} US$ corrientes/mes).`,
    )
  } else {
    assumptions.push(
      `Cuantía: ${params.ubiUsdMonthPpa} US$ PPA/mes (≈ ${Math.round(ubiAdultNominalMonth)} US$ corrientes/mes).`,
    )
  }

  if (params.coverage === 'adults_only') {
    assumptions.push('Cobertura: solo adultos (15 años o más).')
  } else {
    assumptions.push(
      `Cobertura: adultos y menores; los menores reciben el ${Math.round(params.childShare * 100)}% del importe adulto.`,
    )
  }

  // Coste bruto en PPA y como porcentaje del PIB PPA
  const grossCostPppYear =
    adultsCount * ubiAdultPppYear +
    (params.coverage === 'adults_and_children' ? childrenCount * ubiChildPppYear : 0)
  const grossCostPctGdp = (grossCostPppYear / gdpPppTotal) * 100
  const grossCostUsdYear = (grossCostPctGdp / 100) * gdpUsd

  // Sustitución: se redirige parte del gasto público existente.
  // El parámetro es % del gasto público actual, no % del coste del UBI.
  const potentialReplacedPct = govExp * (params.publicSpendingReplacedPct / 100)
  const replacedSpendingPctGdp = Math.min(potentialReplacedPct, grossCostPctGdp)
  const netCostPctGdp = grossCostPctGdp - replacedSpendingPctGdp
  const netCostUsdYear = (netCostPctGdp / 100) * gdpUsd

  if (params.publicSpendingReplacedPct > 0) {
    if (potentialReplacedPct >= grossCostPctGdp) {
      assumptions.push(
        `El ${params.publicSpendingReplacedPct}% del gasto público (${potentialReplacedPct.toFixed(1)}% del PIB) cubre todo el UBI: se redirigen ${replacedSpendingPctGdp.toFixed(1)}% del PIB y el coste neto es 0%.`,
      )
    } else {
      assumptions.push(
        `Se redirige el ${params.publicSpendingReplacedPct}% del gasto público (${potentialReplacedPct.toFixed(1)}% del PIB) al UBI; el coste neto baja de ${grossCostPctGdp.toFixed(1)}% a ${netCostPctGdp.toFixed(1)}% del PIB.`,
      )
    }
  }

  // Espacio fiscal: lo que se podría recaudar adicionalmente hasta el techo.
  // No se usa la recaudación actual como dinero disponible.
  const fiscalMarginPctGdp = Math.max(0, params.fiscalPressureCeilingPctGdp - taxRevenue)
  assumptions.push(
    `Margen fiscal: techo del ${params.fiscalPressureCeilingPctGdp}% menos ingresos fiscales actuales del ${taxRevenue.toFixed(1)}% = ${fiscalMarginPctGdp.toFixed(1)}% del PIB de espacio adicional.`,
  )

  // Ingreso captado de la producción extra por IA
  let aiExtraIncomePctGdp = 0
  if (params.aiGrowthG > 0 && params.domesticAiPct > 0 && params.stateCapturePct > 0) {
    aiExtraIncomePctGdp =
      params.aiGrowthG * (params.domesticAiPct / 100) * (params.stateCapturePct / 100)
    assumptions.push(
      `IA: +${params.aiGrowthG}% de PIB extra × ${params.domesticAiPct}% propiedad doméstica × ${params.stateCapturePct}% captado por el Estado = +${aiExtraIncomePctGdp.toFixed(2)}% del PIB.`,
    )
  } else if (params.aiGrowthG > 0) {
    assumptions.push(
      `IA: +${params.aiGrowthG}% de PIB extra, pero con captación o propiedad doméstica del 0% no genera ingreso público.`,
    )
  }

  const gapPctGdp = netCostPctGdp - fiscalMarginPctGdp - aiExtraIncomePctGdp

  let aiGrowthNeededPct = 0
  if (gapPctGdp > 0) {
    const captureFactor = (params.domesticAiPct / 100) * (params.stateCapturePct / 100)
    aiGrowthNeededPct = captureFactor > 0 ? gapPctGdp / captureFactor : Infinity
  }

  let category: UbiResult['category']
  if (gapPctGdp <= 0) {
    category = params.aiGrowthG > 0 ? 'Viable con IA moderada' : 'Viable hoy'
  } else if (aiGrowthNeededPct === Infinity || aiGrowthNeededPct >= 15) {
    category = 'Inviable'
  } else if (aiGrowthNeededPct >= 5) {
    category = 'Requiere IA extrema'
  } else {
    category = 'Viable con IA moderada'
  }

  assumptions.push(
    'Los porcentajes se calculan en PPA (PIB per cápita PPA × población); los importes corrientes usan el deflactor implícito del PIB. No se mezclan unidades.',
  )
  assumptions.push('Herramienta divulgativa: NO es una predicción. Ver la página de Metodología.')

  return {
    hasData: true,
    missing: [],
    adultsCount,
    childrenCount,
    ubiAdultPppMonth: round2(ubiAdultPppMonth),
    ubiChildPppMonth: round2(ubiChildPppMonth),
    ubiAdultNominalMonth: round2(ubiAdultNominalMonth),
    gdpPppTotal,
    pppToNominal,
    grossCostUsdYear,
    grossCostPctGdp: round2(grossCostPctGdp),
    replacedSpendingPctGdp: round2(replacedSpendingPctGdp),
    netCostPctGdp: round2(netCostPctGdp),
    netCostUsdYear,
    currentTaxRevenuePctGdp: round2(taxRevenue),
    fiscalMarginPctGdp: round2(fiscalMarginPctGdp),
    aiExtraIncomePctGdp: round2(aiExtraIncomePctGdp),
    gapPctGdp: round2(gapPctGdp),
    aiGrowthNeededPct: Number.isFinite(aiGrowthNeededPct) ? round2(aiGrowthNeededPct) : Infinity,
    category,
    assumptions,
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}
