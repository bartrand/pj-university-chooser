export type Currency = 'EUR' | 'CAD' | 'USD'

/** Approximate mid-market rates vs EUR — fine for family comparison, not banking. */
const FROM_EUR: Record<Currency, number> = {
  EUR: 1,
  CAD: 1.5,
  USD: 1.08,
}

export function convertFromEur(amountEur: number, currency: Currency) {
  return Math.round(amountEur * FROM_EUR[currency])
}

export function formatMoney(amountEur: number, currency: Currency) {
  const amount = convertFromEur(amountEur, currency)
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
