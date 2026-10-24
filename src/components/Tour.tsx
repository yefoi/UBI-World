import { useEffect, useRef, useState } from 'react'
import type { Translations } from '../i18n/translations'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { fillTemplate } from '../utils/format'

interface Props {
  open: boolean
  onClose: () => void
  t: Translations
}

function Tour({ open, onClose, t }: Props) {
  const [step, setStep] = useState(0)
  const dialogRef = useRef<HTMLElement>(null)
  useFocusTrap(dialogRef, open, onClose)

  const steps = [
    { title: t.tourStep1Title, body: t.tourStep1 },
    { title: t.tourStep2Title, body: t.tourStep2 },
    { title: t.tourStep3Title, body: t.tourStep3 },
  ]

  useEffect(() => {
    if (open) setStep(0)
  }, [open])

  if (!open) return null

  const isLast = step === steps.length - 1
  const current = steps[step]

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
        className="modal tour"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
      >
        <header className="modal-head">
          <div>
            <span className="tour-counter">
              {fillTemplate(t.tourProgress, {
                current: String(step + 1),
                total: String(steps.length),
              })}
            </span>
            <h2 id="tour-title">{t.tourTitle}</h2>
          </div>
          <button type="button" className="close-btn" onClick={onClose} aria-label={t.close}>
            ×
          </button>
        </header>

        <h3 className="tour-step-title">{current.title}</h3>
        <p className="tour-body">{current.body}</p>

        <div className="tour-dots" aria-hidden="true">
          {steps.map((_, index) => (
            <span key={index} className={index === step ? 'tour-dot active' : 'tour-dot'} />
          ))}
        </div>

        <div className="tour-actions">
          <button type="button" className="ghost-btn" onClick={onClose}>
            {t.tourSkip}
          </button>
          <div className="tour-nav">
            {step > 0 && (
              <button type="button" className="ghost-btn" onClick={() => setStep(step - 1)}>
                {t.tourBack}
              </button>
            )}
            <button
              type="button"
              className="primary-btn"
              onClick={() => (isLast ? onClose() : setStep(step + 1))}
            >
              {isLast ? t.tourDone : t.tourNext}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Tour
