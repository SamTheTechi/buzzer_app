import { io } from "socket.io-client";

export function createSocket() {
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000";
  return io(backendUrl, { autoConnect: false });
}
