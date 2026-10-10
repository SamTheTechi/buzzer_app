import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { Server } from "socket.io";
import { CloseHostRoom } from "./controllers/hostCloseRoom.js";
import { CreateRoom } from "./controllers/hostCreateRoom.js";
import { ResetButton } from "./controllers/hostResetButton.js";
import { RemoveDisconnectedPlayer } from "./controllers/playerRemoveDisconnected.js";
import { PlayerBuzz } from "./controllers/playerBuzz.js";
import { JoinRoom } from "./controllers/playerJoinRoom.js";

dotenv.config();

const port = process.env.PORT || 3000;
// If CORS_ORIGIN is set, lock to that domain. If not, reflect the
// request origin so you can redeploy the frontend anywhere without
// touching the backend. Frontend still needs VITE_BACKEND_URL.
const allowedOrigin = process.env.CORS_ORIGIN || true;

const app = express();
app.use(helmet());
app.use(cors({ origin: allowedOrigin }));
app.get("/ping", (_, res) => res.json({ ok: "pong" }));

const start = async () => {
  try {
    const httpServer = app.listen(port, "0.0.0.0", () => {
      console.log(`server stated!`);
    });

    const io = new Server(httpServer, { cors: { origin: allowedOrigin } });

    io.on("connection", (socket) => {
      CreateRoom(io, socket);
      ResetButton(io, socket);
      PlayerBuzz(io, socket);
      JoinRoom(io, socket);

      socket.on("disconnect", () => {
        CloseHostRoom(io, socket);
        RemoveDisconnectedPlayer(io, socket);
      });
    });
  } catch (e) {
    console.warn(e);
  }
};

start();
