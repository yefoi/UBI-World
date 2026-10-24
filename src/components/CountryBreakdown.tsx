import type { Translations, Lang } from '../i18n/translations'
import type { CountryRawData, UbiParams, UbiResult } from '../model/ubi'
import { fillTemplate, formatNumber, formatPct, formatPctValue } from '../utils/format'
import { INDICATOR_KEYS, indicatorLabel } from '../utils/indicators'
import InfoTip from './InfoTip'

interface Props {
  t: Translations
  lang: Lang
  country: CountryRawData | null
  result: UbiResult | null
  params: UbiParams
}

function CountryBreakdown({ t, lang, country, result, params }: Props) {
  if (!country) return null

  if (!result || result.category === 'Sin datos') {
    return (
      <section className="breakdown">
        <DataYears t={t} country={country} />
        {result && result.missing.length > 0 && (
          <p className="missing">
            <strong>{t.missingTitle}:</strong>{' '}
            {result.missing.map((key) => indicatorLabel(key, t)).join(', ')}
          </p>
        )}
      </section>
    )
  }

  const gross = result.grossCostPctGdp ?? 0
  const replaced = result.replacedSpendingPctGdp ?? 0
  const net = result.netCostPctGdp ?? 0
  const margin = result.fiscalMarginPctGdp ?? 0
  const ai = result.aiExtraIncomePctGdp ?? 0
  const gap = result.gapPctGdp ?? 0
  const financing = replaced + margin + ai
  const surplus = Math.max(0, financing - gross)
  const scale = Math.max(gross, financing, 0.0001)
  const width = (value: number) => `${Math.max(0, (value / scale) * 100)}%`

  const govExp = country.gov_exp_pct_gdp ?? 0
  const taxRevenue = country.tax_revenue_pct_gdp ?? 0
  const potentialReplaced = govExp * (params.publicSpendingReplacedPct / 100)

  return (
    <section className="breakdown">
      <h3>{t.fundingTitle}</h3>
      <p className="muted">{t.fundingSubtitle}</p>

      {gross > 0 && (
        <>
          <div className="fund-bar" aria-hidden="true">
            <span className="fund-seg fund-replaced" style={{ width: width(replaced) }} />
            <span className="fund-seg fund-margin" style={{ width: width(margin) }} />
            <span className="fund-seg fund-ai" style={{ width: width(ai) }} />
            {gap > 0 && <span className="fund-seg fund-gap" style={{ width: width(gap) }} />}
          </div>
          <div className="fund-legend">
            <span>
              <i className="dot dot-replaced" /> {t.fundingReplaced} {formatPct(replaced)}
            </span>
            <span>
              <i className="dot dot-margin" /> {t.fundingMargin} {formatPct(margin)}
            </span>
            <span>
              <i className="dot dot-ai" /> {t.fundingAi} {formatPct(ai)}
            </span>
            <span>
              <i className="dot dot-gap" /> {t.fundingGap} {formatPct(Math.max(0, gap))}
            </span>
          </div>
        </>
      )}

      {surplus > 0 && (
        <p className="muted">{fillTemplate(t.surplus, { value: surplus.toFixed(1) })}</p>
      )}

      <h3>{t.howCalculated}</h3>
      <ol className="calc-steps">
        <li>
          <div className="step-head">
            <strong>{t.stepPeople}</strong>
            <InfoTip id="renta-basica" lang={lang} />
          </div>
          <p>
            {formatNumber(result.adultsCount, lang)} {t.adults.toLowerCase()} ×{' '}
            {formatNumber(result.ubiAdultPppMonth, lang)} {t.perMonthPpp}
            {params.coverage === 'adults_and_children' && (
              <>
                {' '}
                + {formatNumber(result.childrenCount, lang)} {t.children.toLowerCase()} ×{' '}
                {formatNumber(result.ubiChildPppMonth, lang)} {t.perMonthPpp}
              </>
            )}{' '}
            <span className="muted">
              {fillTemplate(t.perAdultNote, {
                value: formatNumber(result.ubiAdultNominalMonth, lang),
                unit: t.perMonthNominal,
              })}
            </span>
          </p>
        </li>
        <li>
          <div className="step-head">
            <strong>{t.stepGross}</strong>
            <InfoTip id="coste-bruto" lang={lang} />
          </div>
          <p>
            {formatPct(gross)} {t.ofGdp} ≈ {formatNumber(result.grossCostUsdYear, lang)}{' '}
            {t.perYearNominal}
          </p>
        </li>
        <li>
          <div className="step-head">
            <strong>{t.stepReplace}</strong>
            <InfoTip id="gasto-reaprovechado" lang={lang} />
          </div>
          <p>
            {fillTemplate(t.stepReplaceText, {
              substitution: String(params.publicSpendingReplacedPct),
              govExp: formatPct(govExp),
              govLabel: t.indGovExp.toLowerCase(),
              potential: formatPct(potentialReplaced),
              ofGdp: t.ofGdp,
              gross: formatPct(gross),
              replaced: formatPct(replaced),
              net: formatPct(net),
            })}
          </p>
          <p className="muted">{t.replaceHint}</p>
        </li>
        <li>
          <div className="step-head">
            <strong>{t.stepMargin}</strong>
            <InfoTip id="impuestos-nuevos" lang={lang} />
          </div>
          <p>
            {fillTemplate(t.stepMarginText, {
              ceiling: String(params.fiscalPressureCeilingPctGdp),
              tax: formatPct(taxRevenue),
              margin: formatPct(margin),
              ofGdp: t.ofGdp,
            })}
          </p>
          <p className="muted">{t.marginHint}</p>
        </li>
        <li>
          <div className="step-head">
            <strong>{t.stepAi}</strong>
            <InfoTip id="ia-extra" lang={lang} />
          </div>
          <p>
            {fillTemplate(t.stepAiText, {
              growth: String(params.aiGrowthG),
              domestic: String(params.domesticAiPct),
              capture: String(params.stateCapturePct),
              ai: formatPct(ai),
              ofGdp: t.ofGdp,
            })}
          </p>
        </li>
        <li>
          <div className="step-head">
            <strong>{t.stepGap}</strong>
            <InfoTip id="brecha" lang={lang} />
          </div>
          <p>
            {fillTemplate(t.stepGapText, {
              net: formatPct(net),
              margin: formatPct(margin),
              ai: formatPct(ai),
              gap: `${formatPctValue(gap)}%`,
              ofGdp: t.ofGdp,
            })}
          </p>
        </li>
        <li>
          <div className="step-head">
            <strong>{t.stepNeeded}</strong>
          </div>
          {gap <= 0 ? (
            <p>{t.stepNeededNone}</p>
          ) : result.aiGrowthNeededPct === Infinity ? (
            <p>{t.stepNeededImpossible}</p>
          ) : (
            <p>
              {fillTemplate(t.stepNeededText, {
                gap: formatPct(gap),
                domestic: String(params.domesticAiPct),
                capture: String(params.stateCapturePct),
                needed: formatPct(result.aiGrowthNeededPct),
                ofGdp: t.ofGdp,
              })}
            </p>
          )}
        </li>
      </ol>

      <DataYears t={t} country={country} />
    </section>
  )
}

function DataYears({ t, country }: { t: Translations; country: CountryRawData }) {
  const entries = INDICATOR_KEYS.map((key) => ({ key, year: country.years[key] })).filter(
    (entry): entry is { key: (typeof INDICATOR_KEYS)[number]; year: string } => Boolean(entry.year),
  )
  if (entries.length === 0) return null

  const numericYears = entries
    .map((entry) => Number.parseInt(entry.year, 10))
    .filter((year) => Number.isFinite(year))
  const spread =
    numericYears.length > 0 ? Math.max(...numericYears) - Math.min(...numericYears) : 0

  return (
    <div className="data-years">
      <h4>{t.dataTitle}</h4>
      <div className="year-chips">
        {entries.map((entry) => (
          <span key={entry.key} className="year-chip">
            {indicatorLabel(entry.key, t)} <strong>{entry.year}</strong>
          </span>
        ))}
      </div>
      {spread >= 3 && (
        <p className="warning">{fillTemplate(t.dataYearsWarning, { years: String(spread) })}</p>
      )}
      <p className="muted">{t.updatedWith}</p>
    </div>
  )
}

export default CountryBreakdown
