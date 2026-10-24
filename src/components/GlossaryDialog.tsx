import { useRef } from 'react'
import { GLOSSARY } from '../i18n/glossary'
import type { Lang, Translations } from '../i18n/translations'
import { useFocusTrap } from '../hooks/useFocusTrap'

interface Props {
  open: boolean
  onClose: () => void
  lang: Lang
  t: Translations
}

function GlossaryDialog({ open, onClose, lang, t }: Props) {
  const dialogRef = useRef<HTMLElement>(null)
  useFocusTrap(dialogRef, open, onClose)

  if (!open) return null

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        ref={dialogRef}
        tabIndex={-1}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="glossary-title"
      >
        <header className="modal-head">
          <div>
            <h2 id="glossary-title">{t.glossary}</h2>
            <p className="muted">{t.glossaryIntro}</p>
          </div>
          <button type="button" className="close-btn" onClick={onClose} aria-label={t.close}>
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
