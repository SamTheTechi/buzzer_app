import { roomStore } from "../model/store.js";

export function RemoveDisconnectedPlayer(io, socket) {
  const code = socket.data.roomCode;
  if (!code || socket.data.role !== "player") return;

  const snapshot = roomStore.removePlayer(code, socket.id);
  if (snapshot) io.to(code).emit("room:state", snapshot);
}
