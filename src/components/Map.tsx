import { useEffect, useRef } from 'react'
import { geoPath, geoNaturalEarth1 } from 'd3-geo'
import { feature } from 'topojson-client'
import world from 'world-atlas/countries-110m.json'
import type { Translations, Lang } from '../i18n/translations'
import type { CountryRawData, UbiResult } from '../model/ubi'
import { countryName } from '../utils/country'
import { formatPct } from '../utils/format'
import {
  categoryLabelKey,
  metricBucketIndex,
  metricColor,
  NO_DATA_COLOR,
  type MapMetric,
} from './mapColors'

interface Props {
  t: Translations
  lang: Lang
  countries: CountryRawData[]
  results: Map<string, UbiResult>
  metric: MapMetric
  selectedIso3: string | null
  onCountryClick: (iso3: string | null) => void
}

function tooltipText(result: UbiResult | undefined, metric: MapMetric, t: Translations): string {
  if (!result || !result.hasData || result.category === 'Sin datos') return t.noData
  switch (metric) {
    case 'category':
      return t[categoryLabelKey(result.category)]
    case 'gap':
      return `${t.gapTotal}: ${formatPct(result.gapPctGdp)} ${t.ofGdp}`
    case 'cost':
      return `${t.summaryCost}: ${formatPct(result.netCostPctGdp)} ${t.ofGdp}`
    case 'needed':
      return result.aiGrowthNeededPct === Infinity
        ? `${t.aiGrowthNeeded}: ∞`
        : `${t.aiGrowthNeeded}: +${formatPct(result.aiGrowthNeededPct)} ${t.ofGdp}`
  }
}

function WorldMap({
  t,
  lang,
  countries,
  results,
  metric,
  selectedIso3,
  onCountryClick,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = svgRef.current
    svg.innerHTML = ''

    const width = 800
    const height = 500
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

    const projection = geoNaturalEarth1()
      .scale(150)
      .translate([width / 2, height / 2])

    const path = geoPath().projection(projection)

    const svgNs = 'http://www.w3.org/2000/svg'
    const defs = document.createElementNS(svgNs, 'defs')

    const textures = [
      { id: 1, size: 6, stroke: 'rgba(255,255,255,0.45)', width: 1, dot: false },
      { id: 2, size: 5, stroke: 'rgba(255,255,255,0.55)', width: 1.6, dot: false },
      { id: 3, size: 5, stroke: 'rgba(0,0,0,0.4)', width: 1.6, dot: false },
      { id: 4, size: 5, stroke: 'rgba(0,0,0,0.5)', width: 1, dot: true },
    ]

    for (const texture of textures) {
      const pattern = document.createElementNS(svgNs, 'pattern')
      pattern.setAttribute('id', `tex-${texture.id}`)
      pattern.setAttribute('width', String(texture.size))
      pattern.setAttribute('height', String(texture.size))
      pattern.setAttribute('patternUnits', 'userSpaceOnUse')

      if (texture.dot) {
        const dot = document.createElementNS(svgNs, 'circle')
        dot.setAttribute('cx', String(texture.size / 2))
        dot.setAttribute('cy', String(texture.size / 2))
        dot.setAttribute('r', '0.9')
        dot.setAttribute('fill', texture.stroke)
        pattern.appendChild(dot)
      } else {
        const line = document.createElementNS(svgNs, 'path')
        line.setAttribute(
          'd',
          `M0,${texture.size} L${texture.size},0 M-1,1 L1,-1 M${texture.size - 1},${texture.size + 1} L${texture.size + 1},${texture.size - 1}`,
        )
        line.setAttribute('stroke', texture.stroke)
        line.setAttribute('stroke-width', String(texture.width))
        pattern.appendChild(line)
      }

      defs.appendChild(pattern)
    }

    svg.appendChild(defs)

    const byNumeric = new Map<string, CountryRawData>()
    for (const country of countries) {
      if (country.iso_numeric) byNumeric.set(String(Number(country.iso_numeric)), country)
    }

    // @ts-ignore - world-atlas types
    const features = feature(world, world.objects.countries).features as any[]

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')

    for (const shape of features) {
      const numericId = shape.id !== undefined ? String(Number(shape.id)) : undefined
      const country = numericId ? byNumeric.get(numericId) : undefined
      const result = country ? results.get(country.iso3) : undefined

      const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      pathEl.setAttribute('d', path(shape) || '')
      pathEl.setAttribute('class', 'country')
      pathEl.setAttribute('fill', metricColor(result, metric))

      if (!result || result.category === 'Sin datos') {
        pathEl.setAttribute('data-nodata', 'true')
        pathEl.setAttribute('fill', NO_DATA_COLOR)
      }
      const label = country ? countryName(country, lang) : shape.properties?.name || ''
      const valueText = tooltipText(result, metric, t)
      const titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'title')
      titleEl.textContent = `${label} — ${valueText}`

      if (country) {
        const isSelected = selectedIso3 === country.iso3
        pathEl.setAttribute('tabindex', '0')
        pathEl.setAttribute('role', 'button')
        pathEl.setAttribute('aria-label', `${label}: ${valueText}`)
        pathEl.setAttribute('aria-pressed', String(isSelected))
        pathEl.setAttribute('data-iso3', country.iso3)
        if (isSelected) pathEl.setAttribute('class', 'country selected')

        const activate = () => onCountryClick(isSelected ? null : country.iso3)
        pathEl.addEventListener('click', activate)
        pathEl.addEventListener('keydown', (event) => {
          const key = (event as KeyboardEvent).key
          if (key === 'Enter' || key === ' ') {
            event.preventDefault()
            activate()
          }
        })
      }

      pathEl.appendChild(titleEl)
      group.appendChild(pathEl)

      const textureIndex = metricBucketIndex(result, metric)
      if (textureIndex > 0) {
        const textureEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        textureEl.setAttribute('d', path(shape) || '')
        textureEl.setAttribute('fill', `url(#tex-${textureIndex})`)
        textureEl.setAttribute('class', 'country-texture')
        textureEl.setAttribute('pointer-events', 'none')
        textureEl.setAttribute('aria-hidden', 'true')
        group.appendChild(textureEl)
      }
    }

    svg.appendChild(group)
  }, [countries, results, metric, selectedIso3, onCountryClick, t, lang])

  return <svg ref={svgRef} className="map-svg" aria-label={t.title} role="group" />
}

export default WorldMap
