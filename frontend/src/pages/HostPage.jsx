import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { createSocket } from '../lib/socket'

export default function HostPage() {
  const [room, setRoom] = useState(null)
  const [error, setError] = useState(null)
  const [connected, setConnected] = useState(false)
  const socketRef = useRef(null)

  useEffect(() => {
    const socket = createSocket()
    socketRef.current = socket
    let roomCreated = false

    function handleConnect() {
      setConnected(true)
      if (roomCreated) {
        setError('The host connection was interrupted. Create a new room to continue.')
        return
      }

      socket.emit('host:create-room', (result) => {
        if (!result.ok) {
          setError(result.error)
          return
        }
        roomCreated = true
        setRoom(result.data)
      })
    }

    function handleDisconnect() {
      setConnected(false)
      if (roomCreated) setError('The host connection closed and this room has ended.')
    }

    function handleRoomState(state) {
      setRoom(state)
    }

    function handleRoomClosed(reason) {
      setError(reason)
    }

    function handleConnectError() {
      setError('Could not connect to the server. Check that the backend is running.')
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('connect_error', handleConnectError)
    socket.on('room:state', handleRoomState)
    socket.on('room:closed', handleRoomClosed)
    socket.connect()

    return () => {
      socketRef.current = null
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('connect_error', handleConnectError)
      socket.off('room:state', handleRoomState)
      socket.off('room:closed', handleRoomClosed)
      socket.disconnect()
    }
  }, [])

  function resetBuzzers() {
    socketRef.current?.emit('host:reset-buzzers', (result) => {
      if (!result.ok) setError(result.error)
      else setRoom(result.data)
    })
  }

  return (
    <main>
      <p>
        <Link to="/">Back</Link>
      </p>
      <h1>Host Room</h1>
      {room ? (
        <>
          <p>
            Room code: <strong>{room.roomCode}</strong>
          </p>
          <p>Share this code with players so they can join.</p>
          <p>{connected ? 'Connected' : 'Reconnecting…'}</p>

          <section>
            <h2>Players ({room.players.length})</h2>
            {room.players.length === 0 ? (
              <p>Waiting for players to join…</p>
            ) : (
              <ul>
                {room.players.map((player) => <li key={player.id}>{player.name}</li>)}
              </ul>
            )}
          </section>

          <section>
            <h2>Buzz order</h2>
            {room.buzzers.length === 0 ? (
              <p>No buzzes yet. Waiting for players…</p>
            ) : (
              <ol>
                {room.buzzers.map((buzz) => (
                  <li key={buzz.playerId}>
                    #{buzz.position} {buzz.name} — {new Date(buzz.buzzedAt).toLocaleTimeString()}
                  </li>
                ))}
              </ol>
            )}
            <button type="button" onClick={resetBuzzers} disabled={room.buzzers.length === 0}>
              Reset Buzzers
            </button>
          </section>
        </>
      ) : (
        <p>{connected ? 'Creating room…' : 'Connecting to server…'}</p>
      )}
      {error && <p role="alert">{error}</p>}
    </main>
  )
}
