import { roomStore } from "../model/store.js";

export function PlayerBuzz(io, socket) {
  socket.on("player:buzz", (ack) => {
    const room = roomStore.find(socket.data.roomCode);
    if (socket.data.role !== "player" || !room) {
      ack({ ok: false, error: "Join a room before buzzing." });
      return;
    }

    const buzz = room.buzz(socket.id);
    if (!buzz) {
      ack({
        ok: false,
        error: "You have already buzzed. Wait for the host to reset.",
      });
      return;
    }

    ack({ ok: true, data: buzz });
    io.to(room.code).emit("room:state", room.snapshot());
  });
}
