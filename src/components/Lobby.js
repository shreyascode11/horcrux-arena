import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRank } from "../components/rank-system";

// ---------------- ICONS ----------------
const CopyIcon = () => (
  <span className="text-sm text-purple-400 hover:text-purple-300 cursor-pointer">
    Copy
  </span>
);

// ---------------- MAIN COMPONENT ----------------
export default function Lobby({
  username,
  topic,
  roomCode,
  capacity = 5,
}) {
  const navigate = useNavigate();

  // ---- STATE ----
  const [participants, setParticipants] = useState([
    {
      id: 1,
      name: username,
      ready: false,
      questionsSolved: 120,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
      host: true,
    },
  ]);

  const readyCount = participants.filter(p => p.ready).length;

  const toggleReady = (id) => {
    setParticipants(prev =>
      prev.map(p =>
        p.id === id ? { ...p, ready: !p.ready } : p
      )
    );
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
  };

  const canStart = readyCount === participants.length;

  // ---------------- UI ----------------
  return (
    <div className="relative w-full h-screen text-white overflow-hidden bg-transparent">

      {/* RETURN BUTTON — FIXED */}
      <button
        onClick={() => navigate("/RoomSpace")}
        className="absolute top-6 left-6 text-sm uppercase tracking-widest text-gray-400 hover:text-white transition"
      >
        ← Return
      </button>

      {/* TOP LEFT INFO */}
      <div className="absolute top-20 left-10 space-y-2">
        <p className="text-xs tracking-widest uppercase text-gray-400">
          Host
        </p>
        <h1 className="text-4xl font-extrabold">
          {username}
        </h1>

        <p className="text-xs tracking-widest uppercase text-gray-400 mt-4">
          Subject
        </p>
        <h2 className="text-2xl font-semibold text-purple-400">
          {topic}
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center space-y-2">
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
              key={p.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all
              ${p.ready
                ? "border-green-500 bg-green-500/10"
                : "border-white/10 bg-white/5"}
              `}
            >
              <div className="flex items-center gap-4">
                <img
                  src={p.avatar}
                  alt="avatar"
                  className="w-12 h-12 rounded-full border border-white/10"
                />
                <div>
                  <p className="font-semibold">
                    {p.name} {p.host && "(Host)"}
                  </p>
                  <p className="text-xs text-gray-400">
                    Rank: {getRank(p.questionsSolved)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleReady(p.id)}
                className={`px-4 py-2 rounded-lg text-xs uppercase tracking-widest transition-all
                ${p.ready
                  ? "bg-green-500 text-black"
                  : "bg-white/10 hover:bg-white/20"}
                `}
              >
                {p.ready ? "Ready" : "Not Ready"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RULES PANEL */}
      <div className="absolute bottom-32 right-10 text-sm text-gray-300 space-y-2">
        <p className="uppercase tracking-widest text-xs text-gray-400">
          Match Rules
        </p>
        <p>• Subject-based questions</p>
        <p>• AI generated</p>
        <p>• Ranked rewards enabled</p>
      </div>

      {/* START BUTTON */}
      <button
        disabled={!canStart}
        className={`absolute bottom-10 right-10 px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all
        ${canStart
          ? "bg-purple-600 hover:bg-purple-500 animate-pulse"
          : "bg-gray-700 cursor-not-allowed"}
        `}
      >
        Start Match
      </button>
    </div>
  );
}
