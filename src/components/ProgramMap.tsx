import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { HOME_BASES } from '../data/programs'
import type { Program, Region } from '../types'
import 'leaflet/dist/leaflet.css'

/** Chooser list that closes the Leaflet popup after a pick. */
function PinProgramChooser({
  pin,
  selectedId,
  onSelect,
}: {
  pin: PinGroup
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const map = useMap()

  function pick(id: string) {
    onSelect(id)
    map.closePopup()
  }

  return (
    <div className="map-pin-chooser">
      <p className="map-pin-chooser-title">
        <strong>
          {pin.city}, {pin.country}
        </strong>
        <span className="muted">
          {' '}
          — {pin.programs.length} programs
        </span>
      </p>
      <ul className="map-pin-chooser-list">
        {pin.programs.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              className={
                p.id === selectedId
                  ? 'map-pin-chooser-btn is-selected'
                  : 'map-pin-chooser-btn'
              }
              onClick={() => pick(p.id)}
            >
              <span className="map-pin-chooser-uni">{p.university}</span>
              <span className="map-pin-chooser-prog">{p.program}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Local copies in /public — works with GitHub Pages base path
const base = import.meta.env.BASE_URL
const uniIcon = L.icon({
  iconUrl: `${base}marker-icon.png`,
  iconRetinaUrl: `${base}marker-icon-2x.png`,
  shadowUrl: `${base}marker-shadow.png`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const homeIcon = L.divIcon({
  className: 'home-marker',
  html: '<span></span>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

const REGION_VIEW: Record<Region, { center: [number, number]; zoom: number }> = {
  europe: { center: [48.5, 12], zoom: 4 },
  canada: { center: [56, -96], zoom: 3 },
}

type PinGroup = {
  key: string
  city: string
  country: string
  position: [number, number]
  programs: Program[]
}

/** Group by city so one accurate pin can open a chooser when several schools share a place. */
function groupByCity(programs: Program[]): PinGroup[] {
  const groups = new Map<string, Program[]>()
  for (const p of programs) {
    const key = `${p.city}|${p.country}`
    const list = groups.get(key) ?? []
    list.push(p)
    groups.set(key, list)
  }

  return [...groups.entries()].map(([key, list]) => {
    const lat = list.reduce((s, p) => s + p.lat, 0) / list.length
    const lng = list.reduce((s, p) => s + p.lng, 0) / list.length
    return {
      key,
      city: list[0].city,
      country: list[0].country,
      position: [lat, lng],
      programs: list,
    }
  })
}

function multiPinIcon(count: number) {
  return L.divIcon({
    className: 'cluster-marker',
    html: `<div class="cluster-marker-pin"><span>${count}</span></div>`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -36],
  })
}

function FitBounds({ programs, region }: { programs: Program[]; region: Region }) {
  const map = useMap()

  useEffect(() => {
    if (programs.length === 0) {
      const view = REGION_VIEW[region]
      map.setView(view.center, view.zoom)
      return
    }
    const points: L.LatLngExpression[] = programs.map((p) => [p.lat, p.lng])
    if (region === 'europe') {
      HOME_BASES.forEach((b) => points.push([b.lat, b.lng]))
    }
    map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 6 })
  }, [programs, region, map])

  return null
}

interface ProgramMapProps {
  region: Region
  programs: Program[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function ProgramMap({
  region,
  programs,
  selectedId,
  onSelect,
}: ProgramMapProps) {
  const view = REGION_VIEW[region]
  const pins = useMemo(() => groupByCity(programs), [programs])

  return (
    <div className="map-wrap">
      <MapContainer
        key={region}
        center={view.center}
        zoom={view.zoom}
        className="map"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds programs={programs} region={region} />

        {region === 'europe' &&
          HOME_BASES.map((home) => (
            <Marker key={home.id} position={[home.lat, home.lng]} icon={homeIcon}>
              <Popup>
                <strong>{home.name}</strong>
                <br />
                Home base
              </Popup>
            </Marker>
          ))}

        {pins.map((pin) => {
          const multi = pin.programs.length > 1
          const containsSelected = pin.programs.some((p) => p.id === selectedId)
          const dimmed = Boolean(selectedId && !containsSelected)

          return (
            <Marker
              key={pin.key}
              position={pin.position}
              icon={multi ? multiPinIcon(pin.programs.length) : uniIcon}
              eventHandlers={{
                click: () => {
                  if (!multi) onSelect(pin.programs[0].id)
                },
              }}
              opacity={dimmed ? 0.55 : 1}
            >
              <Popup>
                {multi ? (
                  <PinProgramChooser
                    pin={pin}
                    selectedId={selectedId}
                    onSelect={onSelect}
                  />
                ) : (
                  <>
                    <strong>{pin.programs[0].university}</strong>
                    <br />
                    {pin.programs[0].program}
                    <br />
                    <span className="muted">
                      {pin.city}, {pin.country}
                    </span>
                  </>
                )}
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {programs.length === 0 && (
        <div className="map-empty">
          <p>No programs match filters.</p>
        </div>
      )}
    </div>
  )
}
