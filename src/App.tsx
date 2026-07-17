import { useEffect, useMemo, useState } from 'react'
import { AUTH_STORAGE_KEY, FAVORITES_STORAGE_KEY } from './config'
import { totalEurMax } from './costs'
import type { Currency } from './currency'
import { programs, EUROPE_COUNTRIES } from './data/programs'
import { PasswordGate } from './components/PasswordGate'
import { CurrencyToggle } from './components/CurrencyToggle'
import { FilterPanel } from './components/FilterPanel'
import { ProgramList } from './components/ProgramList'
import { ProgramMap } from './components/ProgramMap'
import { DetailPanel } from './components/DetailPanel'
import type { Filters } from './types'

const DEFAULT_FILTERS: Filters = {
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
}

function loadFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return new Set()
    return new Set(parsed.filter((id): id is string => typeof id === 'string'))
  } catch {
    return new Set()
  }
}

function matchesFilters(filters: Filters, favorites: Set<string>) {
  return programs
    .filter((p) => {
      if (filters.favoritesOnly && !favorites.has(p.id)) return false
      if (totalEurMax(p) > filters.maxTotal) return false
      if (p.prestige < filters.minPrestige) return false
      if (p.qolScore < filters.minQol) return false
      if (p.visaEaseScore < filters.minVisaEase) return false
      if (p.summerScore < filters.minSummer) return false
      if (p.travelHoursFromLca > filters.maxTravelHours) return false
      if (filters.language !== 'all' && p.language !== filters.language) return false
      if (p.region === 'europe' && !filters.countries.includes(p.country)) {
        return false
      }
      if (filters.focus.length > 0 && !filters.focus.some((t) => p.focus.includes(t))) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      const af = favorites.has(a.id) ? 0 : 1
      const bf = favorites.has(b.id) ? 0 : 1
      if (af !== bf) return af - bf
      return totalEurMax(a) - totalEurMax(b)
    })
}

export default function App() {
  const [unlocked, setUnlocked] = useState(
    () => localStorage.getItem(AUTH_STORAGE_KEY) === '1',
  )
  const [currency, setCurrency] = useState<Currency>('CAD')
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(loadFavorites)

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...favorites]))
  }, [favorites])

  const filtered = useMemo(
    () => matchesFilters(filters, favorites),
    [filters, favorites],
  )

  const europePrograms = useMemo(
    () => filtered.filter((p) => p.region === 'europe'),
    [filtered],
  )
  const canadaPrograms = useMemo(
    () => filtered.filter((p) => p.region === 'canada'),
    [filtered],
  )

  const selected = filtered.find((p) => p.id === selectedId) ?? null

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <p className="brand">PJ University Chooser</p>
          <p className="tagline">
            Earth science · Fall 2027 · Europe + Canada side by side
          </p>
        </div>
        <div className="topbar-controls">
          <CurrencyToggle currency={currency} onChange={setCurrency} />
        </div>
      </header>

      <div className="workspace">
        <div className="sidebar">
          <FilterPanel
            currency={currency}
            filters={filters}
            onChange={setFilters}
            resultCount={filtered.length}
            favoriteCount={favorites.size}
          />
          <ProgramList
            programs={filtered}
            selectedId={selectedId}
            currency={currency}
            favorites={favorites}
            onSelect={setSelectedId}
            onToggleFavorite={toggleFavorite}
          />
        </div>

        <main className="main">
          <div className="maps-stack">
            <section className="map-pane" aria-label="Europe map">
              <ProgramMap
                region="europe"
                programs={europePrograms}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </section>
            <section className="map-pane" aria-label="Canada map">
              <ProgramMap
                region="canada"
                programs={canadaPrograms}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </section>
          </div>
          <DetailPanel
            program={selected}
            currency={currency}
            favorited={selected ? favorites.has(selected.id) : false}
            onToggleFavorite={() => {
              if (selected) toggleFavorite(selected.id)
            }}
            onClose={() => setSelectedId(null)}
          />
        </main>
      </div>
    </div>
  )
}
