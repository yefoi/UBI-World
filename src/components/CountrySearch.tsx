import { useMemo } from 'react'
import type { Translations, Lang } from '../i18n/translations'
import type { CountryRawData, UbiResult } from '../model/ubi'
import { countryName, matchesCountry } from '../utils/country'
import { categoryLabelKey } from './mapColors'

interface Props {
  t: Translations
  lang: Lang
  search: string
  setSearch: (value: string) => void
  countries: CountryRawData[]
  results: Map<string, UbiResult>
  onSelect: (iso3: string) => void
}

function CountrySearch({ t, lang, search, setSearch, countries, results, onSelect }: Props) {
  const matches = useMemo(() => {
    const query = search.trim()
    if (!query) return []
    return countries.filter((country) => matchesCountry(country, query)).slice(0, 30)
  }, [countries, search])

  const showResults = search.trim().length > 0

  return (
    <div className="country-search">
      <label htmlFor="country-search" className="control-label">
        {t.searchCountry}
      </label>
      <input
        id="country-search"
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={t.searchCountry}
        autoComplete="off"
        enterKeyHint="search"
      />
      {showResults && (
        <div className="search-results" role="listbox" aria-label={t.searchCountry}>
          {matches.length === 0 && <p className="search-empty">{t.noResults}</p>}
          {matches.map((country) => {
            const result = results.get(country.iso3)
            return (
              <button
                key={country.iso3}
                type="button"
                role="option"
                aria-selected="false"
                onClick={() => {
                  onSelect(country.iso3)
                  setSearch('')
                }}
                className="search-result"
              >
                <span>
                  {countryName(country, lang)} <span className="iso">({country.iso3})</span>
                </span>
                {result && (
                  <span className="result-badge">{t[categoryLabelKey(result.category)]}</span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CountrySearch
