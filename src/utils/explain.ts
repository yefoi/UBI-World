import type { UbiParams, UbiResult } from '../model/ubi'
import type { Translations } from '../i18n/translations'
import { fillTemplate } from './format'

export function categoryReason(
  result: UbiResult,
  params: UbiParams,
  t: Translations,
): string {
  const gap = result.gapPctGdp ?? 0
  if (gap <= 0) {
    return params.aiGrowthG > 0 ? t.reasonCoveredWithAi : t.reasonCoveredNow
  }

  if (result.aiGrowthNeededPct === Infinity) {
    return t.reasonNoCapture
  }

  const needed = result.aiGrowthNeededPct ?? 0
  const vars = { gap: Math.abs(gap).toFixed(1), needed: needed.toFixed(1) }

  if (needed < 5) return fillTemplate(t.reasonModerate, vars)
  if (needed < 15) return fillTemplate(t.reasonExtreme, vars)
  return fillTemplate(t.reasonBeyond, vars)
}
