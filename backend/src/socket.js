const { Server } = require("socket.io");

let io = null;

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    socket.on("join-project", (projectId) => {
      socket.join(`project:${projectId}`);
    });

    socket.on("project-message", (payload) => {
      if (!payload?.projectId || !payload?.message) return;
      io.to(`project:${payload.projectId}`).emit("project-message", {
        projectId: payload.projectId,
        message: payload.message,
        sender: payload.sender || "anonymous",
        sentAt: Date.now(),
      });
    });
  });
};

module.exports = initSocket;
