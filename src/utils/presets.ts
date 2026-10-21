// Presets globales
export interface Preset {
  id: string
  name: { es: string; en: string }
  params: Partial<{
    ubiAmountType: 'pct_gdp_pc_ppa' | 'usd_month_ppa'
    ubiPctGdpPcPpa: number
    ubiUsdMonthPpa: number
    coverage: 'adults_only' | 'adults_and_children'
    childShare: number
    publicSpendingReplacedPct: number
    aiGrowthG: number
    stateCapturePct: number
    domesticAiPct: number
    fiscalPressureCeilingPctGdp: number
  }>
}

export const presets: Preset[] = [
  {
    id: 'cauto',
    name: { es: 'Cauto', en: 'Cautious' },
    params: {
      ubiPctGdpPcPpa: 15,
      coverage: 'adults_only',
      publicSpendingReplacedPct: 30,
      aiGrowthG: 2,
      stateCapturePct: 15,
      domesticAiPct: 40,
      fiscalPressureCeilingPctGdp: 50,
    },
  },
  {
    id: 'optimista_musk',
    name: { es: 'Optimista Musk', en: 'Musk Optimistic' },
    params: {
      ubiPctGdpPcPpa: 40,
      coverage: 'adults_and_children',
      childShare: 0.5,
      publicSpendingReplacedPct: 10,
      aiGrowthG: 10,
      stateCapturePct: 40,
      domesticAiPct: 70,
      fiscalPressureCeilingPctGdp: 50,
    },
  },
  {
    id: 'solo_erradicar_pobreza',
    name: { es: 'Solo erradicar pobreza', en: 'Just eradicate poverty' },
    params: {
      ubiPctGdpPcPpa: 12,
      coverage: 'adults_and_children',
      childShare: 0.5,
      publicSpendingReplacedPct: 25,
      aiGrowthG: 3,
      stateCapturePct: 25,
      domesticAiPct: 50,
      fiscalPressureCeilingPctGdp: 50,
    },
  },
]

export const defaultUbiParams = {
  ubiAmountType: 'pct_gdp_pc_ppa' as const,
  ubiPctGdpPcPpa: 25,
  ubiUsdMonthPpa: 500,
  coverage: 'adults_and_children' as const,
  childShare: 0.5,
  publicSpendingReplacedPct: 20,
  aiGrowthG: 3,
  stateCapturePct: 20,
  domesticAiPct: 50,
  fiscalPressureCeilingPctGdp: 50,
}
