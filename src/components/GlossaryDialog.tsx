import { useEffect } from 'react'
import { GLOSSARY } from '../i18n/glossary'
import type { Lang, Translations } from '../i18n/translations'

interface Props {
  open: boolean
  onClose: () => void
  lang: Lang
  t: Translations
}

function GlossaryDialog({ open, onClose, lang, t }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="glossary-title">
        <header className="modal-head">
          <div>
            <h2 id="glossary-title">{t.glossary}</h2>
            <p className="muted">{t.glossaryIntro}</p>
          </div>
          <button type="button" className="close-btn" onClick={onClose} aria-label={t.close} autoFocus>
            ×
          </button>
        </header>
        <div className="glossary-list">
          {GLOSSARY.map((entry) => (
            <article key={entry.id} className="glossary-entry">
              <h3>{entry.term[lang]}</h3>
              <p>{entry.plain[lang]}</p>
              <p className="info-example">
                <strong>{t.exampleLabel}:</strong> {entry.example[lang]}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default GlossaryDialog
