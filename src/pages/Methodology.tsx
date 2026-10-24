import { Link } from 'react-router-dom'
import { useState } from 'react'
import { getDict, type Lang } from '../i18n/translations'
import { GLOSSARY } from '../i18n/glossary'
import { methodologyContent } from '../i18n/methodology'



function Methodology() {
  const [lang, setLang] = useState<Lang>('es')
  const t = getDict(lang)
  const c = methodologyContent[lang]

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
        <section className="one-line">
          <h2>{c.oneLineTitle}</h2>
          <p>{c.oneLine}</p>
        </section>
        <p className="lead">{c.notPrediction}</p>

        <h2>{c.whatTitle}</h2>
        <ul>
          {c.what.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2>{c.ingredientsTitle}</h2>
        {c.ingredients.map(([title, body]) => (
          <article key={title} className="plain-card">
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}

        <h2>{c.stepsTitle}</h2>
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

        <details className="advanced-panel methodology-details">
          <summary>{c.wordsTitle}</summary>
          <p className="muted">{c.wordsIntro}</p>
          <div className="glossary-list compact">
            {GLOSSARY.map((entry) => (
              <article key={entry.id}>
                <h3>{entry.term[lang]}</h3>
                <p>{entry.plain[lang]}</p>
                <p className="info-example">
                  <strong>{t.exampleLabel}:</strong> {entry.example[lang]}
                </p>
              </article>
            ))}
          </div>
        </details>

        <details className="advanced-panel methodology-details">
          <summary>{c.technicalTitle}</summary>
          <ul>
            {c.technical.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </details>

        <h2>{c.dataTitle}</h2>
        <p>{c.dataIntro}</p>
        <div className="method-links">
          <a
            href="https://github.com/yefoi/UBI-World/blob/main/docs/METHODOLOGY.md"
            target="_blank"
            rel="noreferrer"
          >
            {c.docs}
          </a>
        </div>
      </main>
    </div>
  )
}

export default Methodology
