import type { UbiParams } from '../model/ubi'
import type { Lang } from '../i18n/translations'
import type { MapMetric } from '../components/mapColors'
import { defaultUbiParams } from './presets'

export type Mode = 'simple' | 'advanced'

export interface DashboardState {
  lang: Lang
  metric: MapMetric
  mode: Mode
  iso3: string | null
  params: UbiParams
}

const METRICS: MapMetric[] = ['category', 'gap', 'cost', 'needed']

function numberParam(raw: string | null, fallback: number, min: number, max: number): number {
  if (raw === null || raw.trim() === '') return fallback
  const value = Number(raw)
  if (!Number.isFinite(value)) return fallback
  return Math.min(max, Math.max(min, value))
}

export function stateFromSearch(search: string): DashboardState {
  const query = new URLSearchParams(search)
  const defaults = defaultUbiParams

  const rawIso = (query.get('pais') || '').toUpperCase()
  const iso3 = /^[A-Z]{3}$/.test(rawIso) ? rawIso : null

  const rawMetric = query.get('metrica') as MapMetric | null
  const metric = rawMetric && METRICS.includes(rawMetric) ? rawMetric : 'category'

  const params: UbiParams = {
    ...defaults,
    ubiAmountType: query.get('modo') === 'usd' ? 'usd_month_ppa' : 'pct_gdp_pc_ppa',
    ubiPctGdpPcPpa: numberParam(query.get('ubi'), defaults.ubiPctGdpPcPpa, 0, 80),
    ubiUsdMonthPpa: numberParam(query.get('usd'), defaults.ubiUsdMonthPpa, 0, 2000),
    coverage: query.get('cobertura') === 'adultos' ? 'adults_only' : 'adults_and_children',
    childShare: numberParam(query.get('menor'), defaults.childShare * 100, 0, 100) / 100,
    publicSpendingReplacedPct: numberParam(
      query.get('sustitucion'),
      defaults.publicSpendingReplacedPct,
      0,
      80,
    ),
    aiGrowthG: numberParam(query.get('g'), defaults.aiGrowthG, 0, 30),
    stateCapturePct: numberParam(query.get('captacion'), defaults.stateCapturePct, 0, 90),
    domesticAiPct: numberParam(query.get('domestico'), defaults.domesticAiPct, 0, 90),
    fiscalPressureCeilingPctGdp: numberParam(
      query.get('techo'),
      defaults.fiscalPressureCeilingPctGdp,
      30,
      80,
    ),
  }

  return {
    lang: query.get('idioma') === 'en' ? 'en' : 'es',
    metric,
    mode: query.get('vista') === 'completo' ? 'advanced' : 'simple',
    iso3,
    params,
  }
}

export function searchFromState(state: DashboardState): string {
  const query = new URLSearchParams()
  if (state.iso3) query.set('pais', state.iso3)
  query.set('metrica', state.metric)
  query.set('vista', state.mode === 'advanced' ? 'completo' : 'sencillo')
  query.set('idioma', state.lang)
  query.set('modo', state.params.ubiAmountType === 'usd_month_ppa' ? 'usd' : 'pct')
  query.set('ubi', String(state.params.ubiPctGdpPcPpa))
  query.set('usd', String(state.params.ubiUsdMonthPpa))
  query.set('cobertura', state.params.coverage === 'adults_only' ? 'adultos' : 'todos')
  query.set('menor', String(Math.round(state.params.childShare * 100)))
  query.set('sustitucion', String(state.params.publicSpendingReplacedPct))
  query.set('g', String(state.params.aiGrowthG))
  query.set('captacion', String(state.params.stateCapturePct))
  query.set('domestico', String(state.params.domesticAiPct))
  query.set('techo', String(state.params.fiscalPressureCeilingPctGdp))
  return query.toString()
}
