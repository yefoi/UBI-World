import type { Translations, Lang } from '../i18n/translations'
import type { CountryRawData, UbiParams, UbiResult } from '../model/ubi'
import { countryName } from '../utils/country'
import { categoryReason } from '../utils/explain'
import { fillTemplate, formatNumber, formatPct, formatPctValue } from '../utils/format'
import { summarize } from '../utils/summarize'
import { indicatorLabel } from '../utils/indicators'
import { categoryLabelKey } from './mapColors'

interface Props {
  t: Translations
  lang: Lang
  country: CountryRawData | null
  result: UbiResult | null
  params: UbiParams
  onClose: () => void
}

function CountrySummary({ t, lang, country, result, params, onClose }: Props) {
  if (!country) {
    return (
      <section className="summary-card summary-empty">
        <h2>{t.noSelectionTitle}</h2>
        <p>{t.noSelectionHint}</p>
      </section>
    )
  }

  const name = countryName(country, lang)
  const categoryKey = result ? categoryLabelKey(result.category) : 'noData'

  return (
    <section className="summary-card" aria-live="polite">
      <header className="summary-head">
        <div>
          <h2 className="summary-name">{name}</h2>
          <span className="iso">{country.iso3}</span>
        </div>
        <button type="button" className="close-btn" onClick={onClose} aria-label={t.close}>
          ×
        </button>
      </header>

      <span className={`category-badge badge-${categoryKey}`}>{t[categoryKey]}</span>

      {!result || result.category === 'Sin datos' ? (
        <div className="nodata">
          <p>{t.noDataDesc}</p>
          {result && result.missing.length > 0 && (
            <div className="missing">
              <strong>{t.missingTitle}:</strong>{' '}
              {result.missing.map((key) => indicatorLabel(key, t)).join(', ')}
            </div>
          )}
        </div>
      ) : (
        <>
          <p className="plain-summary">{summarize(result, t)}</p>
          <p className="category-reason">{categoryReason(result, params, t)}</p>

          <div className="kpis">
            <div className="kpi">
              <span className="kpi-label">{t.summaryIncome}</span>
              <span className="kpi-value">
                {formatNumber(result.ubiAdultPppMonth, lang)} <small>{t.perMonthPpp}</small>
              </span>
              <span className="kpi-sub">
                {fillTemplate(t.nominalApprox, {
                  value: formatNumber(result.ubiAdultNominalMonth, lang),
                })}
              </span>
            </div>
            <div className="kpi">
              <span className="kpi-label">{t.summaryCost}</span>
              <span className="kpi-value">
                {formatPctValue(result.netCostPctGdp)} <small>% {t.ofGdp}</small>
              </span>
              <span className="kpi-sub">
                {fillTemplate(t.grossShort, { value: formatPct(result.grossCostPctGdp) })}
              </span>
            </div>
            <div className={`kpi ${(result.gapPctGdp ?? 0) <= 0 ? 'kpi-ok' : 'kpi-gap'}`}>
              <span className="kpi-label">{t.summaryGap}</span>
              <span className="kpi-value">
                {(result.gapPctGdp ?? 0) <= 0 ? (
                  t.summaryCovered
                ) : (
                  <>
                    {formatPctValue(result.gapPctGdp)} <small>% {t.ofGdp}</small>
                  </>
                )}
              </span>
              <span className="kpi-sub">
                {(result.gapPctGdp ?? 0) > 0 && result.aiGrowthNeededPct !== undefined
                  ? result.aiGrowthNeededPct === Infinity
                    ? t.impossibleShort
                    : `${t.aiGrowthNeeded}: ${formatPct(result.aiGrowthNeededPct)} ${t.ofGdp}`
                  : ' '}
              </span>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default CountrySummary
