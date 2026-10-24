import type { Translations, Lang } from '../i18n/translations'
import type { UbiParams } from '../model/ubi'
import type { Preset } from '../utils/presets'
import { METRIC_OPTIONS, type MapMetric } from './mapColors'

interface Props {
  t: Translations
  lang: Lang
  params: UbiParams
  setParams: (params: UbiParams) => void
  presets: Preset[]
  metric: MapMetric
  setMetric: (metric: MapMetric) => void
  collapsible: boolean
}

function Controls({ t, lang, params, setParams, presets, metric, setMetric, collapsible }: Props) {
  const updateParam = <K extends keyof UbiParams>(key: K, value: UbiParams[K]) => {
    setParams({ ...params, [key]: value })
  }

  const applyPreset = (preset: Preset) => {
    setParams({ ...params, ...preset.params })
  }

  const content = (
    <>
      <div className="control-section">
        <span className="control-label">{t.presets}</span>
        <div className="preset-buttons">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset)}
              className="preset-btn"
            >
              {lang === 'en' ? preset.name.en : preset.name.es}
            </button>
          ))}
        </div>
      </div>

      <div className="control-section">
        <label className="control-label" htmlFor="metric-select">
          {t.metric}
        </label>
        <select
          id="metric-select"
          value={metric}
          onChange={(event) => setMetric(event.target.value as MapMetric)}
        >
          {METRIC_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {t[option.labelKey]}
            </option>
          ))}
        </select>
      </div>

      <div className="control-section">
        <label className="control-label" htmlFor="ubi-amount-type">
          {t.ubiAmount}
        </label>
        <select
          id="ubi-amount-type"
          value={params.ubiAmountType}
          onChange={(event) =>
            updateParam('ubiAmountType', event.target.value as UbiParams['ubiAmountType'])
          }
        >
          <option value="pct_gdp_pc_ppa">{t.pctGdpPc}</option>
          <option value="usd_month_ppa">{t.usdMonth}</option>
        </select>

        {params.ubiAmountType === 'pct_gdp_pc_ppa' ? (
          <>
            <input
              id="ubi-pct"
              type="range"
              min="0"
              max="80"
              step="1"
              value={params.ubiPctGdpPcPpa}
              onChange={(event) => updateParam('ubiPctGdpPcPpa', Number(event.target.value))}
            />
            <div className="value">{params.ubiPctGdpPcPpa}%</div>
          </>
        ) : (
          <>
            <input
              id="ubi-usd"
              type="range"
              min="0"
              max="2000"
              step="10"
              value={params.ubiUsdMonthPpa}
              onChange={(event) => updateParam('ubiUsdMonthPpa', Number(event.target.value))}
            />
            <div className="value">{params.ubiUsdMonthPpa} US$ PPA/mes</div>
          </>
        )}
      </div>

      <div className="control-section">
        <label className="control-label" htmlFor="coverage">
          {t.coverage}
        </label>
        <select
          id="coverage"
          value={params.coverage}
          onChange={(event) =>
            updateParam('coverage', event.target.value as UbiParams['coverage'])
          }
        >
          <option value="adults_only">{t.adultsOnly}</option>
          <option value="adults_and_children">{t.adultsAndChildren}</option>
        </select>
      </div>

      <div className="control-section">
        <label className="control-label" htmlFor="substitution">
          {t.publicSpendingReplace} ({params.publicSpendingReplacedPct}%)
        </label>
        <input
          id="substitution"
          type="range"
          min="0"
          max="80"
          step="5"
          value={params.publicSpendingReplacedPct}
          onChange={(event) =>
            updateParam('publicSpendingReplacedPct', Number(event.target.value))
          }
        />
        <p className="control-hint">{t.replaceHint}</p>
      </div>

      <div className="control-section">
        <label className="control-label" htmlFor="ai-growth">
          {t.aiGrowth} ({params.aiGrowthG}%)
        </label>
        <input
          id="ai-growth"
          type="range"
          min="0"
          max="30"
          step="0.5"
          value={params.aiGrowthG}
          onChange={(event) => updateParam('aiGrowthG', Number(event.target.value))}
        />
      </div>

      <div className="control-section">
        <label className="control-label" htmlFor="state-capture">
          {t.stateCapture} ({params.stateCapturePct}%)
        </label>
        <input
          id="state-capture"
          type="range"
          min="0"
          max="90"
          step="5"
          value={params.stateCapturePct}
          onChange={(event) => updateParam('stateCapturePct', Number(event.target.value))}
        />
      </div>

      <div className="control-section">
        <label className="control-label" htmlFor="domestic-ai">
          {t.domesticAi} ({params.domesticAiPct}%)
        </label>
        <input
          id="domestic-ai"
          type="range"
          min="0"
          max="90"
          step="5"
          value={params.domesticAiPct}
          onChange={(event) => updateParam('domesticAiPct', Number(event.target.value))}
        />
      </div>

      <div className="control-section">
        <label className="control-label" htmlFor="fiscal-ceiling">
          {t.fiscalCeiling} ({params.fiscalPressureCeilingPctGdp}%)
        </label>
        <input
          id="fiscal-ceiling"
          type="range"
          min="30"
          max="80"
          step="5"
          value={params.fiscalPressureCeilingPctGdp}
          onChange={(event) =>
            updateParam('fiscalPressureCeilingPctGdp', Number(event.target.value))
          }
        />
      </div>
    </>
  )

  if (collapsible) {
    return (
      <details className="advanced-panel">
        <summary>{t.advancedParams}</summary>
        <div className="controls">{content}</div>
      </details>
    )
  }

  return <div className="controls">{content}</div>
}

export default Controls
