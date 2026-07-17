import type { Region } from '../types'

interface RegionToggleProps {
  region: Region
  onChange: (region: Region) => void
}

export function RegionToggle({ region, onChange }: RegionToggleProps) {
  return (
    <div className="region-toggle" role="tablist" aria-label="Map region">
      <button
        type="button"
        role="tab"
        aria-selected={region === 'europe'}
        className={region === 'europe' ? 'active' : ''}
        onClick={() => onChange('europe')}
      >
        <span aria-hidden="true">🇪🇺</span> Europe
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={region === 'canada'}
        className={region === 'canada' ? 'active' : ''}
        onClick={() => onChange('canada')}
      >
        <span aria-hidden="true">🇨🇦</span> Canada
      </button>
    </div>
  )
}
