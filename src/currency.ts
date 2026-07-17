export type Currency = 'EUR' | 'CAD' | 'USD'

/** Approximate mid-market rates vs EUR (as of Jul 2026) — family comparison only, not banking. */
const FROM_EUR: Record<Currency, number> = {
  EUR: 1,
  CAD: 1.5,
  USD: 1.08,
}

export function convertFromEur(amountEur: number, currency: Currency) {
  return Math.round(amountEur * FROM_EUR[currency])
}

/** Convert a USD amount into EUR for storage/filtering. */
export function eurFromUsd(amountUsd: number) {
  return Math.round(amountUsd / FROM_EUR.USD)
}

export function formatMoney(
  amountEur: number,
  currency: Currency,
  /** Round the converted amount to this step (e.g. 100 → nearest hundred). */
  nearest = 1,
) {
  let amount = convertFromEur(amountEur, currency)
  if (nearest > 1) amount = Math.round(amount / nearest) * nearest
  const formatted = amount.toLocaleString('en-CA')
  if (currency === 'EUR') return `€${formatted}`
  if (currency === 'CAD') return `CA$${formatted}`
  return `US$${formatted}`
}

export const CURRENCY_LABELS: Record<Currency, string> = {
  EUR: 'EUR',
  CAD: 'CAD',
  USD: 'USD',
}
