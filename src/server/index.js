require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" },
});

// =================================================
// 🧠 ROOM STORAGE (AUTHORITATIVE)
// =================================================
const roomInfo = {};
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// =================================================
// 🔌 SOCKET
// =================================================
io.on("connection", (socket) => {
  console.log("⚡ Connected:", socket.id);

  // ---------------- CREATE ROOM ----------------
  socket.on("create_room", ({ username, roomCode, config }) => {
    socket.join(roomCode);

    roomInfo[roomCode] = {
      roomCode,
      topic: config?.topic || "General Magic",
      maxPlayers: 5,
      players: [
        {
          id: socket.id,
          username,
          ready: false,
          avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`,
          questionsSolved: 0,
          isHost: true,
        },
      ],
    };

    emitRoom(roomCode);
  });

  // ---------------- CHECK ROOM ----------------
  socket.on("check_room", (roomCode) => {
    const room = roomInfo[roomCode];
    socket.emit(
      "room_preview",
      room
        ? {
            exists: true,
            host: room.players.find(p => p.isHost)?.username,
            topic: room.topic,
            count: room.players.length,
          }
        : { exists: false }
    );
  });

  // ---------------- JOIN ROOM ----------------
  socket.on("join_room", ({ roomCode, username }) => {
    const room = roomInfo[roomCode];
    if (!room || room.players.length >= room.maxPlayers) return;

    if (!room.players.find(p => p.username === username)) {
      room.players.push({
        id: socket.id,
        username,
        ready: false,
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`,
        questionsSolved: 0,
        isHost: false,
      });
    }

    socket.join(roomCode);
    emitRoom(roomCode);
  });

  // ---------------- RECONNECT ----------------
  socket.on("reconnect_room", ({ roomCode, username }) => {
    const room = roomInfo[roomCode];
    if (!room) return;

    const player = room.players.find(p => p.username === username);
    if (!player) return;

    player.id = socket.id;
    socket.join(roomCode);
    emitRoom(roomCode);
  });

  // ---------------- READY ----------------
  socket.on("toggle_ready", ({ roomCode, username }) => {
    const room = roomInfo[roomCode];
    if (!room) return;

    const player = room.players.find(p => p.username === username);
    if (!player) return;

    player.ready = !player.ready;
    emitRoom(roomCode);
    checkAutoStart(roomCode);
  });

  // ---------------- HOST START MATCH ----------------
  socket.on("start_match", (roomCode) => {
    const room = roomInfo[roomCode];
    if (!room) return;

    const host = room.players.find(
      p => p.isHost && p.id === socket.id
    );
    if (!host) return;

    io.to(roomCode).emit("match_found", {
      roomCode,
      players: room.players,
    });
  });

  // ---------------- KICK PLAYER ----------------
  socket.on("kick_player", ({ roomCode, target }) => {
    const room = roomInfo[roomCode];
    if (!room) return;

    const host = room.players.find(
      p => p.isHost && p.id === socket.id
    );
    if (!host) return;

    const kicked = room.players.find(p => p.username === target);
    if (!kicked) return;

    io.to(kicked.id).emit("kicked");
    io.sockets.sockets.get(kicked.id)?.leave(roomCode);

    room.players = room.players.filter(p => p.username !== target);
    emitRoom(roomCode);
  });

  // ---------------- DISCONNECT ----------------
  socket.on("disconnect", () => {
    for (const code in roomInfo) {
      const room = roomInfo[code];
      const index = room.players.findIndex(p => p.id === socket.id);
      if (index === -1) continue;

      const wasHost = room.players[index].isHost;
      room.players.splice(index, 1);

      if (wasHost && room.players.length > 0) {
        room.players[0].isHost = true;
      }

      if (room.players.length === 0) {
        delete roomInfo[code];
        return;
      }

      emitRoom(code);
    }
  });

  // ---------------- HELPERS ----------------
  function emitRoom(roomCode) {
    io.to(roomCode).emit("room_data", roomInfo[roomCode]);
  }

  function checkAutoStart(roomCode) {
    const room = roomInfo[roomCode];
    if (
      room &&
      room.players.length >= 2 &&
      room.players.every(p => p.ready)
    ) {
      io.to(roomCode).emit("match_found", {
        roomCode,
        players: room.players,
      });
    }
  }
});

server.listen(3001, () => {
  console.log("🎓 SERVER RUNNING ON PORT 3001");
});
