import React, { useEffect, useState } from "react";
import { getRank } from "../components/rank-system";

// ---------------- ICONS ----------------
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 cursor-pointer hover:text-red-400 transition-colors">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
  </svg>
);

const IconArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
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
    alert("Code copied to clipboard!"); // Optional feedback
  };

  const fontStyle = { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" };

  // ---------------- UI ----------------
  return (
    <div className="relative w-full h-screen text-white overflow-hidden bg-transparent animate-[fadeIn_0.5s]" style={fontStyle}>

      {/* --- RETURN BUTTON (Updated Style) --- */}
      <div className="absolute top-8 left-8">
        <button 
          onClick={() => setView("menu")}
          className="group flex items-center gap-3 text-red-500 hover:text-red-400 transition-colors px-2 py-2"
        >
          <div className="transform group-hover:-translate-x-1 transition-transform duration-300">
            <IconArrowLeft />
          </div>
          <span className="text-sm font-bold tracking-[0.2em] uppercase">Return</span>
        </button>
      </div>

      {/* HOST + SUBJECT */}
      <div className="absolute top-24 left-10 space-y-2">
        <p className="text-xs tracking-widest uppercase text-gray-500 font-bold">Host</p>
        <h1 className="text-5xl font-extrabold tracking-tight">
          {participants.find(p => p.isHost)?.username || "—"}
        </h1>

        <div className="mt-8">
            <p className="text-xs tracking-widest uppercase text-gray-500 font-bold mt-6 mb-1">
            Subject
            </p>
            <h2 className="text-3xl font-bold text-red-500">
            {topic || "—"}
            </h2>
        </div>
      </div>

      {/* ROOM CODE */}
      <div className="absolute top-24 right-10 text-right">
        <p className="text-xs tracking-widest uppercase text-gray-500 font-bold mb-2">
          Room Code
        </p>
        <div className="flex items-center gap-4 justify-end bg-[#0f0f0f] border border-white/10 px-6 py-4 rounded-2xl">
          <span className="text-4xl font-black tracking-widest text-white">{roomCode}</span>
          <div onClick={copyCode} className="text-gray-500 hover:text-white transition-colors p-2 bg-white/5 rounded-lg cursor-pointer">
            <CopyIcon />
          </div>
        </div>
      </div>

      {/* CENTER STATUS */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="w-24 h-24 border-4 border-white/10 border-t-red-600 rounded-full animate-spin mb-6 mx-auto"></div>
        <p className="text-sm text-gray-500 tracking-[0.2em] uppercase font-bold mb-2">
          Lobby Status
        </p>
        <p className="text-2xl font-bold text-white">
          <span className="text-red-500">{readyCount}</span> / {participants.length} Ready
        </p>
      </div>

      {/* PARTICIPANTS LIST */}
      <div className="absolute bottom-10 left-10 w-[450px]">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold mb-4">
          Participants ({participants.length}/{capacity})
        </p>

        <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
          {participants.map(p => (
            <div
              key={p.username}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all
              ${p.ready
                ? "border-red-500/50 bg-red-900/10 shadow-[0_0_15px_rgba(220,38,38,0.1)]"
                : "border-white/10 bg-[#0f0f0f]"}
              `}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                    <img
                    src={p.avatar}
                    alt="avatar"
                    className="w-10 h-10 rounded-full border border-white/10 bg-black object-cover"
                    />
                    {p.isHost && <span className="absolute -top-1 -right-1 text-xs">👑</span>}
                </div>
                <div>
                  <p className={`font-bold text-sm ${p.ready ? 'text-white' : 'text-gray-400'}`}>
                    {p.username}
                  </p>
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">
                    {getRank(p.questionsSolved || 0)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {p.username === username && (
                  <button
                    onClick={toggleReady}
                    className={`px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all
                    ${p.ready
                      ? "bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.4)]"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"}
                    `}
                  >
                    {p.ready ? "Ready" : "Not Ready"}
                  </button>
                )}

                {isHost && !p.isHost && (
                  <button
                    onClick={() => kickPlayer(p.username)}
                    className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg bg-white/5 text-gray-500 hover:bg-red-900/50 hover:text-red-500 transition-colors"
                  >
                    Kick
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* START BUTTON (HOST ONLY) */}
      {isHost && (
        <button
          onClick={startMatch}
          className="absolute bottom-10 right-10 px-10 py-5 rounded-2xl text-sm font-bold uppercase tracking-[0.2em]
          bg-white text-black hover:bg-red-600 hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(220,38,38,0.4)] transition-all transform hover:scale-105"
        >
          Start Match
        </button>
      )}
    </div>
  );
}