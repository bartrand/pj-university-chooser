import { COUNTRY_FLAGS, FILTER_COUNTRIES, FOCUS_LABELS } from '../data/programs'
import { DEFAULT_FILTERS } from '../defaultFilters'
import { convertFromEur, eurFromUsd, formatMoney, type Currency } from '../currency'
import type { Filters, FocusTag } from '../types'

const ALL_FOCUS = Object.keys(FOCUS_LABELS) as FocusTag[]

const BUDGET_MIN_USD = 40000
const BUDGET_MAX_USD = 110000
const BUDGET_STEP_USD = 5000

interface FilterPanelProps {
  currency: Currency
  filters: Filters
  onChange: (filters: Filters) => void
  resultCount: number
  favoriteCount: number
}

export function FilterPanel({
  currency,
  filters,
  onChange,
  resultCount,
  favoriteCount,
}: FilterPanelProps) {
  const maxTotalUsd = Math.min(
    BUDGET_MAX_USD,
    Math.max(
      BUDGET_MIN_USD,
      Math.round(convertFromEur(filters.maxTotal, 'USD') / BUDGET_STEP_USD) *
        BUDGET_STEP_USD,
    ),
  )

  function toggleFocus(tag: FocusTag) {
    const next = filters.focus.includes(tag)
      ? filters.focus.filter((t) => t !== tag)
      : [...filters.focus, tag]
    onChange({ ...filters, focus: next })
  }

  function toggleCountry(country: string) {
    const next = filters.countries.includes(country)
      ? filters.countries.filter((c) => c !== country)
      : [...filters.countries, country]
    onChange({ ...filters, countries: next })
  }

  function reset() {
    onChange({
      ...DEFAULT_FILTERS,
      countries: [...DEFAULT_FILTERS.countries],
      focus: [...DEFAULT_FILTERS.focus],
    })
  }

  return (
    <aside className="filters">
      <div className="filters-head">
        <h2>Filters</h2>
        <button type="button" className="link-btn" onClick={reset}>
          Reset
        </button>
      </div>
      <p className="result-count">
        {resultCount} programs · Europe + Canada · favourites first
      </p>

      {favoriteCount > 0 && (
        <>
          <p className="filter-label">Favourites</p>
          <div className="chip-row">
            <button
              type="button"
              className={`chip ${!filters.favoritesOnly ? 'active' : ''}`}
              onClick={() => onChange({ ...filters, favoritesOnly: false })}
            >
              All
            </button>
            <button
              type="button"
              className={`chip ${filters.favoritesOnly ? 'active' : ''}`}
              onClick={() => onChange({ ...filters, favoritesOnly: true })}
            >
              Favourites only ({favoriteCount})
            </button>
          </div>
        </>
      )}

      <label className="filter-label" htmlFor="total">
        Max tuition + living: {formatMoney(filters.maxTotal, currency, 1000)}
      </label>
      <input
        id="total"
        type="range"
        min={BUDGET_MIN_USD}
        max={BUDGET_MAX_USD}
        step={BUDGET_STEP_USD}
        value={maxTotalUsd}
        onChange={(e) =>
          onChange({ ...filters, maxTotal: eurFromUsd(Number(e.target.value)) })
        }
      />
      <p className="filter-hint">
        Full program total — Europe ×3 years, Canada ×4 years
      </p>

      <label className="filter-label" htmlFor="prestige">
        Min prestige: {filters.minPrestige}/10
      </label>
      <input
        id="prestige"
        type="range"
        min={1}
        max={10}
        step={1}
        value={filters.minPrestige}
        onChange={(e) =>
          onChange({ ...filters, minPrestige: Number(e.target.value) })
        }
      />
      <p className="filter-hint">
        Further education (Master’s/PhD) and geoscience workforce recognition
      </p>

      <label className="filter-label" htmlFor="qol">
        Quality of life: {filters.minQol}/5
      </label>
      <input
        id="qol"
        type="range"
        min={1}
        max={5}
        step={1}
        value={filters.minQol}
        onChange={(e) =>
          onChange({ ...filters, minQol: Number(e.target.value) })
        }
      />
      <p className="filter-hint">
        Student-city livability, stress, and day-to-day ease for an international
      </p>

      <label className="filter-label" htmlFor="visa">
        Min ease of admission / visa: {filters.minVisaEase}/5
      </label>
      <input
        id="visa"
        type="range"
        min={1}
        max={5}
        step={1}
        value={filters.minVisaEase}
        onChange={(e) =>
          onChange({ ...filters, minVisaEase: Number(e.target.value) })
        }
      />
      <p className="filter-hint">
        How hard grades + paperwork are for a Canadian passport holder
      </p>

      <label className="filter-label" htmlFor="summer">
        Min summer field / co-op / jobs: {filters.minSummer}/5
      </label>
      <input
        id="summer"
        type="range"
        min={1}
        max={5}
        step={1}
        value={filters.minSummer}
        onChange={(e) =>
          onChange({ ...filters, minSummer: Number(e.target.value) })
        }
      />
      <p className="filter-hint">
        Field camps, co-op, or relevant paid summer work during the degree
      </p>

      <label className="filter-label" htmlFor="travel">
        Max travel from LCA: {filters.maxTravelHours} hrs
      </label>
      <input
        id="travel"
        type="range"
        min={3}
        max={20}
        step={0.5}
        value={filters.maxTravelHours}
        onChange={(e) =>
          onChange({ ...filters, maxTravelHours: Number(e.target.value) })
        }
      />
      <p className="filter-hint">
        Typical door-to-door time from Larnaca (home base)
      </p>
      <p className="filter-label">Country</p>
      <div className="chip-row wrap">
        {FILTER_COUNTRIES.map((country) => (
          <button
            key={country}
            type="button"
            className={`chip ${filters.countries.includes(country) ? 'active' : ''}`}
            onClick={() => toggleCountry(country)}
          >
            <span aria-hidden="true">{COUNTRY_FLAGS[country] ?? ''}</span> {country}
          </button>
        ))}
      </div>
      <p className="filter-links">
        <button
          type="button"
          className="link-btn"
          onClick={() =>
            onChange({ ...filters, countries: [...FILTER_COUNTRIES] })
          }
        >
          All
        </button>
        <button
          type="button"
          className="link-btn"
          onClick={() => onChange({ ...filters, countries: [] })}
        >
          None
        </button>
      </p>

      <p className="filter-label">Language</p>
      <div className="chip-row">
        {(
          [
            ['all', 'All'],
            ['english', 'English'],
            ['bilingual', 'FR/EN bilingual'],
            ['french', 'French'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={`chip ${filters.language === value ? 'active' : ''}`}
            onClick={() => onChange({ ...filters, language: value })}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="filter-label">Academic focus</p>
      <div className="chip-row wrap">
        {ALL_FOCUS.map((tag) => (
          <button
            key={tag}
            type="button"
            className={`chip ${filters.focus.includes(tag) ? 'active' : ''}`}
            onClick={() => toggleFocus(tag)}
          >
            {FOCUS_LABELS[tag]}
          </button>
        ))}
      </div>
    </aside>
  )
}
