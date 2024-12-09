import http from "http";
import { Server as SocketServer } from "socket.io";
import app from "./app";
import initSocket from "../config/socket";

const server = http.createServer(app);
export const io = new SocketServer(server, { cors: { origin: "*" } });

initSocket(io);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
