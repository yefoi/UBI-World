import { Link } from 'react-router-dom'
import { useState } from 'react'
import { getDict, type Lang } from '../i18n/translations'

const content = {
  es: {
    back: '← Volver al mapa',
    introTitle: 'Qué es y qué no es',
    intro:
      'UBI World responde a una pregunta hipotética: ¿qué tendría que pasar para que una renta básica universal cuadre en este país? No es una predicción, ni una propuesta política, ni asesoría legal o económica. Es una calculadora de supuestos para comparar países y debatir con números a la vista.',
    dataTitle: 'Datos',
    dataIntro:
      'Se descargan de la API del Banco Mundial con npm run fetch-data. Para cada indicador se usa el último año disponible de los últimos cinco y se guarda ese año. Si falta un dato imprescindible, el país aparece en gris y no se inventa ni se rellena. Los años pueden no coincidir entre indicadores; el panel avisa cuando hay desfases.',
    indicators: [
      ['PIB (US$ corrientes)', 'NY.GDP.MKTP.CD'],
      ['Población total', 'SP.POP.TOTL'],
      ['Población 0-14 (%)', 'SP.POP.0014.TO.ZS'],
      ['PIB per cápita PPA (US$)', 'NY.GDP.PCAP.PP.CD'],
      ['Ingresos fiscales (% del PIB)', 'GC.TAX.TOTL.GD.ZS'],
      ['Gasto público (% del PIB)', 'GC.XPN.TOTL.GD.ZS'],
    ],
    formulasTitle: 'Cómo se calcula',
    units: 'Unidades: el PIB en PPA se obtiene como PIB per cápita PPA × población. Todos los porcentajes se calculan en PPA. El importe en US$ corrientes se obtiene aplicando el deflactor implícito del PIB (PIB nominal / PIB PPA). Así no se mezclan importes PPA con un PIB nominal.',
    steps: [
      [
        '1. Cuantía y cobertura',
        'El adulto recibe el porcentaje elegido del PIB per cápita PPA o un importe fijo en US$ PPA/mes. Con cobertura de adultos y menores, el menor recibe el 50% del adulto.',
      ],
      [
        '2. Coste bruto',
        'Coste bruto = adultos × cuantía adulto + menores × cuantía menor. Se expresa como % del PIB PPA.',
      ],
      [
        '3. Gasto público redirigido',
        'Gasto redirigido = gasto público actual × % del control, limitado al coste bruto. El control no descuenta un porcentaje del coste del UBI: mueve dinero que ya se gasta. Los datos del Banco Mundial son agregados, así que la app no identifica programas concretos.',
      ],
      [
        '4. Coste neto',
        'Coste neto = coste bruto − gasto redirigido. Es el dinero nuevo que haría falta cada año.',
      ],
      [
        '5. Recaudación adicional',
        'Recaudación adicional = max(0, techo de presión fiscal − ingresos fiscales actuales). La recaudación actual ya financia el gasto existente y no se trata como dinero libre. Subir el techo amplía este margen; bajarlo por debajo de la recaudación actual lo deja en cero.',
      ],
      [
        '6. Ingreso atribuible a la IA',
        'Ingreso IA = crecimiento extra del PIB por IA × % de producción doméstica × % captado por el Estado. Es un escenario, no una previsión.',
      ],
      [
        '7. Brecha y crecimiento necesario',
        'Brecha = coste neto − recaudación adicional − ingreso IA. Si es positiva, el crecimiento extra por IA necesario = brecha ÷ (% doméstico × % captado). Si la captación es 0, la brecha no se puede cerrar por esta vía.',
      ],
    ],
    categoriesTitle: 'Categorías',
    categories: [
      ['Viable hoy', 'La brecha es ≤ 0 sin crecimiento extra por IA.'],
      ['Viable con IA moderada', 'La brecha es ≤ 0 con la IA ya incluida, o exige menos de 5% extra de PIB.'],
      ['Requiere IA extrema', 'Exige entre 5% y 15% extra de PIB.'],
      ['Inviable', 'Exige 15% o más, o la captación estatal es cero.'],
      ['Sin datos', 'Falta alguno de los seis indicadores.'],
    ],
    limitsTitle: 'Limitaciones',
    limits: [
      'Simplificación fiscal: se usa el gasto público total como base sustituible; los programas concretos no se identifican.',
      'Los ingresos fiscales del Banco Mundial no incluyen todas las cotizaciones sociales, así que el margen puede quedar sobreestimado o subestimado según el país.',
      'No modela evasión, informalidad, deuda, inflación, tipos de cambio, incidencia ni efectos de comportamiento.',
      'El PIB per cápita PPA del Banco Mundial no es un índice de precios de consumo; se usa como deflactor aproximado.',
      'Promedios nacionales: no dicen nada sobre distribución dentro del país.',
      'Los parámetros de IA (crecimiento, propiedad doméstica, captación) son escenarios speculativos.',
      'Los umbrales de las categorías (5% y 15%) son convenciones de esta herramienta, no resultados empíricos.',
    ],
    docs: 'Documentación completa (GitHub)',
    disclaimer:
      'Esta web no afirma obligaciones legales ni viabilidad real. Sirve para ver qué supuestos harían falta y cómo cambian los resultados al moverlos.',
  },
  en: {
    back: '← Back to map',
    introTitle: 'What it is and what it is not',
    intro:
      'UBI World answers a hypothetical question: what would need to happen for a universal basic income to add up in this country? It is not a prediction, a policy proposal, or legal or economic advice. It is a calculator of assumptions to compare countries and debate with the numbers in view.',
    dataTitle: 'Data',
    dataIntro:
      'Data comes from the World Bank API via npm run fetch-data. For each indicator, the latest available year within the last five is used, and that year is stored. If a required value is missing, the country is shown in grey and nothing is invented or filled in. Years may differ across indicators; the panel warns when the spread is large.',
    indicators: [
      ['GDP (current US$)', 'NY.GDP.MKTP.CD'],
      ['Total population', 'SP.POP.TOTL'],
      ['Population 0-14 (%)', 'SP.POP.0014.TO.ZS'],
      ['GDP per capita PPP (US$)', 'NY.GDP.PCAP.PP.CD'],
      ['Tax revenue (% of GDP)', 'GC.TAX.TOTL.GD.ZS'],
      ['Public spending (% of GDP)', 'GC.XPN.TOTL.GD.ZS'],
    ],
    formulasTitle: 'How it is calculated',
    units: 'Units: PPP GDP equals PPP GDP per capita × population. All percentages are calculated in PPP. Current US$ amounts use the implicit GDP deflator (nominal GDP / PPP GDP), so PPP amounts are never divided by nominal GDP.',
    steps: [
      [
        '1. Amount and coverage',
        'An adult receives the chosen share of PPP GDP per capita or a fixed amount in PPP $/month. With adults and children covered, each child receives 50% of the adult amount.',
      ],
      [
        '2. Gross cost',
        'Gross cost = adults × adult amount + children × child amount, expressed as % of PPP GDP.',
      ],
      [
        '3. Redirected public spending',
        'Redirected spending = current public spending × the slider %, capped at the gross cost. The slider does not discount a percentage of the UBI cost: it moves money that is already being spent. World Bank data is aggregate, so the app does not identify specific programmes.',
      ],
      [
        '4. Net cost',
        'Net cost = gross cost − redirected spending. This is the new money needed each year.',
      ],
      [
        '5. Additional revenue',
        'Additional revenue = max(0, fiscal pressure ceiling − current tax revenue). Current revenue already funds existing spending and is not treated as free money. Raising the ceiling increases this room; lowering it below current revenue leaves zero.',
      ],
      [
        '6. Revenue attributable to AI',
        'AI revenue = extra GDP growth from AI × domestic production share × share captured by the state. It is a scenario, not a forecast.',
      ],
      [
        '7. Gap and required growth',
        'Gap = net cost − additional revenue − AI revenue. If positive, the required extra AI growth = gap ÷ (domestic share × capture share). If capture is 0, the gap cannot be closed this way.',
      ],
    ],
    categoriesTitle: 'Categories',
    categories: [
      ['Viable today', 'Gap is ≤ 0 without extra AI growth.'],
      ['Viable with moderate AI', 'Gap is ≤ 0 with AI already included, or requires less than 5% extra GDP.'],
      ['Requires extreme AI', 'Requires between 5% and 15% extra GDP.'],
      ['Not viable', 'Requires 15% or more, or state capture is zero.'],
      ['No data', 'One of the six indicators is missing.'],
    ],
    limitsTitle: 'Limitations',
    limits: [
      'Fiscal simplification: total public spending is used as the substitutable base; specific programmes are not identified.',
      'World Bank tax revenue does not include all social contributions, so the margin may be overestimated or underestimated depending on the country.',
      'It does not model evasion, informality, debt, inflation, exchange rates, incidence, or behavioural effects.',
      'World Bank PPP GDP per capita is not a consumer price index; it is used as an approximate deflator.',
      'National averages say nothing about distribution within a country.',
      'AI parameters (growth, domestic ownership, capture) are speculative scenarios.',
      'The category thresholds (5% and 15%) are conventions of this tool, not empirical findings.',
    ],
    docs: 'Full documentation (GitHub)',
    disclaimer:
      'This site does not assert legal obligations or real-world feasibility. It shows which assumptions would be needed and how results change when you move them.',
  },
} as const

