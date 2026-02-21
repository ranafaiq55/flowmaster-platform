const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Workspace = require("../models/Workspace");
const logger = require("./logger");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      return next(new Error("Unauthorized"));
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      socket.userId = payload.sub;
      return next();
    } catch (err) {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", async (socket) => {
    logger.info("Socket connected", { userId: socket.userId });
    const workspaces = await Workspace.find({ "members.user": socket.userId }).select("_id");
    workspaces.forEach((workspace) => {
      socket.join(`workspace:${workspace._id}`);
    });

    socket.on("disconnect", () => {
      logger.info("Socket disconnected", { userId: socket.userId });
    });
  });
}

function getIo() {
  if (!io) {
    throw new Error("Socket not initialized");
  }
  return io;
}

module.exports = { initSocket, getIo };
