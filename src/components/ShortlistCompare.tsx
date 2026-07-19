import type { ReactNode } from 'react'
import { programYears, totalEurMax } from '../costs'
import { formatMoney, type Currency } from '../currency'
import { COUNTRY_FLAGS } from '../data/programs'
import type { Profile } from '../profiles'
import type { Program } from '../types'

interface ShortlistCompareProps {
  profile: Profile
  programs: Program[]
  currency: Currency
  onSelect: (id: string) => void
  onClose: () => void
  onRemove: (id: string) => void
}

const MAX_COMPARE = 5

function ScoreCell({ score, note }: { score: string; note: string }) {
  return (
    <div className="shortlist-score-cell">
      <strong>{score}</strong>
      <p className="shortlist-note">{note}</p>
    </div>
  )
}

function pathwayNote(p: Program, profile: Profile) {
  if (p.pathwayCanada - p.pathwayEurope >= 2) {
    return profile.pathwayCanadaStrong
  }
  if (p.pathwayEurope - p.pathwayCanada >= 2) {
    return profile.pathwayEuropeStrong
  }
  return profile.pathwayBalanced
}

export function ShortlistCompare({
  profile,
  programs,
  currency,
  onSelect,
  onClose,
  onRemove,
}: ShortlistCompareProps) {
  const shown = programs.slice(0, MAX_COMPARE)
  const overflow = programs.length - shown.length

  const rows: {
    label: string
    cell: (p: Program) => ReactNode
  }[] = [
    {
      label: 'Program',
      cell: (p) => p.program,
    },
    {
      label: 'Location',
      cell: (p) => (
        <>
          {COUNTRY_FLAGS[p.country] ?? ''} {p.city}, {p.country}
        </>
      ),
    },
    {
      label: 'Full-program cost',
      cell: (p) => (
        <>
          ~{formatMoney(totalEurMax(p), currency, 1000)} ({programYears(p)}-yr)
          {p.collegeFeederTuitionNote && (
            <div className="shortlist-note">
              Feeder: {p.collegeFeederTuitionNote}
            </div>
          )}
        </>
      ),
    },
    {
      label: 'Prestige',
      cell: (p) => (
        <ScoreCell
          score={`${p.prestige}/10`}
          note={p.highlights[0] ?? profile.prestigeFallbackNote}
        />
      ),
    },
    {
      label: 'Pathway (CA / EU / Overall)',
      cell: (p) => (
        <ScoreCell
          score={`${p.pathwayCanada} / ${p.pathwayEurope} / ${p.pathwayOverall}`}
          note={pathwayNote(p, profile)}
        />
      ),
    },
    {
      label: 'QoL',
      cell: (p) => (
        <ScoreCell
          score={`${p.qolScore}/5`}
          note={p.qolNotes[0] ?? 'Student-city livability'}
        />
      ),
    },
    {
      label: 'Admit / visa',
      cell: (p) => (
        <ScoreCell
          score={`${p.visaEaseScore}/5`}
          note={p.visaEaseNotes[0] ?? p.visaEntry}
        />
      ),
    },
    {
      label: 'Summers',
      cell: (p) => (
        <ScoreCell
          score={`${p.summerScore}/5`}
          note={p.summerNotes[0] ?? profile.summerFallbackNote}
        />
      ),
    },
    {
      label: 'Travel from LCA',
      cell: (p) => (
        <ScoreCell
          score={`~${p.travelHoursFromLca} hrs`}
          note={p.travelRoute}
        />
      ),
    },
    {
      label: 'Language',
      cell: (p) =>
        p.language === 'english'
          ? '100% English'
          : p.language === 'french'
            ? 'French'
            : 'FR/EN bilingual',
    },
    {
      label: 'Focus',
      cell: (p) => p.focusSummary,
    },
    {
      label: 'Official page',
      cell: (p) => (
        <a
          href={p.programUrl}
          target="_blank"
          rel="noreferrer"
          className="shortlist-link"
          onClick={(e) => e.stopPropagation()}
        >
          Open ↗
        </a>
      ),
    },
  ]

  return (
    <div
      className="shortlist-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortlist-title"
    >
      <div className="shortlist">
        <div className="shortlist-head">
          <div>
            <h2 id="shortlist-title">Shortlist compare</h2>
            <p className="shortlist-sub">
              Side-by-side view of your favourites
              {overflow > 0
                ? ` (showing ${MAX_COMPARE} of ${programs.length} — remove some to swap in others)`
                : ` (${shown.length})`}
            </p>
          </div>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            aria-label="Close shortlist"
          >
            ×
          </button>
        </div>

        <div className="shortlist-scroll">
          <table className="shortlist-table">
            <thead>
              <tr>
                <th scope="col"> </th>
                {shown.map((p) => (
                  <th key={p.id} scope="col">
                    <div className="shortlist-uni">
                      <button
                        type="button"
                        className="shortlist-uni-btn"
                        onClick={() => {
                          onSelect(p.id)
                          onClose()
                        }}
                      >
                        {p.university}
                      </button>
                      <button
                        type="button"
                        className="fav-btn on shortlist-unfav"
                        aria-label={`Remove ${p.university} from favourites`}
                        onClick={() => onRemove(p.id)}
                      >
                        ★
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {shown.map((p) => (
                    <td key={p.id}>{row.cell(p)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
