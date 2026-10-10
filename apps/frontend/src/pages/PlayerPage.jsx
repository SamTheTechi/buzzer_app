import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { createSocket } from '../lib/socket'

export default function PlayerPage() {
  const { roomCode } = useParams()
  const [searchParams] = useSearchParams()
  const name = searchParams.get('name')?.trim() ?? ''
  const [room, setRoom] = useState(null)
  const [playerId, setPlayerId] = useState(null)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState(null)
  const socketRef = useRef(null)

  useEffect(() => {
    const code = roomCode ?? ''
    if (!code) return

    const socket = createSocket()
    socketRef.current = socket
    setRoom(null)
    setPlayerId(null)

    function joinRoom() {
      setConnected(true)
      setError(null)
      socket.emit('player:join-room', { roomCode: code, name }, (result) => {
        if (!result.ok) {
          setError(result.error)
          return
        }
        setRoom(result.data)
        setPlayerId(result.data.playerId)
      })
    }

    function handleDisconnect() {
      setConnected(false)
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

    socket.on('connect', joinRoom)
    socket.on('disconnect', handleDisconnect)
    socket.on('connect_error', handleConnectError)
    socket.on('room:state', handleRoomState)
    socket.on('room:closed', handleRoomClosed)
    socket.connect()

    return () => {
      socketRef.current = null
      socket.off('connect', joinRoom)
      socket.off('disconnect', handleDisconnect)
      socket.off('connect_error', handleConnectError)
      socket.off('room:state', handleRoomState)
      socket.off('room:closed', handleRoomClosed)
      socket.disconnect()
    }
  }, [roomCode, name])

  if (!roomCode) {
    return (
      <main>
        <h1>Player</h1>
        <p>Missing room code.</p>
        <Link to="/">Back to home</Link>
      </main>
    )
  }

  const buzzed = Boolean(room?.buzzers.some((buzz) => buzz.playerId === playerId))

  function buzz() {
    socketRef.current?.emit('player:buzz', (result) => {
      if (!result.ok) {
        setError(result.error)
        return
      }
      setRoom((current) => current ? { ...current, buzzers: [...current.buzzers, result.data] } : current)
      setError(null)
    })
  }

  return (
    <main>
      <p>
        <Link to="/">Leave</Link>
      </p>
      <h1>Player</h1>
      <p>
        Room: <strong>{roomCode.toUpperCase()}</strong>
        {name ? <>{' — '}playing as <strong>{name}</strong></> : null}
      </p>
      <p>{connected ? 'Connected' : 'Connecting…'}</p>
      <p>
        Buzzed: <strong>{buzzed ? 'yes' : 'no'}</strong>
      </p>
      <button type="button" onClick={buzz} disabled={!connected || !room || buzzed}>
        {buzzed ? 'BUZZED — wait for reset' : 'BUZZ'}
      </button>
      {buzzed && <p>You buzzed in. Wait for the host to reset.</p>}
      {error && <p role="alert">{error}</p>}
    </main>
  )
}
