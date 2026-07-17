import type { Currency } from '../currency'
import { CURRENCY_LABELS } from '../currency'

interface CurrencyToggleProps {
  currency: Currency
  onChange: (currency: Currency) => void
}

const OPTIONS: Currency[] = ['USD', 'CAD', 'EUR']

export function CurrencyToggle({ currency, onChange }: CurrencyToggleProps) {
  return (
    <div className="currency-toggle" role="group" aria-label="Currency">
      {OPTIONS.map((code) => (
        <button
          key={code}
          type="button"
          className={currency === code ? 'active' : ''}
          aria-pressed={currency === code}
          onClick={() => onChange(code)}
        >
          {CURRENCY_LABELS[code]}
        </button>
      ))}
    </div>
  )
}
