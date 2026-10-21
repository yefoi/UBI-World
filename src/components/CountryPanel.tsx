import type { Translations } from '../i18n/translations'
import type { CountryRawData } from '../model/ubi'
import type { calculateUbi } from '../model/ubi'

interface Props {
  t: Translations
  country: CountryRawData | null
  result: ReturnType<typeof calculateUbi> | null
}

function formatNumber(n: number) {
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T'
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  return n.toLocaleString()
}

function CountryPanel({ t, country, result }: Props) {
  if (!country) {
    return (
      <div className="country-panel">
        <p>{t.mapTooltip}</p>
      </div>
    )
  }
  
  return (
    <div className="country-panel">
      <h3>{country.name} ({country.iso3})</h3>
      
      {result?.category === 'Sin datos' ? (
        <div className="nodata">
          <strong>{t.noData}</strong>
          <p>{t.noDataDesc}</p>
          {result.missing.length > 0 && (
            <small>Missing: {result.missing.join(', ')}</small>
          )}
          {country.years && Object.entries(country.years).filter(([_, v]) => v).length > 0 && (
            <small>{t.updatedWith}: {Object.values(country.years).find(v => v)}</small>
          )}
        </div>
      ) : result ? (
        <>
          <div className="category-badge category-{result.category}">{t[categoryKey(result.category)]}</div>
          
          <div className="stats">
            {result.grossCostPctGdp !== undefined && (
              <div className="stat-row">
                <span>{t.grossCost}:</span>
                <span>{result.grossCostPctGdp}% PIB ({formatNumber(result.grossCostUsdYear || 0)} US$/año)</span>
              </div>
            )}
            {result.netCostPctGdp !== undefined && (
              <div className="stat-row">
                <span>{t.netCost}:</span>
                <span>{result.netCostPctGdp}% PIB</span>
              </div>
            )}
            {result.fiscalMarginPctGdp !== undefined && (
              <div className="stat-row">
                <span>{t.fiscalMargin}:</span>
                <span>{result.fiscalMarginPctGdp}% PIB</span>
              </div>
            )}
            {result.aiExtraIncomePctGdp !== undefined && (
              <div className="stat-row">
                <span>{t.aiIncome}:</span>
                <span>+{result.aiExtraIncomePctGdp}% PIB</span>
              </div>
            )}
            {result.gapPctGdp !== undefined && (
              <div className="stat-row highlight">
                <span>{t.gapTotal}:</span>
                <span>{result.gapPctGdp <= 0 ? '' : '+'}{result.gapPctGdp}% PIB</span>
              </div>
            )}
            {result.aiGrowthNeededPct !== undefined && result.aiGrowthNeededPct !== Infinity && (
              <div className="stat-row">
                <span>{t.aiGrowthNeeded}:</span>
                <span>+{result.aiGrowthNeededPct}% PIB</span>
              </div>
            )}
            {result.aiGrowthNeededPct === Infinity && (
              <div className="stat-row">
                <span>{t.aiGrowthNeeded}:</span>
                <span>∞ (imposible)</span>
              </div>
            )}
            {result.adultsCount !== undefined && (
              <div className="stat-row small">
                <span>{t.adults}:</span>
                <span>{formatNumber(result.adultsCount)}</span>
              </div>
            )}
            {result.childrenCount !== undefined && (
              <div className="stat-row small">
                <span>{t.children}:</span>
                <span>{formatNumber(result.childrenCount)}</span>
              </div>
            )}
            {result.ubiAdultUsdMonth !== undefined && (
              <div className="stat-row small">
                <span>UBI adulto:</span>
                <span>${result.ubiAdultUsdMonth}/{t.perMonth}</span>
              </div>
            )}
          </div>
          
          <div className="assumptions">
            <h4>{t.assumptions}</h4>
            <ul>
              {result.assumptions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
          
          {country.years && (
            <small className="years">
              {t.updatedWith}: {Object.values(country.years).filter(v => v)[0] || 'N/A'}
            </small>
          )}
        </>
      ) : null}
    </div>
  )
}

function categoryKey(c: string): keyof Translations {
  switch (c) {
    case 'Viable hoy': return 'viableNow'
    case 'Viable con IA moderada': return 'viableModerate'
    case 'Requiere IA extrema': return 'extremeAI'
    case 'Inviable': return 'notViable'
    case 'Sin datos': return 'noData'
    default: return 'noData'
  }
}

export default CountryPanel
