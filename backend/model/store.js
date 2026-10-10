import { customAlphabet } from "nanoid";
import { Room } from "./room.js";

const CreateRoomCode = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567890", 6);

export class RoomStore {
  #rooms = new Map();

  create(hostId) {
    let code = CreateRoomCode();
    while (this.#rooms.has(code)) code = CreateRoomCode();

    const room = new Room(code, hostId);
    this.#rooms.set(code, room);
    return room;
  }

  join(code, playerId, name) {
    const room = this.find(code);
    if (!room) return null;

    room.addPlayers(playerId, name);

    return room.snapshot(playerId);
  }

  removePlayer(code, playerId) {
    const room = this.find(code);
    if (!room || !room.removePlayer(playerId)) {
      return null;
    }
    return room.snapshot();
  }

  find(code) {
    return this.#rooms.get(code);
  }

  close(code) {
    return this.#rooms.delete(code);
  }
}

export const roomStore = new RoomStore();
