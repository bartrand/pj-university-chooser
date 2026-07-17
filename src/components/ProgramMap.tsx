import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { HOME_BASES } from '../data/programs'
import type { Program, Region } from '../types'
import 'leaflet/dist/leaflet.css'

// Fix default marker icons under Vite
const uniIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
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

/**
 * Fan out markers that sit on (nearly) the same spot — e.g. two Krakow unis —
 * so both pins stay visible and clickable at regional zoom.
 */
function offsetOverlapping(
  programs: Program[],
): { program: Program; position: [number, number] }[] {
  const groups = new Map<string, Program[]>()
  for (const p of programs) {
    // Same city = same pin problem at regional zoom (Krakow, Msida, …)
    const key = `${p.city}|${p.country}`
    const list = groups.get(key) ?? []
    list.push(p)
    groups.set(key, list)
  }

  const placed: { program: Program; position: [number, number] }[] = []
  for (const group of groups.values()) {
    if (group.length === 1) {
      placed.push({ program: group[0], position: [group[0].lat, group[0].lng] })
      continue
    }
    const lat0 = group.reduce((s, p) => s + p.lat, 0) / group.length
    const lng0 = group.reduce((s, p) => s + p.lng, 0) / group.length
    // Large enough to read as two pins on the Europe/Canada overview maps
    const radius = 0.35
    group.forEach((p, i) => {
      const angle = (2 * Math.PI * i) / group.length - Math.PI / 2
      const cosLat = Math.cos((lat0 * Math.PI) / 180)
      placed.push({
        program: p,
        position: [
          lat0 + radius * Math.cos(angle),
          lng0 + (radius * Math.sin(angle)) / Math.max(cosLat, 0.2),
        ],
      })
    })
  }
  return placed
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

export function ProgramMap({ region, programs, selectedId, onSelect }: ProgramMapProps) {
  const view = REGION_VIEW[region]
  const markers = useMemo(() => offsetOverlapping(programs), [programs])

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
          HOME_BASES.map((base) => (
            <Marker key={base.id} position={[base.lat, base.lng]} icon={homeIcon}>
              <Popup>
                <strong>{base.name}</strong>
                <br />
                Home base
              </Popup>
            </Marker>
          ))}

        {markers.map(({ program: p, position }) => (
          <Marker
            key={p.id}
            position={position}
            icon={uniIcon}
            eventHandlers={{ click: () => onSelect(p.id) }}
            opacity={selectedId && selectedId !== p.id ? 0.55 : 1}
          >
            <Popup>
              <strong>{p.university}</strong>
              <br />
              {p.city}, {p.country}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {programs.length === 0 && (
        <div className="map-empty">
          <p>No programs match filters.</p>
        </div>
      )}
    </div>
  )
}
