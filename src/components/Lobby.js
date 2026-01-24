import React, { useEffect, useState } from "react";
import { getRank } from "../components/rank-system";

// ---------------- ICONS ----------------
const CopyIcon = () => (
  <span className="text-sm text-purple-400 hover:text-purple-300 cursor-pointer">
    Copy
  </span>
);

// ---------------- MAIN COMPONENT ----------------
export default function Lobby({
  socket,
  username,
  topic,
  roomCode,
  capacity = 5,
  setView,
}) {
  const [participants, setParticipants] = useState([]);

  // ---- SOCKET SYNC ----
  useEffect(() => {
    if (!socket) return;

    socket.emit("reconnect_room", { roomCode, username });

    const onRoomData = (data) => {
      setParticipants(data.players || []);
    };

    const onMatchFound = () => {
      setView("game");
    };

    const onKicked = () => {
      alert("You were kicked from the room");
      setParticipants([]);
      setView("menu");
    };

    socket.on("room_data", onRoomData);
    socket.on("match_found", onMatchFound);
    socket.on("kicked", onKicked);

    return () => {
      socket.off("room_data", onRoomData);
      socket.off("match_found", onMatchFound);
      socket.off("kicked", onKicked);
    };
  }, [socket, roomCode, username, setView]);

  if (!socket) return null;

  const readyCount = participants.filter(p => p.ready).length;
  const me = participants.find(p => p.username === username);
  const isHost = me?.isHost;

  const toggleReady = () => {
    socket.emit("toggle_ready", { roomCode, username });
  };

  const kickPlayer = (target) => {
    socket.emit("kick_player", { roomCode, target });
  };

  const startMatch = () => {
    socket.emit("start_match", roomCode);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
  };

  // ---------------- UI ----------------
  return (
    <div className="relative w-full h-screen text-white overflow-hidden bg-transparent">

      {/* RETURN BUTTON */}
      <button
        onClick={() => setView("roomspace")}
        className="absolute top-6 left-6 text-sm uppercase tracking-widest text-gray-400 hover:text-white transition"
      >
        ← Return
      </button>

      {/* HOST + SUBJECT */}
      <div className="absolute top-20 left-10 space-y-2">
        <p className="text-xs tracking-widest uppercase text-gray-400">Host</p>
        <h1 className="text-4xl font-extrabold">
          {participants.find(p => p.isHost)?.username || "—"}
        </h1>

        <p className="text-xs tracking-widest uppercase text-gray-400 mt-4">
          Subject
        </p>
        <h2 className="text-2xl font-semibold text-purple-400">
          {topic || "—"}
        </h2>
      </div>

      {/* ROOM CODE */}
      <div className="absolute top-20 right-10 text-right">
        <p className="text-xs tracking-widest uppercase text-gray-400">
          Room Code
        </p>
        <div className="flex items-center gap-3 justify-end">
          <span className="text-3xl font-bold">{roomCode}</span>
          <span onClick={copyCode}>
            <CopyIcon />
          </span>
        </div>
      </div>

      {/* CENTER STATUS */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="text-sm text-gray-400 tracking-widest uppercase">
          Lobby Status
        </p>
        <p className="text-lg font-semibold">
          {readyCount}/{participants.length} players ready
        </p>
      </div>

      {/* PARTICIPANTS */}
      <div className="absolute bottom-32 left-10 w-[420px]">
        <p className="text-sm uppercase tracking-widest text-gray-400 mb-4">
          Participants ({participants.length}/{capacity})
        </p>

        <div className="space-y-4">
          {participants.map(p => (
            <div
              key={p.username}
              className={`flex items-center justify-between p-4 rounded-xl border
              ${p.ready
                ? "border-green-500 bg-green-500/10"
                : "border-white/10 bg-white/5"}
              `}
            >
              <div className="flex items-center gap-4">
                <img
                  src={p.avatar}
                  alt="avatar"
                  className="w-12 h-12 rounded-full border border-white/10 bg-black"
                />
                <div>
                  <p className="font-semibold">
                    {p.username} {p.isHost && "👑"}
                  </p>
                  <p className="text-xs text-gray-400">
                    Rank: {getRank(p.questionsSolved || 0)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {p.username === username && (
                  <button
                    onClick={toggleReady}
                    className={`px-4 py-2 rounded-lg text-xs uppercase tracking-widest
                    ${p.ready
                      ? "bg-green-500 text-black"
                      : "bg-white/10 hover:bg-white/20"}
                    `}
                  >
                    {p.ready ? "Ready" : "Not Ready"}
                  </button>
                )}

                {isHost && !p.isHost && (
                  <button
                    onClick={() => kickPlayer(p.username)}
                    className="px-3 py-2 text-xs rounded-lg bg-red-600 hover:bg-red-500"
                  >
                    Kick
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* START BUTTON (HOST CAN START ANYTIME) */}
      {isHost && (
        <button
          onClick={startMatch}
          className="absolute bottom-10 right-10 px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-widest
          bg-purple-600 hover:bg-purple-500 shadow-lg"
        >
          Start Match
        </button>
      )}
    </div>
  );
}
