import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { normalizeRoomCode } from '../lib/room'

export default function Landing() {
  const navigate = useNavigate()
  const [joinCode, setJoinCode] = useState('')
  const [joinName, setJoinName] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleCreate() {
    navigate('/host')
  }

  function handleJoin(e: FormEvent) {
    e.preventDefault()
    const code = normalizeRoomCode(joinCode)
    if (!code) {
      setError('Enter a room code to join.')
      return
    }
    setError(null)
    const params = new URLSearchParams()
    if (joinName.trim()) params.set('name', joinName.trim())
    const suffix = params.toString() ? `?${params.toString()}` : ''
    navigate(`/play/${code}${suffix}`)
  }

  return (
    <main>
      <h1>Quiz Buzzer</h1>
      <p>Create a room as host, or join with a code as player.</p>

      <section>
        <h2>Create Room</h2>
        <p>Start a new game and share the code with players.</p>
        <button type="button" onClick={handleCreate}>
          Create Room
        </button>
      </section>

      <section>
        <h2>Join Room</h2>
        <form onSubmit={handleJoin}>
          <div>
            <label htmlFor="room-code">Room code</label>
            <input
              id="room-code"
              type="text"
              placeholder="e.g. AB12CD"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="player-name">Your name (optional)</label>
            <input
              id="player-name"
              type="text"
              placeholder="e.g. Alex"
              value={joinName}
              onChange={(e) => setJoinName(e.target.value)}
            />
          </div>
          {error && <p role="alert">{error}</p>}
          <button type="submit">Join Room</button>
        </form>
      </section>
    </main>
  )
}
