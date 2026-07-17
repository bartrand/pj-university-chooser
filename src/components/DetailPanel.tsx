import { useEffect, useState } from 'react'
import { FOCUS_LABELS } from '../data/programs'
import { programYears, totalLabel, tuitionLabel } from '../costs'
import { formatMoney, type Currency } from '../currency'
import type { Program } from '../types'
import { WikiPhoto } from './WikiPhoto'

interface DetailPanelProps {
  program: Program | null
  currency: Currency
  favorited: boolean
  onToggleFavorite: () => void
  onClose: () => void
}

export function DetailPanel({
  program,
  currency,
  favorited,
  onToggleFavorite,
  onClose,
}: DetailPanelProps) {
  const [showCostDetails, setShowCostDetails] = useState(false)

  useEffect(() => {
    setShowCostDetails(false)
  }, [program?.id])

  if (!program) return null

  return (
    <div className="detail" role="dialog" aria-labelledby="detail-title">
      <div className="detail-head">
        <div>
          <p className="detail-eyebrow">
            {program.city}, {program.country} · Prestige {program.prestige}/10
            · Pathway {program.pathwayOverall}/10
          </p>
          <h2 id="detail-title">{program.university}</h2>
        </div>
        <div className="detail-head-actions">
          <button
            type="button"
            className={`fav-btn detail-fav ${favorited ? 'on' : ''}`}
            aria-label={favorited ? 'Remove from favourites' : 'Add to favourites'}
            aria-pressed={favorited}
            onClick={onToggleFavorite}
          >
            {favorited ? '★' : '☆'}
          </button>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
      </div>

      <div className="detail-body">
        <div className="detail-main">
          <p className="detail-program">{program.program}</p>
          <p className="detail-official">
            <a
              href={program.programUrl}
              target="_blank"
              rel="noreferrer"
              className="detail-official-link"
            >
              Official program page ↗
            </a>
          </p>

          <p className="detail-section-label">Highlights</p>
          <ul className="detail-highlights">
            {program.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>

          <dl className="detail-grid">
            <div>
              <dt>Pathway strength (Master’s / career)</dt>
              <dd>
                <strong>Overall {program.pathwayOverall}/10</strong>
                <ul className="detail-notes">
                  <li>
                    Canada: <strong>{program.pathwayCanada}/10</strong> — Canadian
                    MSc / geoscience jobs
                  </li>
                  <li>
                    Europe: <strong>{program.pathwayEurope}/10</strong> — EU/EEA
                    MSc / careers (incl. other countries)
                  </li>
                </ul>
              </dd>
            </div>
            <div>
              <dt>Est. total (full program)</dt>
              <dd>
                <strong>{totalLabel(program, currency)}</strong>
                <span className="muted">
                  {' '}
                  — tuition + living × {programYears(program)} years
                </span>
                <div>
                  <button
                    type="button"
                    className="link-btn detail-cost-toggle"
                    onClick={() => setShowCostDetails((v) => !v)}
                  >
                    {showCostDetails ? 'Hide details' : 'Details'}
                  </button>
                </div>
                {showCostDetails && (
                  <ul className="detail-cost-breakdown">
                    <li>
                      <span className="muted">Tuition:</span>{' '}
                      {tuitionLabel(program, currency, true)}
                      {program.tuitionNote && (
                        <span className="muted"> — {program.tuitionNote}</span>
                      )}
                    </li>
                    <li>
                      <span className="muted">Living:</span> ~
                      {formatMoney(program.livingCostEur, currency)}/year
                      {program.livingCostNote && (
                        <span className="muted"> — {program.livingCostNote}</span>
                      )}
                    </li>
                    {program.allInclusiveTotalEur != null && (
                      <li>
                        <span className="muted">All-inclusive package:</span> ~
                        {formatMoney(program.allInclusiveTotalEur, currency)}
                        /year — tuition, housing &amp; 2 meals/day
                      </li>
                    )}
                  </ul>
                )}
              </dd>
            </div>
            <div>
              <dt>Intl. student QoL</dt>
              <dd>
                <strong>{program.qolScore}/5</strong>
                <ul className="detail-notes">
                  {program.qolNotes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt>Ease of admission / visa (Canadian passport)</dt>
              <dd>
                <strong>{program.visaEaseScore}/5</strong>
                <ul className="detail-notes">
                  {program.visaEaseNotes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt>Summers — fieldwork / co-op / paid jobs</dt>
              <dd>
                <strong>{program.summerScore}/5</strong>
                <ul className="detail-notes">
                  {program.summerNotes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt>Language</dt>
              <dd>
                {program.language === 'english'
                  ? '100% English'
                  : 'French–English bilingual'}
              </dd>
            </div>
            <div>
              <dt>Travel from LCA</dt>
              <dd>
                ~{program.travelHoursFromLca} hours
                <span className="muted"> — {program.travelRoute}</span>
              </dd>
            </div>
            <div>
              <dt>Focus</dt>
              <dd>{program.focusSummary}</dd>
            </div>
            <div>
              <dt>Visa / entry</dt>
              <dd>{program.visaEntry}</dd>
            </div>
          </dl>

          <div className="chip-row wrap">
            {program.focus.map((tag) => (
              <span key={tag} className="chip static">
                {FOCUS_LABELS[tag]}
              </span>
            ))}
          </div>
        </div>

        <aside className="detail-photos" aria-label="Campus and city photos">
          <WikiPhoto
            commonsFile={program.universityPhoto}
            alt={`${program.university} campus`}
            caption="Campus"
          />
          <WikiPhoto
            commonsFile={program.cityPhoto}
            alt={`${program.city} cityscape`}
            caption={`${program.city}`}
          />
        </aside>
      </div>
    </div>
  )
}
