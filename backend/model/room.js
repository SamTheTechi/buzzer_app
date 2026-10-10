import { Buzz } from "./buzz.js";
import { Player } from "./player.js";
import { SnapShot } from "./snapshot.js";

export class Room {
  #Players = new Map();
  #buzzers = [];

  constructor(code, hostId) {
    this.code = code;
    this.hostId = hostId;
  }

  addPlayers(id, name) {
    const playerName = name.trim() || `player:${this.#Players.size + 1}`;
    const player = new Player(id, playerName);
    this.#Players.set(id, player);
    return player;
  }

  hasPlayer(id) {
    return this.#Players.has(id);
  }

  removePlayer(id) {
    return this.#Players.delete(id);
  }

  hasBuzzed(playerId) {
    return this.#buzzers.some((buzz) => buzz.playerId === playerId);
  }

  buzz(playerId) {
    const player = this.#Players.get(playerId);
    if (!player || this.hasBuzzed(playerId)) {
      return null;
    }

    const buzz = new Buzz(player.id, player.name, this.#buzzers.length + 1);
    this.#buzzers.push(buzz);
    return buzz;
  }

  resetBuzzer() {
    this.#buzzers = [];
  }

  snapshot(playerId) {
    return new SnapShot(
      this.code,
      [...this.#Players.values()],
      [...this.#buzzers],
      playerId,
    );
  }
}
