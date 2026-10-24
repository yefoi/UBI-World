import type { UbiResult } from '../model/ubi'
import type { Translations } from '../i18n/translations'

export type MapMetric = 'category' | 'gap' | 'cost' | 'needed'

export const NO_DATA_COLOR = '#9ca3af'

export const CATEGORY_COLORS: Record<UbiResult['category'], string> = {
  'Viable hoy': '#22c55e',
  'Viable con IA moderada': '#84cc16',
  'Requiere IA extrema': '#f59e0b',
  'Inviable': '#ef4444',
  'Sin datos': NO_DATA_COLOR,
}

export const CATEGORY_ORDER: UbiResult['category'][] = [
  'Viable hoy',
  'Viable con IA moderada',
  'Requiere IA extrema',
  'Inviable',
  'Sin datos',
]

export function categoryLabelKey(category: UbiResult['category']): keyof Translations {
  switch (category) {
    case 'Viable hoy': return 'viableNow'
    case 'Viable con IA moderada': return 'viableModerate'
    case 'Requiere IA extrema': return 'extremeAI'
    case 'Inviable': return 'notViable'
    default: return 'noData'
  }
}

export interface Bucket {
  max: number
  color: string
  labelKey: keyof Translations
}

export const GAP_BUCKETS: Bucket[] = [
  { max: 0, color: '#22c55e', labelKey: 'gapCovered' },
  { max: 3, color: '#84cc16', labelKey: 'gap0to3' },
  { max: 8, color: '#f59e0b', labelKey: 'gap3to8' },
  { max: 20, color: '#f97316', labelKey: 'gap8to20' },
  { max: Infinity, color: '#ef4444', labelKey: 'gapOver20' },
]

export const COST_BUCKETS: Bucket[] = [
  { max: 5, color: '#22c55e', labelKey: 'costUnder5' },
  { max: 10, color: '#84cc16', labelKey: 'cost5to10' },
  { max: 20, color: '#f59e0b', labelKey: 'cost10to20' },
  { max: 35, color: '#f97316', labelKey: 'cost20to35' },
  { max: Infinity, color: '#ef4444', labelKey: 'costOver35' },
]

export const NEEDED_BUCKETS: Bucket[] = [
  { max: 0, color: '#22c55e', labelKey: 'neededCovered' },
  { max: 5, color: '#84cc16', labelKey: 'needed0to5' },
  { max: 15, color: '#f59e0b', labelKey: 'needed5to15' },
  { max: 30, color: '#f97316', labelKey: 'needed15to30' },
  { max: Infinity, color: '#ef4444', labelKey: 'neededOver30' },
]

export const METRIC_OPTIONS: { value: MapMetric; labelKey: keyof Translations }[] = [
  { value: 'category', labelKey: 'category' },
  { value: 'gap', labelKey: 'metricGap' },
  { value: 'cost', labelKey: 'metricCost' },
  { value: 'needed', labelKey: 'metricNeeded' },
]

function pickBucket(value: number | undefined, buckets: Bucket[], allowInfinity: boolean): string {
  if (value === undefined) return NO_DATA_COLOR
  if (!allowInfinity && !Number.isFinite(value)) return NO_DATA_COLOR
  const bucket = buckets.find((b) => value <= b.max)
  return bucket ? bucket.color : NO_DATA_COLOR
}

export function metricColor(result: UbiResult | undefined, metric: MapMetric): string {
  if (!result || !result.hasData || result.category === 'Sin datos') return NO_DATA_COLOR
  switch (metric) {
    case 'category':
      return CATEGORY_COLORS[result.category]
    case 'gap':
      return pickBucket(result.gapPctGdp, GAP_BUCKETS, false)
    case 'cost':
      return pickBucket(result.netCostPctGdp, COST_BUCKETS, false)
    case 'needed':
      return pickBucket(result.aiGrowthNeededPct, NEEDED_BUCKETS, true)
  }
}

export function legendItems(metric: MapMetric, t: Translations): { color: string; label: string }[] {
  if (metric === 'category') {
    return CATEGORY_ORDER.map((category) => ({
      color: CATEGORY_COLORS[category],
      label: t[categoryLabelKey(category)],
    }))
  }

  const buckets =
    metric === 'gap' ? GAP_BUCKETS : metric === 'cost' ? COST_BUCKETS : NEEDED_BUCKETS

  return [
    ...buckets.map((bucket) => ({ color: bucket.color, label: t[bucket.labelKey] })),
    { color: NO_DATA_COLOR, label: t.noData },
  ]
}
