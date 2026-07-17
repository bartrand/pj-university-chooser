import type { Program } from './types'
import type { Currency } from './currency'
import { formatMoney } from './currency'

/** Conservative annual total for budgeting (higher tuition + living), in EUR. */
export function totalEurMax(p: Program) {
  return p.tuitionEurMax + p.livingCostEur
}

/** Lower-bound annual total when tuition can be waived/reduced, in EUR. */
export function totalEurMin(p: Program) {
  return p.tuitionEurMin + p.livingCostEur
}

export function tuitionLabel(p: Program, currency: Currency, perYear = false) {
  const suffix = perYear ? '/year' : ''
  if (p.tuitionEurMin === p.tuitionEurMax) {
    return `~${formatMoney(p.tuitionEurMin, currency)}${suffix}`
  }
  return `~${formatMoney(p.tuitionEurMin, currency)}–${formatMoney(p.tuitionEurMax, currency)}${suffix}`
}

export function totalLabel(p: Program, currency: Currency) {
  const min = totalEurMin(p)
  const max = totalEurMax(p)
  if (min === max) return `~${formatMoney(max, currency)}/year`
  return `~${formatMoney(min, currency)}–${formatMoney(max, currency)}/year`
}
