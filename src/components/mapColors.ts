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

function categoryLegendKey(category: UbiResult['category']): keyof Translations {
  switch (category) {
    case 'Viable hoy': return 'legendViableNow'
    case 'Viable con IA moderada': return 'legendViableModerate'
    case 'Requiere IA extrema': return 'legendExtremeAI'
    case 'Inviable': return 'legendNotViable'
    default: return 'legendNoData'
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

function bucketsFor(metric: Exclude<MapMetric, 'category'>): Bucket[] {
  if (metric === 'gap') return GAP_BUCKETS
  if (metric === 'cost') return COST_BUCKETS
  return NEEDED_BUCKETS
}

function bucketIndex(
  value: number | undefined,
  buckets: Bucket[],
  allowInfinity: boolean,
): number {
  if (value === undefined) return -1
  if (!allowInfinity && !Number.isFinite(value)) return -1
  const index = buckets.findIndex((bucket) => value <= bucket.max)
  return index
}

export function metricBucketIndex(
  result: UbiResult | undefined,
  metric: MapMetric,
): number {
  if (!result || !result.hasData || result.category === 'Sin datos') return -1

  if (metric === 'category') {
    return CATEGORY_ORDER.indexOf(result.category)
  }

  const buckets = bucketsFor(metric)
  const value =
    metric === 'gap'
      ? result.gapPctGdp
      : metric === 'cost'
        ? result.netCostPctGdp
        : result.aiGrowthNeededPct

  return bucketIndex(value, buckets, metric === 'needed')
}

export function metricColor(result: UbiResult | undefined, metric: MapMetric): string {
  if (!result || !result.hasData || result.category === 'Sin datos') return NO_DATA_COLOR
  if (metric === 'category') return CATEGORY_COLORS[result.category]

  const index = metricBucketIndex(result, metric)
  return index >= 0 ? bucketsFor(metric)[index].color : NO_DATA_COLOR
}

export interface LegendItem {
  color: string
  label: string
  texture: number
}

export function legendItems(metric: MapMetric, t: Translations): LegendItem[] {
  if (metric === 'category') {
    return CATEGORY_ORDER.map((category, index) => ({
      color: CATEGORY_COLORS[category],
      label: t[categoryLegendKey(category)],
      texture: category === 'Sin datos' ? 0 : index,
    }))
  }

  const buckets = bucketsFor(metric)
  return [
    ...buckets.map((bucket, index) => ({
      color: bucket.color,
      label: t[bucket.labelKey],
      texture: index,
    })),
    { color: NO_DATA_COLOR, label: t.noData, texture: 0 },
  ]
}
