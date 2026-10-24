import { describe, it, expect } from 'vitest'
import { calculateUbi, type CountryRawData, type UbiParams } from './ubi'

const defaultParams: UbiParams = {
  ubiAmountType: 'pct_gdp_pc_ppa',
  ubiPctGdpPcPpa: 30,
  ubiUsdMonthPpa: 500,
  coverage: 'adults_and_children',
  childShare: 0.5,
  publicSpendingReplacedPct: 20,
  aiGrowthG: 3,
  stateCapturePct: 20,
  domesticAiPct: 50,
  fiscalPressureCeilingPctGdp: 50,
}

// PIB PPA = 10.000 × 1.000 = 10 M; PIB nominal = 10 M (deflactor 1).
const baseCountry: CountryRawData = {
  iso3: 'TST',
  name: 'Testland',
  gdp_usd: 10_000_000,
  population: 1000,
  pop_0_14_pct: 20,
  gdp_pc_ppa: 10_000,
  tax_revenue_pct_gdp: 20,
  gov_exp_pct_gdp: 30,
  missing: [],
  years: {},
}

describe('calculateUbi', () => {
  it('devuelve Sin datos si falta un indicador requerido', () => {
    const country: CountryRawData = { ...baseCountry, gov_exp_pct_gdp: undefined }
    const result = calculateUbi(country, defaultParams)
    expect(result.hasData).toBe(false)
    expect(result.category).toBe('Sin datos')
    expect(result.missing).toContain('gov_exp_pct_gdp')
  })

  it('devuelve Sin datos con PIB, población o PIB per cápita PPA a 0', () => {
    expect(calculateUbi({ ...baseCountry, gdp_usd: 0 }, defaultParams).category).toBe('Sin datos')
    expect(calculateUbi({ ...baseCountry, population: 0 }, defaultParams).category).toBe('Sin datos')
    expect(calculateUbi({ ...baseCountry, gdp_pc_ppa: 0 }, defaultParams).category).toBe('Sin datos')
  })

  it('devuelve Sin datos con porcentajes fuera de rango', () => {
    const result = calculateUbi({ ...baseCountry, pop_0_14_pct: 130 }, defaultParams)
    expect(result.category).toBe('Sin datos')
  })

  it('calcula los porcentajes en PPA y no mezcla con el PIB nominal', () => {
    // PIB PPA = 10 M; PIB nominal = 5 M (deflactor 0,5).
    const country: CountryRawData = { ...baseCountry, gdp_usd: 5_000_000 }
    const params: UbiParams = {
      ...defaultParams,
      ubiPctGdpPcPpa: 100,
      coverage: 'adults_only',
      publicSpendingReplacedPct: 0,
      aiGrowthG: 0,
    }
    const result = calculateUbi(country, params)

    expect(result.hasData).toBe(true)
    expect(result.grossCostPctGdp).toBe(80)
    expect(result.grossCostUsdYear).toBe(4_000_000)
    expect(result.pppToNominal).toBe(0.5)
  })

  it('convierte el importe PPA mensual con el deflactor del PIB', () => {
    const country: CountryRawData = { ...baseCountry, gdp_usd: 5_000_000 }
    const params: UbiParams = {
      ...defaultParams,
      ubiAmountType: 'usd_month_ppa',
      ubiUsdMonthPpa: 500,
      coverage: 'adults_only',
      publicSpendingReplacedPct: 0,
      aiGrowthG: 0,
    }
    const result = calculateUbi(country, params)

    expect(result.ubiAdultPppMonth).toBe(500)
    expect(result.ubiChildPppMonth).toBe(250)
    expect(result.ubiAdultNominalMonth).toBe(250)
  })

  it('los menores reciben el 50% del adulto por defecto', () => {
    const result = calculateUbi(baseCountry, defaultParams)
    expect(result.ubiChildPppMonth).toBeCloseTo((result.ubiAdultPppMonth ?? 0) * 0.5, 2)
  })

  it('calcula el margen fiscal como espacio hasta el techo, no como recaudación', () => {
    const result = calculateUbi(baseCountry, defaultParams)
    expect(result.currentTaxRevenuePctGdp).toBe(20)
    expect(result.fiscalMarginPctGdp).toBe(30)
  })

  it('deja margen 0 si la recaudación ya supera el techo', () => {
    const country = { ...baseCountry, tax_revenue_pct_gdp: 60 }
    const result = calculateUbi(country, defaultParams)
    expect(result.fiscalMarginPctGdp).toBe(0)
  })

  it('subir el techo fiscal aumenta la recaudación adicional', () => {
    const low = calculateUbi(baseCountry, { ...defaultParams, fiscalPressureCeilingPctGdp: 50 })
    const high = calculateUbi(baseCountry, { ...defaultParams, fiscalPressureCeilingPctGdp: 70 })
    expect(high.fiscalMarginPctGdp! - low.fiscalMarginPctGdp!).toBe(20)
  })

  it('redirige gasto público y no descuenta un % del coste del UBI', () => {
    // Gasto público 30% × 20% = 6% del PIB redirigido.
    // Coste bruto 27% → coste neto 21%.
    const result = calculateUbi(baseCountry, defaultParams)
    expect(result.grossCostPctGdp).toBe(27)
    expect(result.replacedSpendingPctGdp).toBe(6)
    expect(result.netCostPctGdp).toBe(21)
  })

  it('limita el gasto redirigido al coste bruto', () => {
    const country = { ...baseCountry, gov_exp_pct_gdp: 100 }
    const params = { ...defaultParams, publicSpendingReplacedPct: 80 }
    const result = calculateUbi(country, params)
    expect(result.grossCostPctGdp).toBe(27)
    expect(result.replacedSpendingPctGdp).toBe(27)
    expect(result.netCostPctGdp).toBe(0)
  })

  it('la brecha es coste neto menos recaudación adicional menos ingreso de IA', () => {
    const result = calculateUbi(baseCountry, defaultParams)
    expect(result.aiExtraIncomePctGdp).toBe(0.3)
    expect(result.gapPctGdp).toBe(21 - 30 - 0.3)
  })

  it('trata un crecimiento por IA negativo como ingreso 0', () => {
    const result = calculateUbi(baseCountry, { ...defaultParams, aiGrowthG: -5 })
    expect(result.hasData).toBe(true)
    expect(result.aiExtraIncomePctGdp).toBe(0)
  })

  it('calcula el crecimiento por IA necesario para cerrar la brecha', () => {
    const params: UbiParams = {
      ...defaultParams,
      ubiPctGdpPcPpa: 10,
      coverage: 'adults_only',
      publicSpendingReplacedPct: 0,
      aiGrowthG: 0,
      fiscalPressureCeilingPctGdp: 50,
      domesticAiPct: 100,
      stateCapturePct: 100,
    }
    const country = { ...baseCountry, tax_revenue_pct_gdp: 50 }
    const ok = calculateUbi(country, params)
    // Coste bruto 8% del PIB, sin margen fiscal: brecha 8% → +8% de crecimiento.
    expect(ok.gapPctGdp).toBe(8)
    expect(ok.aiGrowthNeededPct).toBe(8)
    expect(ok.category).toBe('Requiere IA extrema')
  })

  it('es inviable si la captación es 0 y hay brecha', () => {
    const params: UbiParams = {
      ...defaultParams,
      publicSpendingReplacedPct: 0,
      stateCapturePct: 0,
      domesticAiPct: 0,
      aiGrowthG: 0,
    }
    const country = { ...baseCountry, tax_revenue_pct_gdp: 50 }
    const result = calculateUbi(country, params)
    expect(result.gapPctGdp! > 0).toBe(true)
    expect(result.aiGrowthNeededPct).toBe(Infinity)
    expect(result.category).toBe('Inviable')
  })

  it('marca Viable hoy cuando el coste neto queda cubierto sin IA', () => {
    const result = calculateUbi(baseCountry, { ...defaultParams, aiGrowthG: 0 })
    expect(result.gapPctGdp! <= 0).toBe(true)
    expect(result.category).toBe('Viable hoy')
  })

  it('marca Viable con IA moderada cuando la brecha exige menos del 5% del PIB', () => {
    const country = { ...baseCountry, tax_revenue_pct_gdp: 50 }
    const params: UbiParams = {
      ...defaultParams,
      ubiPctGdpPcPpa: 2.5,
      coverage: 'adults_only',
      publicSpendingReplacedPct: 0,
      aiGrowthG: 0,
      domesticAiPct: 100,
      stateCapturePct: 100,
    }
    const result = calculateUbi(country, params)
    expect(result.gapPctGdp).toBe(2)
    expect(result.aiGrowthNeededPct).toBe(2)
    expect(result.category).toBe('Viable con IA moderada')
  })
})
