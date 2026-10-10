import { roomStore } from "../model/store.js";

export function JoinRoom(io, socket) {
  socket.on("player:join-room", (payload, ack) => {
    if (socket.data.roomCode) {
      ack({ ok: false, error: "This connection already belongs to a room." });
      return;
    }

    const code = payload?.roomCode?.toString().trim().toUpperCase();
    const name = payload?.name?.toString().trim() ?? "";
    if (!code || name.length > 32) {
      ack({
        ok: false,
        error: "Enter a valid room code and a name of at most 32 characters.",
      });
      return;
    }

    const snapshot = roomStore.join(code, socket.id, name);
    if (!snapshot) {
      ack({ ok: false, error: "That room does not exist or has closed." });
      return;
    }

    socket.data.roomCode = code;
    socket.data.role = "player";
    void socket.join(code);
    ack({ ok: true, data: snapshot });
    io.to(code).emit("room:state", snapshot);
  });
}
