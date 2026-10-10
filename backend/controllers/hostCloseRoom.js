import { roomStore } from "../model/store.js";

export function CloseHostRoom(io, socket){
    const code = socket.data.roomCode;
    const room = code ? roomStore.find(code):undefined;
    if(!room || socket.data.role !== "host" || room.hostId !== socket.id){
        return;
    }

    roomStore.close(code);
    io.to(room.code).emit("room:closed", "the host disconnected")
}