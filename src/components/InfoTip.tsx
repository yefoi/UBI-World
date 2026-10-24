import { glossaryEntry } from '../i18n/glossary'
import type { Lang } from '../i18n/translations'

interface Props {
  id: string
  lang: Lang
}

function InfoTip({ id, lang }: Props) {
  const entry = glossaryEntry(id)
  if (!entry) return null

  return (
    <details className="info-tip">
      <summary aria-label={`${entry.term[lang]}: ${entry.plain[lang]}`}>?</summary>
      <div className="info-tip-body" role="note">
        <strong>{entry.term[lang]}</strong>
        <p>{entry.plain[lang]}</p>
        <p className="info-example">{entry.example[lang]}</p>
      </div>
    </details>
  )
}

export default InfoTip
