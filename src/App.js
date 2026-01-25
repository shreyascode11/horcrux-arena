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
import Grimoire from "./components/Grimoire";
import AIAnalysis from "./components/AIAnalysis";
import RankOverview from "./components/RankOverview";

// UI / FEATURES
import Sidebar from "./components/Sidebar";
import JoinRoom from "./components/JoinRoom";

// SOCKET CONNECTION
const socket = io("http://localhost:3001", {
  transports: ["websocket"],
});

function App() {
  const [view, setView] = useState("login");

  // 1. Start with an empty name
  const [username, setUsername] = useState("");
  const [avatarSeed, setAvatarSeed] = useState("felix");

  // 2. Start Score at 0 (We will load the real score only after login)
  const [questionsSolved, setQuestionsSolved] = useState(0);

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
      case "rank": return "yellow";
      default: return "red";
    }
  };

  // =========================================================
  // 🧠 PROFILE MANAGEMENT SYSTEM (The Fix)
  // =========================================================
  
  // A. SAVE DATA: Whenever score changes, save it to the SPECIFIC USER'S profile
  useEffect(() => {
    if (view === "login" || !username) return; // Don't save while on login screen

    // 1. Save to the global keys (so components like Dashboard/Grimoire still work)
    localStorage.setItem("wizardScore", questionsSolved);
    
    // 2. Save to the USER-SPECIFIC profile (The Backup)
    const userProfile = {
      score: questionsSolved,
      // We grab the current history log to save it with this user
      history: JSON.parse(localStorage.getItem("wizardBattleLog") || "[]") 
    };
    
    localStorage.setItem(`profile_${username}`, JSON.stringify(userProfile));

  }, [questionsSolved, username, view]); // Runs whenever score updates


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
  
  // B. LOGIN: This is where we swap the data
  const handleLogin = () => {
    if (username.trim()) {
      setAvatarSeed(username);
      
      // Try to find a saved profile for this specific name
      const savedProfile = localStorage.getItem(`profile_${username}`);

      if (savedProfile) {
        // --- OLD USER FOUND ---
        const parsed = JSON.parse(savedProfile);
        
        // 1. Restore their Score
        setQuestionsSolved(parsed.score || 0);
        
        // 2. Restore their History (Inject it into the global slot so Grimoire sees it)
        localStorage.setItem("wizardBattleLog", JSON.stringify(parsed.history || []));
      } else {
        // --- NEW USER ---
        // 1. Reset Score to 0
        setQuestionsSolved(0);
        
        // 2. Wipe the History (Fresh Start)
        localStorage.setItem("wizardBattleLog", "[]");
      }

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
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
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