import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const INDICATORS = {
  gdp: 'NY.GDP.MKTP.CD',           // PIB US$ corrientes
  population: 'SP.POP.TOTL',        // Población total
  pop_0_14: 'SP.POP.0014.TO.ZS',    // % población 0-14
  gdp_pc_ppa: 'NY.GDP.PCAP.PP.CD', // PIB per cápita PPA
  tax_revenue: 'GC.TAX.TOTL.GD.ZS', // Ingresos fiscales % PIB
  gov_exp: 'GC.XPN.TOTL.GD.ZS',     // Gasto público % PIB
} as const

interface WBDataPoint {
  country: { id: string; value: string }
  date: string
  value: number | null
}

interface CountryData {
  iso3: string
  name: string
  region?: string
  gdp_usd?: number
  population?: number
  pop_0_14_pct?: number
  gdp_pc_ppa?: number
  tax_revenue_pct_gdp?: number
  gov_exp_pct_gdp?: number
  years: {
    gdp_usd?: string
    population?: string
    pop_0_14_pct?: string
    gdp_pc_ppa?: string
    tax_revenue_pct_gdp?: string
    gov_exp_pct_gdp?: string
  }
  missing: string[]
}

async function fetchIndicator(indicator: string): Promise<Map<string, { value: number; year: string }>> {
  const result = new Map<string, { value: number; year: string }>()
  const currentYear = new Date().getFullYear()
  const startYear = currentYear - 5
  
  // Try to fetch last 6 years to be safe
  const url = `https://api.worldbank.org/v2/country/all/indicator/${indicator}?format=json&date=${startYear}:${currentYear}&per_page=20000`
  
  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.error(`Failed to fetch ${indicator}: ${res.status}`)
      return result
    }
    const data = await res.json()
    if (!Array.isArray(data) || data.length < 2) return result
    
    const points = data[1] as WBDataPoint[]
    
    // Group by country, take latest non-null value
    const byCountry = new Map<string, WBDataPoint[]>()
    for (const p of points) {
      if (p.value === null || p.value === undefined) continue
      if (!byCountry.has(p.country.id)) byCountry.set(p.country.id, [])
      byCountry.get(p.country.id)!.push(p)
    }
    
    for (const [iso3, countryPoints] of byCountry) {
      // Sort by year desc
      countryPoints.sort((a, b) => parseInt(b.date) - parseInt(a.date))
      const latest = countryPoints[0]
      result.set(iso3, { value: latest.value!, year: latest.date })
    }
  } catch (e) {
    console.error(`Error fetching ${indicator}:`, e)
  }
  
  return result
}

async function main() {
  console.log('Fetching data from World Bank API...')
  
  const [gdpData, popData, pop014Data, gdpPpaData, taxData, govExpData] = await Promise.all([
    fetchIndicator(INDICATORS.gdp),
    fetchIndicator(INDICATORS.population),
    fetchIndicator(INDICATORS.pop_0_14),
    fetchIndicator(INDICATORS.gdp_pc_ppa),
    fetchIndicator(INDICATORS.tax_revenue),
    fetchIndicator(INDICATORS.gov_exp),
  ])
  
  // Get all country codes that appear
  const allCodes = new Set<string>()
  for (const m of [gdpData, popData, pop014Data, gdpPpaData, taxData, govExpData]) {
    for (const k of m.keys()) allCodes.add(k)
  }
  
  // Basic country name mapping for common ones (we'll enhance)
  const countries: CountryData[] = []
  
  for (const iso3 of allCodes) {
    const missing: string[] = []
    const country: CountryData = {
      iso3,
      name: iso3, // Will be improved - for now use iso3
      years: {},
      missing: [],
    }
    
    if (gdpData.has(iso3)) {
      country.gdp_usd = gdpData.get(iso3)!.value
      country.years.gdp_usd = gdpData.get(iso3)!.year
    } else missing.push('gdp_usd')
    
    if (popData.has(iso3)) {
      country.population = popData.get(iso3)!.value
      country.years.population = popData.get(iso3)!.year
    } else missing.push('population')
    
    if (pop014Data.has(iso3)) {
      country.pop_0_14_pct = pop014Data.get(iso3)!.value
      country.years.pop_0_14_pct = pop014Data.get(iso3)!.year
    } else missing.push('pop_0_14_pct')
    
    if (gdpPpaData.has(iso3)) {
      country.gdp_pc_ppa = gdpPpaData.get(iso3)!.value
      country.years.gdp_pc_ppa = gdpPpaData.get(iso3)!.year
    } else missing.push('gdp_pc_ppa')
    
    if (taxData.has(iso3)) {
      country.tax_revenue_pct_gdp = taxData.get(iso3)!.value
      country.years.tax_revenue_pct_gdp = taxData.get(iso3)!.year
    } else missing.push('tax_revenue_pct_gdp')
    
    if (govExpData.has(iso3)) {
      country.gov_exp_pct_gdp = govExpData.get(iso3)!.value
      country.years.gov_exp_pct_gdp = govExpData.get(iso3)!.year
    } else missing.push('gov_exp_pct_gdp')
    
    country.missing = missing
    countries.push(country)
  }
  
  // Sort by name
  countries.sort((a, b) => a.iso3.localeCompare(b.iso3))
  
  mkdirSync(join(process.cwd(), 'src', 'data'), { recursive: true })
  const outPath = join(process.cwd(), 'src', 'data', 'countries.json')
  writeFileSync(outPath, JSON.stringify(countries, null, 2))
  
  console.log(`Generated ${outPath} with ${countries.length} countries`)
  console.log(`Countries with complete data: ${countries.filter(c => c.missing.length === 0).length}`)
}

main()
