import { io, type Socket } from 'socket.io-client'

export type Player = { id: string; name: string; joinedAt: string }
export type Buzz = { playerId: string; name: string; buzzedAt: string; position: number }
export type RoomState = { roomCode: string; players: Player[]; buzzers: Buzz[] }
export type Ack<T> = { ok: true; data: T } | { ok: false; error: string }

type ClientToServerEvents = {
  'host:create-room': (ack: (result: Ack<RoomState>) => void) => void
  'host:reset-buzzers': (ack: (result: Ack<RoomState>) => void) => void
  'player:join-room': (
    payload: { roomCode: string; name?: string },
    ack: (result: Ack<RoomState & { playerId: string }>) => void,
  ) => void
  'player:buzz': (ack: (result: Ack<Buzz>) => void) => void
}

type ServerToClientEvents = {
  'room:state': (state: RoomState) => void
  'room:closed': (reason: string) => void
}

export function createSocket(): Socket<ServerToClientEvents, ClientToServerEvents> {
  const backendUrl = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3001'
  return io(backendUrl, { autoConnect: false }) as Socket<ServerToClientEvents, ClientToServerEvents>
}
