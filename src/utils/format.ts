import type { Lang } from '../i18n/translations'

const locale = (lang: Lang) => (lang === 'es' ? 'es-ES' : 'en-US')

export function formatNumber(value: number | undefined, lang: Lang, digits = 0): string {
  if (value === undefined || !Number.isFinite(value)) return '—'
  return new Intl.NumberFormat(locale(lang), {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(value)
}

export function formatPct(value: number | undefined, digits = 1): string {
  if (value === undefined) return '—'
  if (value === Infinity) return '∞'
  return `${value.toFixed(digits)}%`
}

export function formatPctValue(value: number | undefined, digits = 1): string {
  if (value === undefined) return '—'
  if (value === Infinity) return '∞'
  return value.toFixed(digits)
}

export function formatUsd(value: number | undefined, lang: Lang): string {
  if (value === undefined || !Number.isFinite(value)) return '—'
  return `${formatNumber(value, lang)} US$`
}

export function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => vars[key] ?? match)
}
