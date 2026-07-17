import { EUROPE_COUNTRIES, FOCUS_LABELS } from '../data/programs'
import { formatMoney, type Currency } from '../currency'
import type { Filters, FocusTag } from '../types'

const ALL_FOCUS = Object.keys(FOCUS_LABELS) as FocusTag[]

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
      maxTotal: 28000,
      minPrestige: 5,
      minQol: 1,
      minVisaEase: 1,
      minSummer: 1,
      language: 'all',
      countries: [...EUROPE_COUNTRIES],
      focus: [],
      maxTravelHours: 20,
      favoritesOnly: false,
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
        {resultCount} programs · Europe + Canada · favorites first
      </p>

      <p className="filter-label">Favorites</p>
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
          Favorites only{favoriteCount > 0 ? ` (${favoriteCount})` : ''}
        </button>
      </div>

      <label className="filter-label" htmlFor="total">
        Max tuition + living: {formatMoney(filters.maxTotal, currency)}/year
      </label>
      <input
        id="total"
        type="range"
        min={8000}
        max={35000}
        step={500}
        value={filters.maxTotal}
        onChange={(e) =>
          onChange({ ...filters, maxTotal: Number(e.target.value) })
        }
      />

      <label className="filter-label" htmlFor="prestige">
        Min Earth Sciences prestige: {filters.minPrestige}/10
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

      <p className="filter-label">Europe country</p>
      <div className="chip-row wrap">
        {EUROPE_COUNTRIES.map((country) => (
          <button
            key={country}
            type="button"
            className={`chip ${filters.countries.includes(country) ? 'active' : ''}`}
            onClick={() => toggleCountry(country)}
          >
            {country}
          </button>
        ))}
      </div>

      <p className="filter-label">Language</p>
      <div className="chip-row">
        {(
          [
            ['all', 'All'],
            ['english', 'English'],
            ['bilingual', 'FR/EN bilingual'],
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
