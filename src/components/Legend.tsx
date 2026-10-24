import type { Translations } from '../i18n/translations'
import { legendItems, type MapMetric } from './mapColors'

interface Props {
  t: Translations
  metric: MapMetric
}

function Legend({ t, metric }: Props) {
  const items = legendItems(metric, t)

  return (
    <div className="legend" role="group" aria-label={t.legend}>
      <span className="legend-title">{t.legend}</span>
      <div className="legend-items">
        {items.map((item) => (
          <span key={item.label} className="legend-item">
            <span className="swatch" style={{ background: item.color }} aria-hidden="true" />
            {item.label}
          </span>
        ))}
      </div>
      <span className="legend-hint">{t.legendHint}</span>
    </div>
  )
}

export default Legend
