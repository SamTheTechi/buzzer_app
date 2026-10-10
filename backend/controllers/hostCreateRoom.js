import { roomStore } from "../model/store.js";

export function CreateRoom(io, socket) {
    socket.on("host:create-room", (ack) => {
        if(socket.data.roomCode){
            ack({ok: false, error: "connection alredy exist"});
            return;
        }

        const room = roomStore.create(socket.id);

        socket.data.roomCode = room.code;
        socket.data.role = "host";
        void socket.join(room.code)

        const snapshot = room.snapshot();
        ack({ok: true, data: snapshot})
        io.to(room.code).emit("room:state", snapshot)
    })
}