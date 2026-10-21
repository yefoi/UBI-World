import { describe, it, expect } from 'vitest'
import { calculateUbi, type CountryRawData, type UbiParams } from './ubi'

const defaultParams: UbiParams = {
  ubiAmountType: 'pct_gdp_pc_ppa',
  ubiPctGdpPcPpa: 30,
  ubiUsdMonthPpa: 500,
  coverage: 'adults_and_children',
  childShare: 0.5,
  publicSpendingReplacedPct: 20,
  aiGrowthG: 0,
  stateCapturePct: 20,
  domesticAiPct: 50,
  fiscalPressureCeilingPctGdp: 50,
}

const completeCountry: CountryRawData = {
  iso3: 'ESP',
  name: 'Spain',
  gdp_usd: 1400000000000, // 1.4T
  population: 47000000,
  pop_0_14_pct: 14.5,
  gdp_pc_ppa: 42000,
  tax_revenue_pct_gdp: 38.0,
  gov_exp_pct_gdp: 45.0,
  missing: [],
  years: {},
}

describe('calculateUbi', () => {
  it('returns Sin datos when missing required fields', () => {
    const country: CountryRawData = {
      iso3: 'XXX',
      name: 'Test',
      missing: ['gdp_usd'],
      years: {},
    }
    const result = calculateUbi(country, defaultParams)
    expect(result.category).toBe('Sin datos')
    expect(result.hasData).toBe(false)
  })

  it('returns Sin datos when PIB is 0', () => {
    const country: CountryRawData = { ...completeCountry, gdp_usd: 0 }
    const result = calculateUbi(country, defaultParams)
    expect(result.category).toBe('Sin datos')
    expect(result.hasData).toBe(false)
  })

  it('returns Sin datos when population is 0', () => {
    const country: CountryRawData = { ...completeCountry, population: 0 }
    const result = calculateUbi(country, defaultParams)
    expect(result.category).toBe('Sin datos')
  })

  it('returns Sin datos when gdp_pc_ppa is 0', () => {
    const country: CountryRawData = { ...completeCountry, gdp_pc_ppa: 0 }
    const result = calculateUbi(country, defaultParams)
    expect(result.category).toBe('Sin datos')
  })

  it('handles g negative correctly', () => {
    const params = { ...defaultParams, aiGrowthG: -5 }
    const result = calculateUbi(completeCountry, params)
    expect(result.hasData).toBe(true)
    expect(result.aiExtraIncomePctGdp).toBe(0)
  })

  it('calculates for adults only', () => {
    const params = { ...defaultParams, coverage: 'adults_only' as const }
    const result = calculateUbi(completeCountry, params)
    expect(result.hasData).toBe(true)
    expect(result.adultsCount).toBeGreaterThan(0)
    // Coste debe ser menor con solo adultos
  })

  it('calculates with USD/month amount directly', () => {
    const params = { ...defaultParams, ubiAmountType: 'usd_month_ppa' as const, ubiUsdMonthPpa: 500 }
    const result = calculateUbi(completeCountry, params)
    expect(result.hasData).toBe(true)
    expect(result.ubiAdultUsdMonth).toBe(500)
  })

  it('applies fiscal ceiling', () => {
    const country = { ...completeCountry, tax_revenue_pct_gdp: 60 }
    const params = { ...defaultParams, fiscalPressureCeilingPctGdp: 50 }
    const result = calculateUbi(country, params)
    expect(result.hasData).toBe(true)
    expect(result.fiscalMarginPctGdp).toBe(50)
  })

  it('marks as Viable hoy when gap <= 0 with g=0', () => {
    const country: CountryRawData = {
      iso3: 'NOR',
      name: 'Norway',
      gdp_usd: 500000000000,
      population: 5400000,
      pop_0_14_pct: 18,
      gdp_pc_ppa: 65000,
      tax_revenue_pct_gdp: 55,
      gov_exp_pct_gdp: 50,
      missing: [],
      years: {},
    }
    const params = { ...defaultParams, ubiPctGdpPcPpa: 10, publicSpendingReplacedPct: 40, aiGrowthG: 0 }
    const result = calculateUbi(country, params)
    expect(result.hasData).toBe(true)
    expect(result.category).toBe('Viable hoy')
  })

  it('children get 50% by default', () => {
    const result = calculateUbi(completeCountry, defaultParams)
    expect(result.hasData).toBe(true)
    expect(result.ubiChildUsdMonth).toBeCloseTo(result.ubiAdultUsdMonth! * 0.5, 1)
  })

  it('inviable when capture factors are 0 and gap > 0', () => {
    const params = { ...defaultParams, ubiPctGdpPcPpa: 80, aiGrowthG: 0, stateCapturePct: 0, domesticAiPct: 0 }
    const result = calculateUbi(completeCountry, params)
    expect(result.hasData).toBe(true)
    expect(result.aiGrowthNeededPct).toBe(Infinity)
    expect(result.category).toBe('Inviable')
  })
})
