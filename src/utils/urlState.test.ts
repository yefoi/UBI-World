import { describe, it, expect } from 'vitest'
import { defaultUbiParams } from './presets'
import { searchFromState, stateFromSearch } from './urlState'

describe('urlState', () => {
  it('usa valores por defecto con una URL vacía', () => {
    const state = stateFromSearch('')
    expect(state.lang).toBe('es')
    expect(state.metric).toBe('category')
    expect(state.mode).toBe('simple')
    expect(state.iso3).toBeNull()
    expect(state.params).toEqual(defaultUbiParams)
  })

  it('hace ida y vuelta con país, idioma, métrica y modo', () => {
    const original = {
      lang: 'en' as const,
      metric: 'needed' as const,
      mode: 'advanced' as const,
      iso3: 'ESP',
      params: {
        ...defaultUbiParams,
        ubiPctGdpPcPpa: 42,
        publicSpendingReplacedPct: 35,
        aiGrowthG: 12,
        stateCapturePct: 45,
        domesticAiPct: 65,
        fiscalPressureCeilingPctGdp: 60,
      },
    }

    const roundtrip = stateFromSearch(searchFromState(original))
    expect(roundtrip.lang).toBe('en')
    expect(roundtrip.metric).toBe('needed')
    expect(roundtrip.mode).toBe('advanced')
    expect(roundtrip.iso3).toBe('ESP')
    expect(roundtrip.params.ubiPctGdpPcPpa).toBe(42)
    expect(roundtrip.params.publicSpendingReplacedPct).toBe(35)
    expect(roundtrip.params.aiGrowthG).toBe(12)
    expect(roundtrip.params.stateCapturePct).toBe(45)
    expect(roundtrip.params.domesticAiPct).toBe(65)
    expect(roundtrip.params.fiscalPressureCeilingPctGdp).toBe(60)
  })

  it('ignora valores inválidos y recorta los extremos', () => {
    const state = stateFromSearch(
      'pais=espa%C3%B1a&metrica=inventada&ubi=999&techo=5&captacion=-10&idioma=fr',
    )
    expect(state.iso3).toBeNull()
    expect(state.metric).toBe('category')
    expect(state.params.ubiPctGdpPcPpa).toBe(80)
    expect(state.params.fiscalPressureCeilingPctGdp).toBe(30)
    expect(state.params.stateCapturePct).toBe(0)
    expect(state.lang).toBe('es')
  })

  it('serializa el modo como vista', () => {
    const query = searchFromState({
      lang: 'es',
      metric: 'category',
      mode: 'advanced',
      iso3: null,
      params: defaultUbiParams,
    })
    expect(new URLSearchParams(query).get('vista')).toBe('completo')
  })
})
