import { describe, it, expect } from 'vitest'
import type { CountryRawData } from '../model/ubi'
import { countryName, matchesCountry } from './country'

const spain: CountryRawData = {
  iso3: 'ESP',
  iso_numeric: '724',
  name: 'Spain',
  name_es: 'España',
  missing: [],
  years: {},
}

describe('country helpers', () => {
  it('encuentra España con y sin tilde, y por código', () => {
    expect(matchesCountry(spain, 'España')).toBe(true)
    expect(matchesCountry(spain, 'espana')).toBe(true)
    expect(matchesCountry(spain, 'SPAIN')).toBe(true)
    expect(matchesCountry(spain, 'esp')).toBe(true)
    expect(matchesCountry(spain, '724')).toBe(true)
  })

  it('no devuelve coincidencias falsas', () => {
    expect(matchesCountry(spain, 'France')).toBe(false)
  })

  it('muestra el nombre en el idioma activo', () => {
    expect(countryName(spain, 'es')).toBe('España')
    expect(countryName(spain, 'en')).toBe('Spain')
  })

  it('usa el nombre inglés si falta la traducción', () => {
    expect(countryName({ ...spain, name_es: undefined }, 'es')).toBe('Spain')
  })
})
