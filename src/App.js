import React, { useState, useEffect } from "react";
import io from "socket.io-client";

// CORE COMPONENTS
import Background from "./components/background";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import SquadHost from "./components/SquadHost";
import DuelModal from "./components/DuelModal";
import GameArena from "./components/GameArena";
import Lobby from "./components/Lobby";

// NEW PAGES
import Grimoire from "./components/Grimoire";
import AIAnalysis from "./components/AIAnalysis";
import RankOverview from "./components/RankOverview"; // ✅ IMPORTED

// UI / FEATURES
import Sidebar from "./components/Sidebar";
import JoinRoom from "./components/JoinRoom";

// SOCKET CONNECTION
const socket = io("http://localhost:3001", {
  transports: ["websocket"],
});

function App() {
  const [view, setView] = useState("login");

  const [username, setUsername] = useState(
    () => localStorage.getItem("wizardName") || ""
  );

  const [avatarSeed, setAvatarSeed] = useState("felix");

  const [questionsSolved, setQuestionsSolved] = useState(
    () => parseInt(localStorage.getItem("wizardScore")) || 0
  );

  // ROOM STATE
  const [roomCode, setRoomCode] = useState("");
  const [roomPlayers, setRoomPlayers] = useState([]);
  const [roomData, setRoomData] = useState(null);

  // HOST CONFIG
  const [difficulty, setDifficulty] = useState("Moderate");
  const [inputType, setInputType] = useState("topic");
  const [topic, setTopic] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [show1v1Modal, setShow1v1Modal] = useState(false);

  // THEME MANAGEMENT
  const getTheme = () => {
    switch (view) {
      case "login": return "red";
      case "menu": return "blue";
      case "host":
      case "join": return "purple";
      case "lobby": return "red";
      case "game": return "green";
      case "career": return "blue";
      case "history": return "yellow";
      case "rank": return "yellow"; // Rank Theme
      default: return "red";
    }
  };

  useEffect(() => {
    localStorage.setItem("wizardName", username);
    localStorage.setItem("wizardScore", questionsSolved);
  }, [username, questionsSolved]);

  // ================= SOCKET LISTENERS =================
  useEffect(() => {
    socket.on("room_data", (data) => {
      setRoomCode(data.roomCode);
      setRoomPlayers(data.players);
      setView("lobby");
    });

    socket.on("match_found", (data) => {
      setRoomData(data);
      setView("game");
    });

    socket.on("kicked", () => {
      alert("You were kicked by the host");
      setRoomCode("");
      setRoomPlayers([]);
      setRoomData(null);
      setView("menu");
    });

    return () => {
      socket.off("room_data");
      socket.off("match_found");
      socket.off("kicked");
    };
  }, []);

  // ================= ACTIONS =================
  const handleLogin = () => {
    if (username.trim()) {
      setAvatarSeed(username);
      setView("menu");
    }
  };

  const handleLogout = () => {
    setUsername("");
    setRoomCode("");
    setRoomPlayers([]);
    setRoomData(null);
    setView("login");
  };

  const createRoom = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setRoomCode(code);

    socket.emit("create_room", {
      username,
      roomCode: code,
      config: { topic, difficulty, file: selectedFile?.name },
    });

    setView("lobby");
  };

  const handleGameEnd = (score) => {
    setQuestionsSolved((prev) => prev + score);
  };

  const open1v1Setup = () => {
    setShow1v1Modal(true);
  };

  // ================= RENDER =================
  return (
    <div className="relative w-full min-h-screen bg-black text-white overflow-hidden">
      <Background theme={getTheme()} />

      {/* ✅ FIX 1: Sidebar ONLY on Dashboard ('menu') */}
      {/* ✅ FIX 3 & 4: Passed setUsername and view props */}
      {view === "menu" && (
        <Sidebar
          username={username}
          setUsername={setUsername} 
          avatarSeed={avatarSeed}
          setAvatarSeed={setAvatarSeed}
          setView={setView}
          view={view}
          onLogout={handleLogout}
        />
      )}

      <div className="relative z-10 w-full min-h-screen flex items-center justify-center p-6">
        
        {view === "login" && (
          <Login
            username={username}
            setUsername={setUsername}
            handleLogin={handleLogin}
          />
        )}

        {view === "menu" && (
          <Dashboard
            username={username}
            setView={setView}
            questionsSolved={questionsSolved}
            open1v1Setup={open1v1Setup}
          />
        )}

        {view === "join" && (
          <JoinRoom
            socket={socket}
            username={username}
            setRoomCode={setRoomCode}
            setView={setView}
          />
        )}

        {view === "host" && (
          <SquadHost
            setView={setView}
            inputType={inputType}
            setInputType={setInputType}
            topic={topic}
            setTopic={setTopic}
            createRoom={createRoom}
          />
        )}

        {view === "lobby" && (
          <Lobby
            socket={socket}
            username={username}
            topic={topic}
            roomCode={roomCode}
            roomPlayers={roomPlayers}
            setView={setView}
          />
        )}

        {view === "game" && (
          <GameArena
            socket={socket}
            roomData={roomData}
            username={username}
            setView={setView}
            onGameEnd={handleGameEnd}
          />
        )}

        {/* --- PAGES --- */}
        
        {view === "career" && (
          <AIAnalysis 
            setView={setView} 
          />
        )}

        {view === "history" && (
          <Grimoire 
            setView={setView} 
            username={username} 
          />
        )}

        {/* ✅ FIX 2: Added RankOverview Rendering */}
        {view === "rank" && (
           <RankOverview
            setView={setView}
            questionsSolved={questionsSolved}
          />
        )}

      </div>

      {show1v1Modal && (
        <DuelModal
          socket={socket}
          username={username}
          setRoomData={setRoomData}
          setView={setView}
          setShow1v1Modal={setShow1v1Modal}
        />
      )}
    </div>
  );
}

export default App;