import type { CSSProperties } from 'react'
import type { Translations } from '../i18n/translations'
import { legendItems, type MapMetric } from './mapColors'

interface Props {
  t: Translations
  metric: MapMetric
}

function textureStyle(texture: number): CSSProperties {
  switch (texture) {
    case 1:
      return {
        backgroundImage:
          'repeating-linear-gradient(45deg, rgba(255,255,255,.45) 0 1px, transparent 1px 6px)',
      }
    case 2:
      return {
        backgroundImage:
          'repeating-linear-gradient(45deg, rgba(255,255,255,.55) 0 2px, transparent 2px 5px)',
      }
    case 3:
      return {
        backgroundImage:
          'repeating-linear-gradient(-45deg, rgba(0,0,0,.4) 0 2px, transparent 2px 5px)',
      }
    case 4:
      return {
        backgroundImage: 'radial-gradient(rgba(0,0,0,.5) 1px, transparent 1.3px)',
        backgroundSize: '5px 5px',
      }
    default:
      return {}
  }
}

function Legend({ t, metric }: Props) {
  const items = legendItems(metric, t)

  return (
    <div className="legend" role="group" aria-label={t.legend}>
      <span className="legend-title">{t.legend}</span>
      <div className="legend-items">
        {items.map((item) => (
          <span key={item.label} className="legend-item">
            <span
              className="swatch"
              style={{ backgroundColor: item.color, ...textureStyle(item.texture) }}
              aria-hidden="true"
            />
            {item.label}
          </span>
        ))}
      </div>
      <span className="legend-hint">{t.legendHint}</span>
    </div>
  )
}

export default Legend
