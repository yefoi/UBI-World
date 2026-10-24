import { useEffect, useRef } from 'react'
import { geoPath, geoNaturalEarth1 } from 'd3-geo'
import { feature } from 'topojson-client'
import world from 'world-atlas/countries-110m.json'
import type { CountryRawData } from '../model/ubi'
import type { calculateUbi } from '../model/ubi'

interface Props {
  t: any
  countries: CountryRawData[]
  results: Map<string, ReturnType<typeof calculateUbi>>
  metric: 'category' | 'gap'
  selectedIso3: string | null
  onCountryClick: (iso3: string | null) => void
}

const categoryColors: Record<string, string> = {
  'Viable hoy': '#22c55e',
  'Viable con IA moderada': '#84cc16',
  'Requiere IA extrema': '#f59e0b',
  'Inviable': '#ef4444',
  'Sin datos': '#9ca3af',
}

const NO_DATA = '#9ca3af'

function gapColor(gap: number | undefined): string {
  if (gap === undefined || !Number.isFinite(gap)) return NO_DATA
  if (gap <= 0) return '#22c55e'
  if (gap < 3) return '#84cc16'
  if (gap < 8) return '#f59e0b'
  if (gap < 20) return '#f97316'
  return '#ef4444'
}

function WorldMap({ t, countries, results, metric, selectedIso3, onCountryClick }: Props) {
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

    const byNumeric = new Map<string, CountryRawData>()
    for (const c of countries) {
      if (c.iso_numeric) byNumeric.set(String(Number(c.iso_numeric)), c)
    }

    // @ts-ignore - world-atlas types
    const features = feature(world, world.objects.countries).features as any[]

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')

    for (const f of features) {
      const numericId = f.id !== undefined ? String(Number(f.id)) : undefined
      const country = numericId ? byNumeric.get(numericId) : undefined
      const result = country ? results.get(country.iso3) : undefined

      const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      pathEl.setAttribute('d', path(f) || '')
      pathEl.setAttribute('class', 'country')

      if (!result || result.category === 'Sin datos') {
        pathEl.setAttribute('fill', NO_DATA)
        pathEl.setAttribute('data-nodata', 'true')
      } else if (metric === 'category') {
        pathEl.setAttribute('fill', categoryColors[result.category] || NO_DATA)
      } else {
        pathEl.setAttribute('fill', gapColor(result.gapPctGdp))
      }

      const label = country?.name || f.properties?.name || ''
      const cat = result ? t[categoryKey(result.category)] : t.noData
      const titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'title')
      titleEl.textContent = `${label} — ${cat}`
      pathEl.appendChild(titleEl)

      if (selectedIso3 && country?.iso3 === selectedIso3) {
        pathEl.setAttribute('class', 'country selected')
      }

      pathEl.addEventListener('click', () => {
        if (!country) return
        onCountryClick(country.iso3 === selectedIso3 ? null : country.iso3)
      })

      g.appendChild(pathEl)
    }

    svg.appendChild(g)
  }, [countries, results, metric, selectedIso3, onCountryClick, t])

  return <svg ref={svgRef} className="map-svg" aria-label="World map" />
}

function categoryKey(c: string): string {
  switch (c) {
    case 'Viable hoy': return 'viableNow'
    case 'Viable con IA moderada': return 'viableModerate'
    case 'Requiere IA extrema': return 'extremeAI'
    case 'Inviable': return 'notViable'
    default: return 'noData'
  }
}

export default WorldMap
