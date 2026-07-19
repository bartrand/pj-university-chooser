import type { ProfileId } from '../profiles'

interface ProfileToggleProps {
  profileId: ProfileId
  onChange: (id: ProfileId) => void
}

export function ProfileToggle({ profileId, onChange }: ProfileToggleProps) {
  return (
    <div className="profile-toggle" role="group" aria-label="Student profile">
      <button
        type="button"
        className={profileId === 'pj' ? 'active' : ''}
        aria-pressed={profileId === 'pj'}
        onClick={() => onChange('pj')}
      >
        PJ
      </button>
      <button
        type="button"
        className={profileId === 'solange' ? 'active' : ''}
        aria-pressed={profileId === 'solange'}
        onClick={() => onChange('solange')}
      >
        Solange
      </button>
    </div>
  )
}
