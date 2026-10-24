import { Link } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import countriesDataRaw from './data/countries.json'
import type { CountryRawData, UbiParams } from './model/ubi'
import { calculateUbi } from './model/ubi'
import { defaultUbiParams, presets } from './utils/presets'
import { getDict, type Lang } from './i18n/translations'
import WorldMap from './components/Map'
import CountryPanel from './components/CountryPanel'
import Controls from './components/Controls'

const countriesData = countriesDataRaw as CountryRawData[]

type Metric = 'category' | 'gap'

function App() {
  const [lang, setLang] = useState<Lang>('es')
  const [params, setParams] = useState<UbiParams>(defaultUbiParams)
  const [selectedIso3, setSelectedIso3] = useState<string | null>(null)
  const [metric, setMetric] = useState<Metric>('category')
  const [search, setSearch] = useState('')
  
  const t = getDict(lang)
  
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
  
  const results = useMemo(() => {
    const m = new Map<string, ReturnType<typeof calculateUbi>>()
    for (const c of countriesData) {
      m.set(c.iso3, calculateUbi(c, params))
    }
    return m
  }, [params])
  
  const selectedResult = selectedIso3 ? results.get(selectedIso3) : null
  const selectedCountry = selectedIso3 ? countriesData.find(c => c.iso3 === selectedIso3) : null
  
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>{t.title}</h1>
            <p className="subtitle">{t.subtitle}</p>
          </div>
          <div className="header-actions">
            <Link to={lang === 'es' ? '/metodologia' : '/methodology'} className="link">
              {t.methodology}
            </Link>
            <button
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
              className="lang-btn"
            >
              {lang === 'es' ? 'EN' : 'ES'}
            </button>
          </div>
        </div>
      </header>
      
      <main className="main">
        <div className="sidebar">
          <Controls
            t={t}
            lang={lang}
            params={params}
            setParams={setParams}
            presets={presets}
            metric={metric}
            setMetric={setMetric}
            search={search}
            setSearch={setSearch}
            countries={countriesData}
            results={results}
            setSelectedIso3={setSelectedIso3}
          />
          <CountryPanel
            t={t}
            country={selectedCountry || null}
            result={selectedResult || null}
          />
        </div>
        
        <div className="map-container">
          <WorldMap
            t={t}
            countries={countriesData}
            results={results}
            metric={metric}
            selectedIso3={selectedIso3}
            onCountryClick={setSelectedIso3}
          />
          <div className="disclaimer">{t.disclaimer}</div>
        </div>
      </main>
    </div>
  )
}

export default App
