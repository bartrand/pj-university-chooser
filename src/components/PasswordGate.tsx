import { useState, type FormEvent } from 'react'
import { APP_PASSWORD, AUTH_STORAGE_KEY } from '../config'

interface PasswordGateProps {
  onUnlock: () => void
}

export function PasswordGate({ onUnlock }: PasswordGateProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (password === APP_PASSWORD) {
      localStorage.setItem(AUTH_STORAGE_KEY, '1')
      onUnlock()
      return
    }
    setError(true)
  }

  return (
    <div className="gate">
      <div className="gate-panel">
        <p className="gate-brand">PJ University Chooser</p>
        <h1>Family access</h1>
        <p className="gate-sub">
          Enter the shared password for Bart, Michelle, and PJ.
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError(false)
            }}
            autoFocus
          />
          {error && <p className="gate-error">That password doesn’t match.</p>}
          <button type="submit">Open</button>
        </form>
      </div>
    </div>
  )
}
