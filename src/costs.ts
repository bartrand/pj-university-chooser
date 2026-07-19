import type { Program } from './types'
import type { Currency } from './currency'
import { formatMoney } from './currency'

/** Bachelor length used for full-program cost estimates. */
export function programYears(p: Program) {
  return p.region === 'canada' ? 4 : 3
}

/** Annual tuition + living (EUR). */
export function annualEurMax(p: Program) {
  return p.tuitionEurMax + p.livingCostEur
}

export function annualEurMin(p: Program) {
  return p.tuitionEurMin + p.livingCostEur
}

/** Full-program total (tuition + living × years), higher tuition bound. */
export function totalEurMax(p: Program) {
  return annualEurMax(p) * programYears(p)
}

/** Full-program total when tuition can be waived/reduced. */
export function totalEurMin(p: Program) {
  return annualEurMin(p) * programYears(p)
}

export function tuitionLabel(p: Program, currency: Currency, perYear = false) {
  const suffix = perYear ? '/year' : ''
  if (p.tuitionEurMin === p.tuitionEurMax) {
    return `~${formatMoney(p.tuitionEurMin, currency)}${suffix}`
  }
  return `~${formatMoney(p.tuitionEurMin, currency)}–${formatMoney(p.tuitionEurMax, currency)}${suffix}`
}

export function livesAtHome(p: Program) {
  return p.livingCostEur === 0
}

export function totalLabel(p: Program, currency: Currency) {
  const years = programYears(p)
  const min = totalEurMin(p)
  const max = totalEurMax(p)
  const suffix = ` (${years}-year program)`
  if (min === max) return `~${formatMoney(max, currency)}${suffix}`
  return `~${formatMoney(min, currency)}–${formatMoney(max, currency)}${suffix}`
}

/** Short explainer under the full-program total. */
export function totalBreakdownNote(p: Program) {
  const years = programYears(p)
  if (livesAtHome(p)) {
    return `— tuition only × ${years} years (living at home)`
  }
  return `— tuition + living × ${years} years`
}
