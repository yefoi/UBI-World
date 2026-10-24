import type { UbiResult } from '../model/ubi'
import type { Translations } from '../i18n/translations'
import { fillTemplate } from './format'

export function summarize(result: UbiResult, t: Translations): string {
  if (!result.hasData) return ''

  const cost = Math.round(result.grossCostPctGdp ?? 0)
  const replaced = Math.round(result.replacedSpendingPctGdp ?? 0)
  const margin = Math.round(result.fiscalMarginPctGdp ?? 0)
  const ai = Math.round(result.aiExtraIncomePctGdp ?? 0)
  const gap = result.gapPctGdp ?? 0

  const first = fillTemplate(t.plainSummaryCost, { cost: String(cost) })
  const second = fillTemplate(t.plainSummaryFunding, {
    replaced: String(replaced),
    margin: String(margin),
    ai: String(ai),
  })
  const third =
    gap > 0
      ? fillTemplate(t.plainSummaryGap, { gap: String(Math.max(1, Math.ceil(gap))) })
      : fillTemplate(t.plainSummaryCovered, {
          surplus: String(Math.max(0, Math.floor(-gap))),
        })

  return `${first} ${second} ${third}`
}
