export class Player {
  constructor(id, name, joinedAt = new Date().toISOString()) {
    this.id = id;
    this.name = name;
    this.joinedAt = joinedAt;
  }
}
