import { totalEurMax, tuitionLabel } from '../costs'
import { formatMoney, type Currency } from '../currency'
import type { Program } from '../types'

const COUNTRY_FLAGS: Record<string, string> = {
  Italy: '🇮🇹',
  France: '🇫🇷',
  Germany: '🇩🇪',
  'Czech Republic': '🇨🇿',
  Hungary: '🇭🇺',
  Poland: '🇵🇱',
  Lithuania: '🇱🇹',
  Estonia: '🇪🇪',
  Malta: '🇲🇹',
  Netherlands: '🇳🇱',
  Canada: '🇨🇦',
}

interface ProgramListProps {
  programs: Program[]
  selectedId: string | null
  currency: Currency
  favorites: Set<string>
  onSelect: (id: string) => void
  onToggleFavorite: (id: string) => void
}

export function ProgramList({
  programs,
  selectedId,
  currency,
  favorites,
  onSelect,
  onToggleFavorite,
}: ProgramListProps) {
  if (programs.length === 0) {
    return (
      <div className="list empty">
        <p>No programs match these filters.</p>
      </div>
    )
  }

  return (
    <ul className="list">
      {programs.map((p) => {
        const favorited = favorites.has(p.id)
        return (
          <li key={p.id} className="list-row-item">
            <button
              type="button"
              className={`fav-btn ${favorited ? 'on' : ''}`}
              aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={favorited}
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite(p.id)
              }}
            >
              {favorited ? '★' : '☆'}
            </button>
            <button
              type="button"
              className={`list-item ${selectedId === p.id ? 'selected' : ''}`}
              onClick={() => onSelect(p.id)}
            >
              <span className="list-title">{p.university}</span>
              <span className="list-meta">
                {COUNTRY_FLAGS[p.country] ?? ''} {p.city}, {p.country} · ES prestige{' '}
                {p.prestige}/10
              </span>
              <span className="list-scores">
                QoL {p.qolScore}/5 · Admit {p.visaEaseScore}/5 · Summer{' '}
                {p.summerScore}/5
              </span>
              <span className="list-row">
                <span className="list-total">
                  Total ~{formatMoney(totalEurMax(p), currency)}
                </span>
                <span>~{p.travelHoursFromLca} hrs</span>
              </span>
              <span className="list-breakdown">
                Tuition {tuitionLabel(p, currency)} · Living ~
                {formatMoney(p.livingCostEur, currency)}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
