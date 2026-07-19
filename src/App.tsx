import { useEffect, useMemo, useState } from 'react'
import { totalEurMax } from './costs'
import type { Currency } from './currency'
import { CurrencyToggle } from './components/CurrencyToggle'
import { RegionToggle } from './components/RegionToggle'
import { ProfileToggle } from './components/ProfileToggle'
import { FilterPanel } from './components/FilterPanel'
import { ProgramList } from './components/ProgramList'
import { ProgramMap } from './components/ProgramMap'
import { DetailPanel } from './components/DetailPanel'
import { ShortlistCompare } from './components/ShortlistCompare'
import {
  defaultFiltersFor,
  isProfileId,
  PROFILE_STORAGE_KEY,
  PROFILES,
  type ProfileId,
} from './profiles'
import type { Filters, Program, Region } from './types'

type MobileTab = 'map' | 'list' | 'filters'

function loadProfileId(): ProfileId {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('profile')
    if (fromUrl && isProfileId(fromUrl)) return fromUrl
  } catch {
    /* ignore */
  }
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY)
    if (raw && isProfileId(raw)) return raw
  } catch {
    /* ignore */
  }
  return 'pj'
}

function loadFavorites(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return new Set()
    return new Set(parsed.filter((id): id is string => typeof id === 'string'))
  } catch {
    return new Set()
  }
}

function matchesFilters(
  programs: Program[],
  filters: Filters,
  favorites: Set<string>,
) {
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
      if (filters.language !== 'all' && p.language !== filters.language) {
        return false
      }
      if (filters.focus.length > 0 && !filters.focus.some((t) => p.focus.includes(t))) {
        return false
      }
      if (filters.hideAuditionGated && p.entryBarrier === 'audition') {
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
  const [profileId, setProfileId] = useState<ProfileId>(loadProfileId)
  const profile = PROFILES[profileId]

  const [currency, setCurrency] = useState<Currency>('USD')
  const [filters, setFilters] = useState<Filters>(() =>
    defaultFiltersFor(PROFILES[loadProfileId()]),
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(() =>
    loadFavorites(PROFILES[loadProfileId()].favoritesKey),
  )
  const [mapRegion, setMapRegion] = useState<Region>('europe')
  const [mobileTab, setMobileTab] = useState<MobileTab>('map')
  const [showShortlist, setShowShortlist] = useState(false)

  useEffect(() => {
    localStorage.setItem(PROFILE_STORAGE_KEY, profileId)
    document.title = profile.documentTitle
    try {
      const url = new URL(window.location.href)
      url.searchParams.set('profile', profileId)
      window.history.replaceState({}, '', url)
    } catch {
      /* ignore */
    }
  }, [profileId, profile.documentTitle])

  useEffect(() => {
    localStorage.setItem(profile.favoritesKey, JSON.stringify([...favorites]))
  }, [favorites, profile.favoritesKey])

  // If the last favourite is removed, clear the favourites-only filter
  useEffect(() => {
    if (favorites.size === 0 && filters.favoritesOnly) {
      setFilters((prev) => ({ ...prev, favoritesOnly: false }))
    }
  }, [favorites.size, filters.favoritesOnly])

  useEffect(() => {
    if (favorites.size < 2 && showShortlist) setShowShortlist(false)
  }, [favorites.size, showShortlist])

  function handleProfileChange(nextId: ProfileId) {
    if (nextId === profileId) return
    const next = PROFILES[nextId]
    setProfileId(nextId)
    setFilters(defaultFiltersFor(next))
    setFavorites(loadFavorites(next.favoritesKey))
    setSelectedId(null)
    setShowShortlist(false)
    setMapRegion('europe')
  }

  const filtered = useMemo(
    () => matchesFilters(profile.programs, filters, favorites),
    [profile.programs, filters, favorites],
  )

  const favoritePrograms = useMemo(
    () =>
      [...favorites]
        .map((id) => profile.programs.find((p) => p.id === id))
        .filter((p): p is Program => p != null),
    [favorites, profile.programs],
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
  const selected = profile.programs.find((p) => p.id === selectedId) ?? null

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
    const program = profile.programs.find((p) => p.id === id)
    if (program) setMapRegion(program.region)
    if (isMobile) setMobileTab('map')
  }

  const showEuropeMap = !isMobile || (mobileTab === 'map' && mapRegion === 'europe')
  const showCanadaMap = !isMobile || (mobileTab === 'map' && mapRegion === 'canada')

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <p className="brand">{profile.brand}</p>
          <p className="tagline">{profile.tagline}</p>
        </div>
        <div className="topbar-controls">
          <ProfileToggle profileId={profileId} onChange={handleProfileChange} />
          {favorites.size >= 2 && (
            <button
              type="button"
              className="shortlist-open-btn"
              onClick={() => setShowShortlist(true)}
            >
              Compare shortlist ({favorites.size})
            </button>
          )}
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
        <aside className="filters-pane" aria-label="Filters">
          <FilterPanel
            profile={profile}
            currency={currency}
            filters={filters}
            onChange={setFilters}
            resultCount={filtered.length}
            favoriteCount={favorites.size}
          />
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
            profile={profile}
            program={selected}
            currency={currency}
            favorited={selected ? favorites.has(selected.id) : false}
            onToggleFavorite={() => {
              if (selected) toggleFavorite(selected.id)
            }}
            onClose={() => setSelectedId(null)}
          />
        </main>

        <aside className="list-pane" aria-label="Programs">
          <ProgramList
            programs={filtered}
            selectedId={selectedId}
            currency={currency}
            favorites={favorites}
            onSelect={handleSelect}
            onToggleFavorite={toggleFavorite}
          />
        </aside>
      </div>

      {showShortlist && favoritePrograms.length >= 2 && (
        <ShortlistCompare
          profile={profile}
          programs={favoritePrograms}
          currency={currency}
          onSelect={handleSelect}
          onClose={() => setShowShortlist(false)}
          onRemove={toggleFavorite}
        />
      )}
    </div>
  )
}
