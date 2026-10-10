export class Buzz {
  constructor(playerId, name, position, buzzedAt = new Date().toISOString()) {
    this.playerId = playerId;
    this.name = name;
    this.position = position;
    this.buzzedAt = buzzedAt;
  }
}
