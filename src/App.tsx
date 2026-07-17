import { useEffect, useMemo, useState } from 'react'
import { FAVORITES_STORAGE_KEY } from './config'
import { totalEurMax } from './costs'
import type { Currency } from './currency'
import { programs } from './data/programs'
import { DEFAULT_FILTERS } from './defaultFilters'
import { CurrencyToggle } from './components/CurrencyToggle'
import { RegionToggle } from './components/RegionToggle'
import { FilterPanel } from './components/FilterPanel'
import { ProgramList } from './components/ProgramList'
import { ProgramMap } from './components/ProgramMap'
import { DetailPanel } from './components/DetailPanel'
import type { Filters, Region } from './types'

type MobileTab = 'map' | 'list' | 'filters'

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
      if (!filters.countries.includes(p.country)) return false
      if (filters.language !== 'all' && p.language !== filters.language) return false
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

function useIsMobile(query = '(max-width: 900px)') {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => setIsMobile(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [query])

  return isMobile
}

export default function App() {
  const isMobile = useIsMobile()
  const [currency, setCurrency] = useState<Currency>('USD')
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(loadFavorites)
  const [mapRegion, setMapRegion] = useState<Region>('europe')
  const [mobileTab, setMobileTab] = useState<MobileTab>('map')

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...favorites]))
  }, [favorites])

  // If the last favourite is removed, clear the favourites-only filter
  useEffect(() => {
    if (favorites.size === 0 && filters.favoritesOnly) {
      setFilters((prev) => ({ ...prev, favoritesOnly: false }))
    }
  }, [favorites.size, filters.favoritesOnly])

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

  // Keep detail open even if the program is filtered out of the list/maps
  const selected = programs.find((p) => p.id === selectedId) ?? null

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleSelect(id: string) {
    setSelectedId(id)
    const program = programs.find((p) => p.id === id)
    if (program) setMapRegion(program.region)
    if (isMobile) setMobileTab('map')
  }

  const showEuropeMap = !isMobile || (mobileTab === 'map' && mapRegion === 'europe')
  const showCanadaMap = !isMobile || (mobileTab === 'map' && mapRegion === 'canada')

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <p className="brand">PJ University Chooser</p>
          <p className="tagline">
            Earth science · Fall 2027 · Europe + Canada
          </p>
        </div>
        <div className="topbar-controls">
          <CurrencyToggle currency={currency} onChange={setCurrency} />
        </div>
      </header>

      <nav className="mobile-nav" aria-label="Main">
        {(
          [
            ['map', 'Map'],
            ['list', 'List'],
            ['filters', 'Filters'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={mobileTab === id ? 'active' : ''}
            aria-current={mobileTab === id ? 'page' : undefined}
            onClick={() => setMobileTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className={`workspace mobile-tab-${mobileTab}`}>
        <aside className="sidebar">
          <div className="filters-pane">
            <FilterPanel
              currency={currency}
              filters={filters}
              onChange={setFilters}
              resultCount={filtered.length}
              favoriteCount={favorites.size}
            />
          </div>
          <div className="list-pane">
            <ProgramList
              programs={filtered}
              selectedId={selectedId}
              currency={currency}
              favorites={favorites}
              onSelect={handleSelect}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        </aside>

        <main className="main">
          <div className="map-region-bar">
            <RegionToggle region={mapRegion} onChange={setMapRegion} />
          </div>
          <div className={`maps-stack show-${mapRegion}`}>
            {showEuropeMap && (
              <section className="map-pane" aria-label="Europe map">
                <ProgramMap
                  region="europe"
                  programs={europePrograms}
                  selectedId={selectedId}
                  onSelect={handleSelect}
                />
              </section>
            )}
            {showCanadaMap && (
              <section className="map-pane" aria-label="Canada map">
                <ProgramMap
                  region="canada"
                  programs={canadaPrograms}
                  selectedId={selectedId}
                  onSelect={handleSelect}
                />
              </section>
            )}
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
