import { COUNTRY_FLAGS } from '../data/programs'
import { convertFromEur, eurFromUsd, formatMoney, type Currency } from '../currency'
import {
  countriesForProfile,
  defaultFiltersFor,
  type Profile,
} from '../profiles'
import type { Filters, FocusTag } from '../types'

const BUDGET_MIN_USD = 20000
const BUDGET_STEP_USD = 5000

interface FilterPanelProps {
  profile: Profile
  currency: Currency
  filters: Filters
  onChange: (filters: Filters) => void
  resultCount: number
  favoriteCount: number
}

export function FilterPanel({
  profile,
  currency,
  filters,
  onChange,
  resultCount,
  favoriteCount,
}: FilterPanelProps) {
  const focusTags = Object.keys(profile.focusLabels) as FocusTag[]
  const filterCountries = countriesForProfile(profile)
  const budgetMaxUsd = profile.budgetMaxUsd

  const maxTotalUsd = Math.min(
    budgetMaxUsd,
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
    const defaults = defaultFiltersFor(profile)
    onChange({
      ...defaults,
      countries: [...defaults.countries],
      focus: [...defaults.focus],
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
        max={budgetMaxUsd}
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
      <p className="filter-hint">{profile.prestigeHint}</p>

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
        {profile.summerFilterLabel}: {filters.minSummer}/5
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
      <p className="filter-hint">{profile.summerHint}</p>

      <label className="filter-label" htmlFor="travel">
        Max travel: {filters.maxTravelHours} hrs
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
      <p className="filter-hint">{profile.travelHint}</p>

      {profile.id === 'solange' && (
        <>
          <p className="filter-label">Stage entry</p>
          <div className="chip-row">
            <button
              type="button"
              className={`chip ${filters.hideAuditionGated ? 'active' : ''}`}
              onClick={() =>
                onChange({ ...filters, hideAuditionGated: true })
              }
            >
              Hide audition-gated
            </button>
            <button
              type="button"
              className={`chip ${!filters.hideAuditionGated ? 'active' : ''}`}
              onClick={() =>
                onChange({ ...filters, hideAuditionGated: false })
              }
            >
              Show all (incl. stretch)
            </button>
          </div>
          <p className="filter-hint">
            Default hides conservatoire / audition schools — better fit with
            informal improv and no stage experience
          </p>
        </>
      )}

      <p className="filter-label">Country</p>
      <div className="chip-row wrap">
        {filterCountries.map((country) => (
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
            onChange({ ...filters, countries: [...filterCountries] })
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
        {profile.languageOptions.map(({ value, label }) => (
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
      {profile.id === 'solange' && (
        <p className="filter-hint">French and FR/EN bilingual are off the list</p>
      )}

      <p className="filter-label">Academic focus</p>
      <div className="chip-row wrap">
        {focusTags.map((tag) => (
          <button
            key={tag}
            type="button"
            className={`chip ${filters.focus.includes(tag) ? 'active' : ''}`}
            onClick={() => toggleFocus(tag)}
          >
            {profile.focusLabels[tag]}
          </button>
        ))}
      </div>
    </aside>
  )
}
