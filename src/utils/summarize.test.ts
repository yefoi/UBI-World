import { describe, it, expect } from 'vitest'
import { calculateUbi, type CountryRawData, type UbiParams } from '../model/ubi'
import { es } from '../i18n/translations'
import { summarize } from './summarize'

const params: UbiParams = {
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

const country: CountryRawData = {
  iso3: 'TST',
  name: 'Testland',
  gdp_usd: 10_000_000,
  population: 1000,
  pop_0_14_pct: 20,
  gdp_pc_ppa: 10_000,
  tax_revenue_pct_gdp: 50,
  gov_exp_pct_gdp: 30,
  missing: [],
  years: {},
}

describe('summarize', () => {
  it('convierte el coste en una frase de "de cada 100"', () => {
    const result = calculateUbi(country, params)
    const text = summarize(result, es)
    expect(text).toContain('cada 100')
    expect(text).toContain('27')
    expect(text).toContain('gasto que ya existe')
  })

  it('explica cuánto faltaría cuando la brecha es positiva', () => {
    const result = calculateUbi(country, {
      ...params,
      publicSpendingReplacedPct: 0,
      aiGrowthG: 0,
    })
    const text = summarize(result, es)
    expect(result.gapPctGdp).toBeGreaterThan(0)
    expect(text).toContain('faltarían')
  })

  it('dice que no falta nada cuando hay superávit', () => {
    const result = calculateUbi(
      { ...country, tax_revenue_pct_gdp: 40 },
      {
        ...params,
        ubiPctGdpPcPpa: 5,
        publicSpendingReplacedPct: 0,
        aiGrowthG: 0,
      },
    )
    const text = summarize(result, es)
    expect(result.gapPctGdp).toBeLessThanOrEqual(0)
    expect(text).toContain('no faltaría nada')
  })

  it('devuelve una cadena vacía sin datos', () => {
    const result = calculateUbi({ ...country, gdp_usd: undefined }, params)
    expect(summarize(result, es)).toBe('')
  })
})
