import { Link } from 'react-router-dom'
import { useState } from 'react'
import { getDict, type Lang } from '../i18n/translations'

function Methodology() {
  const [lang, setLang] = useState<Lang>('es')
  const t = getDict(lang)
  
  return (
    <div className="methodology-page">
      <header className="header">
        <div className="header-content">
          <h1>UBI World - {t.methodology}</h1>
          <div className="header-actions">
            <Link to="/" className="link">← Volver / Back</Link>
            <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="lang-btn">
              {lang === 'es' ? 'EN' : 'ES'}
            </button>
          </div>
        </div>
      </header>
      
      <main className="methodology-content">
        <p><strong>{t.disclaimer}</strong></p>
        
        <h2>Datos</h2>
        <p>Datos obtenidos de la API del Banco Mundial. Para cada indicador se toma el <strong>último año disponible de los últimos 5 años</strong>. Si falta algún dato imprescindible, el país aparece en gris y <strong>no se inventa ni rellena</strong>.</p>
        <ul>
          <li>PIB (US$ corrientes): NY.GDP.MKTP.CD</li>
          <li>Población total: SP.POP.TOTL</li>
          <li>% población 0-14 años: SP.POP.0014.TO.ZS</li>
          <li>PIB per cápita PPA (US$): NY.GDP.PCAP.PP.CD</li>
          <li>Ingresos fiscales (% PIB): GC.TAX.TOTL.GD.ZS</li>
          <li>Gasto público (% PIB): GC.XPN.TOTL.GD.ZS</li>
        </ul>
        
        <h2>Fórmulas</h2>
        <p>Ver <code>docs/METHODOLOGY.md</code> para las fórmulas completas, supuestos y limitaciones detalladas.</p>
        
        <h2>Limitaciones</h2>
        <ul>
          <li><strong>Simplificado</strong>: no modela inflación, tipo de cambio, distribución, informalidad o deuda.</li>
          <li><strong>Aproximado</strong>: margen fiscal = ingresos fiscales actuales (simplificación).</li>
          <li><strong>Hipotético</strong>: parámetros de IA (propiedad, captación por Estado) son escenarios hipotéticos.</li>
          <li><strong>Divulgativo</strong>: genera debate, no predice el futuro.</li>
        </ul>
        
        <a href="/docs/METHODOLOGY.md" target="_blank">Ver metodología completa (MD)</a>
      </main>
    </div>
  )
}

export default Methodology
