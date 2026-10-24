import type { CountryRawData } from '../model/ubi'
import type { Lang } from '../i18n/translations'

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function countryName(country: CountryRawData, lang: Lang): string {
  return lang === 'es' ? country.name_es || country.name : country.name
}

export function matchesCountry(country: CountryRawData, query: string): boolean {
  const q = normalize(query)
  if (!q) return true
  return [country.name, country.name_es, country.iso3, country.iso_numeric].some(
    (value) => value !== undefined && normalize(value).includes(q),
  )
}
