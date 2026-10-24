import type { Translations } from '../i18n/translations'

export const INDICATOR_KEYS = [
  'gdp_usd',
  'population',
  'pop_0_14_pct',
  'gdp_pc_ppa',
  'tax_revenue_pct_gdp',
  'gov_exp_pct_gdp',
] as const

const LABELS: Record<string, keyof Translations> = {
  gdp_usd: 'indGdp',
  population: 'indPopulation',
  pop_0_14_pct: 'indChildren',
  gdp_pc_ppa: 'indGdpPc',
  tax_revenue_pct_gdp: 'indTax',
  gov_exp_pct_gdp: 'indGovExp',
}

export function indicatorLabel(key: string, t: Translations): string {
  const labelKey = LABELS[key]
  return labelKey ? t[labelKey] : key
}
