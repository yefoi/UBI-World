import type { Translations } from '../i18n/translations'
import type { CountryRawData } from '../model/ubi'
import type { calculateUbi } from '../model/ubi'
import type { UbiParams } from '../model/ubi'
import type { Preset } from '../utils/presets'

interface Props {
  t: Translations
  lang?: 'es' | 'en'
  params: UbiParams
  setParams: (p: UbiParams) => void
  presets: Preset[]
  metric: 'category' | 'gap'
  setMetric: (m: 'category' | 'gap') => void
  search: string
  setSearch: (s: string) => void
  countries: CountryRawData[]
  results: Map<string, ReturnType<typeof calculateUbi>>
  setSelectedIso3: (iso3: string | null) => void
}

const categoryLabels: Record<string, keyof Translations> = {
  'Viable hoy': 'viableNow',
  'Viable con IA moderada': 'viableModerate',
  'Requiere IA extrema': 'extremeAI',
  'Inviable': 'notViable',
  'Sin datos': 'noData',
}

function Controls({ t, lang = 'es', params, setParams, presets, metric, setMetric, search, setSearch, countries, results, setSelectedIso3 }: Props) {
  const updateParam = <K extends keyof UbiParams>(key: K, value: UbiParams[K]) => {
    setParams({ ...params, [key]: value })
  }
  
  const applyPreset = (preset: Preset) => {
    setParams({ ...params, ...preset.params })
  }
  
  const filteredCountries = search
    ? countries.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.iso3.toLowerCase().includes(search.toLowerCase()))
    : countries.slice(0, 50)
  
  return (
    <div className="controls">
      <div className="control-section">
        <label>{t.presets}</label>
        <div className="preset-buttons">
          {presets.map(p => (
            <button key={p.id} onClick={() => applyPreset(p)} className="preset-btn">
              {lang === 'en' ? p.name.en : p.name.es}
            </button>
          ))}
        </div>
      </div>
      
      <div className="control-section">
        <label>{t.metric}</label>
        <select value={metric} onChange={e => setMetric(e.target.value as any)}>
          <option value="category">{t.category}</option>
          <option value="gap">{t.gap}</option>
        </select>
      </div>
      
      <div className="control-section">
        <label>{t.searchCountry}</label>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t.searchCountry}
        />
        {search && (
          <div className="search-results">
            {filteredCountries.map(c => {
              const res = results.get(c.iso3)
              return (
                <button
                  key={c.iso3}
                  onClick={() => { setSelectedIso3(c.iso3); setSearch('') }}
                  className="search-result"
                >
                  {c.name} ({c.iso3})
                  {res && <span className="result-badge">{t[categoryLabels[res.category]]}</span>}
                </button>
              )
            })}
          </div>
        )}
      </div>
      
      <div className="control-section">
        <label>{t.ubiAmount}</label>
        <select value={params.ubiAmountType} onChange={e => updateParam('ubiAmountType', e.target.value as any)}>
          <option value="pct_gdp_pc_ppa">{t.pctGdpPc}</option>
          <option value="usd_month_ppa">{t.usdMonth}</option>
        </select>
        
        {params.ubiAmountType === 'pct_gdp_pc_ppa' ? (
          <>
            <input
              type="range"
              min="0"
              max="80"
              step="1"
              value={params.ubiPctGdpPcPpa}
              onChange={e => updateParam('ubiPctGdpPcPpa', Number(e.target.value))}
            />
            <div className="value">{params.ubiPctGdpPcPpa}%</div>
          </>
        ) : (
          <>
            <input
              type="range"
              min="0"
              max="2000"
              step="10"
              value={params.ubiUsdMonthPpa}
              onChange={e => updateParam('ubiUsdMonthPpa', Number(e.target.value))}
            />
            <div className="value">${params.ubiUsdMonthPpa}/mes</div>
          </>
        )}
      </div>
      
      <div className="control-section">
        <label>{t.coverage}</label>
        <select value={params.coverage} onChange={e => updateParam('coverage', e.target.value as any)}>
          <option value="adults_only">{t.adultsOnly}</option>
          <option value="adults_and_children">{t.adultsAndChildren}</option>
        </select>
      </div>
      
      <div className="control-section">
        <label>{t.publicSpendingReplace} ({params.publicSpendingReplacedPct}%)</label>
        <input
          type="range"
          min="0"
          max="80"
          step="5"
          value={params.publicSpendingReplacedPct}
          onChange={e => updateParam('publicSpendingReplacedPct', Number(e.target.value))}
        />
      </div>
      
      <div className="control-section">
        <label>{t.aiGrowth} ({params.aiGrowthG}%)</label>
        <input
          type="range"
          min="0"
          max="30"
          step="0.5"
          value={params.aiGrowthG}
          onChange={e => updateParam('aiGrowthG', Number(e.target.value))}
        />
      </div>
      
      <div className="control-section">
        <label>{t.stateCapture} ({params.stateCapturePct}%)</label>
        <input
          type="range"
          min="0"
          max="90"
          step="5"
          value={params.stateCapturePct}
          onChange={e => updateParam('stateCapturePct', Number(e.target.value))}
        />
      </div>
      
      <div className="control-section">
        <label>{t.domesticAi} ({params.domesticAiPct}%)</label>
        <input
          type="range"
          min="0"
          max="90"
          step="5"
          value={params.domesticAiPct}
          onChange={e => updateParam('domesticAiPct', Number(e.target.value))}
        />
      </div>
      
      <div className="control-section">
        <label>{t.fiscalCeiling} ({params.fiscalPressureCeilingPctGdp}%)</label>
        <input
          type="range"
          min="30"
          max="70"
          step="5"
          value={params.fiscalPressureCeilingPctGdp}
          onChange={e => updateParam('fiscalPressureCeilingPctGdp', Number(e.target.value))}
        />
      </div>
    </div>
  )
}

export default Controls
