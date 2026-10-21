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

function Map({ results, metric, selectedIso3, onCountryClick }: Props) {
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
    
    // @ts-ignore
    const countries = feature(world, world.objects.countries).features
    
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    
    for (const country of countries) {
      const iso3 = country.id
      const result = results.get(iso3)
      
      const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      pathEl.setAttribute('d', path(country as any) || '')
      pathEl.setAttribute('class', 'country')
      
      if (!result || result.category === 'Sin datos') {
        pathEl.setAttribute('fill', '#9ca3af')
        pathEl.setAttribute('data-nodata', 'true')
      } else if (metric === 'category') {
        pathEl.setAttribute('fill', categoryColors[result.category] || '#9ca3af')
      } else {
        // gap metric
        if (result.gapPctGdp !== undefined) {
          if (result.gapPctGdp <= 0) {
            pathEl.setAttribute('fill', '#22c55e')
          } else if (result.gapPctGdp < 5) {
            pathEl.setAttribute('fill', '#f59e0b')
          } else {
            pathEl.setAttribute('fill', '#ef4444')
          }
        } else {
          pathEl.setAttribute('fill', '#9ca3af')
        }
      }
      
      if (selectedIso3 === iso3) {
        pathEl.setAttribute('class', 'country selected')
      }
      
      pathEl.addEventListener('click', () => {
        onCountryClick(iso3 === selectedIso3 ? null : iso3)
      })
      
      g.appendChild(pathEl)
    }
    
    svg.appendChild(g)
  }, [results, metric, selectedIso3, onCountryClick])
  
  return (
    <svg ref={svgRef} className="map-svg" aria-label="World map" />
  )
}

export default Map
