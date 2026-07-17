import { programYears, totalEurMax } from '../costs'
import { formatMoney, type Currency } from '../currency'
import type { Program } from '../types'

const COUNTRY_FLAGS: Record<string, string> = {
  Italy: '🇮🇹',
  France: '🇫🇷',
  Belgium: '🇧🇪',
  Germany: '🇩🇪',
  'Czech Republic': '🇨🇿',
  Hungary: '🇭🇺',
  Poland: '🇵🇱',
  Lithuania: '🇱🇹',
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
              aria-label={favorited ? 'Remove from favourites' : 'Add to favourites'}
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
                {COUNTRY_FLAGS[p.country] ?? ''} {p.city}, {p.country} · Prestige{' '}
                {p.prestige}/10
              </span>
              <span className="list-scores">
                Pathway CA {p.pathwayCanada} · EU {p.pathwayEurope} · Overall{' '}
                {p.pathwayOverall}/10
              </span>
              <span className="list-scores">
                QoL {p.qolScore}/5 · Admit {p.visaEaseScore}/5 · Summer{' '}
                {p.summerScore}/5
              </span>
              <span className="list-row">
                <span className="list-total">
                  Total ~{formatMoney(totalEurMax(p), currency, 1000)} (
                  {programYears(p)}-yr)
                </span>
                <span>~{p.travelHoursFromLca} hrs</span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
