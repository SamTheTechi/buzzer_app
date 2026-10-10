import { roomStore } from "../model/store.js";

export function  ResetButton(io, socket) {
    socket.on("host:reset-buzzers", (ack) => {
        const code = socket.data.roomCode;
        const room = code ? roomStore.find(code) : undefined;

        if(!room || socket.data.role !== "host" || room.hostId !== socket.id){
            ack({ok: false, error: "this connection alredy in the room"});
            return;
        }
        room.resetBuzzer();

        const snapshot = room.snapshot();
        ack({ok: true, data: snapshot})
        io.to(room.code).emit("room:state", snapshot)
    })
}