function Methodology() {
  const [lang, setLang] = useState<Lang>('es')
  const t = getDict(lang)
  const c = content[lang]

  return (
    <div className="methodology-page">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>{t.title}</h1>
            <p className="subtitle">{t.methodology}</p>
          </div>
          <div className="header-actions">
            <Link to="/" className="link">
              {c.back}
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

      <main className="methodology-content">
        <p className="lead">{t.disclaimer}</p>

        <h2>{c.introTitle}</h2>
        <p>{c.intro}</p>

        <h2>{c.dataTitle}</h2>
        <p>{c.dataIntro}</p>
        <ul>
          {c.indicators.map(([label, code]) => (
            <li key={code}>
              {label}: <code>{code}</code>
            </li>
          ))}
        </ul>

        <h2>{c.formulasTitle}</h2>
        <p>{c.units}</p>
        <ol className="method-steps">
          {c.steps.map(([title, body]) => (
            <li key={title}>
              <strong>{title}</strong>
              <p>{body}</p>
            </li>
          ))}
        </ol>

        <h2>{c.categoriesTitle}</h2>
        <ul>
          {c.categories.map(([label, body]) => (
            <li key={label}>
              <strong>{label}:</strong> {body}
            </li>
          ))}
        </ul>

        <h2>{c.limitsTitle}</h2>
        <ul>
          {c.limits.map((limit) => (
            <li key={limit}>{limit}</li>
          ))}
        </ul>

        <p>{c.disclaimer}</p>
        <p>
          <a
            href="https://github.com/yefoi/UBI-World/blob/main/docs/METHODOLOGY.md"
            target="_blank"
            rel="noreferrer"
          >
            {c.docs}
          </a>
        </p>
      </main>
    </div>
  )
}

export default Methodology
