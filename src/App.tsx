import { Link, useSearchParams } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import countriesDataRaw from './data/countries.json'
import type { CountryRawData } from './model/ubi'
import { calculateUbi } from './model/ubi'
import { defaultUbiParams, presets } from './utils/presets'
import { getDict, type Lang } from './i18n/translations'
import { searchFromState, stateFromSearch } from './utils/urlState'
import { useMediaQuery } from './hooks/useMediaQuery'
import WorldMap from './components/Map'
import Legend from './components/Legend'
import CountrySearch from './components/CountrySearch'
import CountrySummary from './components/CountrySummary'
import CountryBreakdown from './components/CountryBreakdown'
import Controls from './components/Controls'
import type { MapMetric } from './components/mapColors'

const countriesData = countriesDataRaw as CountryRawData[]

function App() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initial = useMemo(() => stateFromSearch(searchParams.toString()), []) // solo al montar

  const [lang, setLang] = useState<Lang>(initial.lang)
  const [params, setParams] = useState(() => initial.params || defaultUbiParams)
  const [selectedIso3, setSelectedIso3] = useState<string | null>(initial.iso3)
  const [metric, setMetric] = useState<MapMetric>(initial.metric)
  const [search, setSearch] = useState('')

  const isWide = useMediaQuery('(min-width: 900px)')
  const t = getDict(lang)
  const previousSelection = useRef<string | null>(null)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    const next = searchFromState({ lang, metric, iso3: selectedIso3, params })
    if (next !== searchParams.toString()) {
      setSearchParams(next, { replace: true })
    }
  }, [lang, metric, selectedIso3, params, searchParams, setSearchParams])

  useEffect(() => {
    if (isWide || !selectedIso3) return
    if (previousSelection.current === selectedIso3) return
    previousSelection.current = selectedIso3
    const target = document.getElementById('resultado')
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [selectedIso3, isWide])

  const results = useMemo(() => {
    const map = new Map<string, ReturnType<typeof calculateUbi>>()
    for (const country of countriesData) {
      map.set(country.iso3, calculateUbi(country, params))
    }
    return map
  }, [params])

  const selectedResult = selectedIso3 ? results.get(selectedIso3) ?? null : null
  const selectedCountry = selectedIso3
    ? countriesData.find((country) => country.iso3 === selectedIso3) ?? null
    : null

  const mapSection = (
    <section className="map-col">
      <WorldMap
        t={t}
        lang={lang}
        countries={countriesData}
        results={results}
        metric={metric}
        selectedIso3={selectedIso3}
        onCountryClick={setSelectedIso3}
      />
      <Legend t={t} metric={metric} />
      {isWide && <div className="disclaimer">{t.disclaimer}</div>}
    </section>
  )

  const summary = (
    <div id="resultado">
      <CountrySummary
        t={t}
        lang={lang}
        country={selectedCountry}
        result={selectedResult}
        params={params}
        onClose={() => setSelectedIso3(null)}
      />
    </div>
  )

  const searchBox = (
    <CountrySearch
      t={t}
      lang={lang}
      search={search}
      setSearch={setSearch}
      countries={countriesData}
      results={results}
      onSelect={setSelectedIso3}
    />
  )

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>
              <Link to="/" className="brand">
                {t.title}
              </Link>
            </h1>
            <p className="subtitle">{t.subtitle}</p>
          </div>
          <div className="header-actions">
            <Link to={lang === 'es' ? '/metodologia' : '/methodology'} className="link">
              {t.methodology}
            </Link>
            <button
              type="button"
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
              className="lang-btn"
            >
              {lang === 'es' ? 'EN' : 'ES'}
            </button>
          </div>
        </div>
      </header>

      {isWide ? (
        <main className="main main-wide">
          <aside className="sidebar">
            {searchBox}
            {summary}
            <Controls
              t={t}
              lang={lang}
              params={params}
              setParams={setParams}
              presets={presets}
              metric={metric}
              setMetric={setMetric}
              collapsible={false}
            />
            {selectedCountry && (
              <CountryBreakdown
                t={t}
                lang={lang}
                country={selectedCountry}
                result={selectedResult}
                params={params}
              />
            )}
          </aside>
          {mapSection}
        </main>
      ) : (
        <main className="main">
          <div className="mobile-top">
            {searchBox}
            {summary}
          </div>
          {mapSection}
          <Controls
            t={t}
            lang={lang}
            params={params}
            setParams={setParams}
            presets={presets}
            metric={metric}
            setMetric={setMetric}
            collapsible
          />
          {selectedCountry && (
            <details className="advanced-panel breakdown-panel">
              <summary>{t.breakdownTitle}</summary>
              <CountryBreakdown
                t={t}
                lang={lang}
                country={selectedCountry}
                result={selectedResult}
                params={params}
              />
            </details>
          )}
          <div className="disclaimer">{t.disclaimer}</div>
        </main>
      )}
    </div>
  )
}

export default App
