import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

// CORE
import Background from "./components/background";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import SquadHost from "./components/SquadHost";
import DuelModal from "./components/DuelModal";
import GameArena from "./components/GameArena";

// UI / FEATURES
import Sidebar from "./components/Sidebar";
import RankOverview from "./components/RankOverview";
import History from "./components/History";
import AIAnalysis from "./components/AIAnalysis";
import Grimoire from "./components/Grimoire";
import JoinRoom from "./components/JoinRoom";
import Lobby from "./components/Lobby";

// SOCKET
const socket = io.connect("http://localhost:3001");

function App() {
  const [view, setView] = useState("login");
  const [username, setUsername] = useState("");

  // PROGRESS
  const [questionsSolved, setQuestionsSolved] = useState(69);

  // ROOM / GAME STATE
  const [roomCode, setRoomCode] = useState("");
  const [roomPlayers, setRoomPlayers] = useState([13]);
  const [roomData, setRoomData] = useState(null);

  // HOST CONFIG
  const [difficulty, setDifficulty] = useState("Moderate");
  const [inputType, setInputType] = useState("topic");
  const [topic, setTopic] = useState("");

  // FILE
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // MODALS
  const [show1v1Modal, setShow1v1Modal] = useState(false);

  // THEME
  const getTheme = () => {
    switch (view) {
      case "login":
        return "red";
      case "menu":
        return "blue";
      case "host":
        return "purple";
      case "join":
        return "purple";
      case "lobby":
        return "red";
      case "game":
        return "green";
      case "grimoire":
        return "purple";
      default:
        return "red";
    }
  };

  // SOCKET LISTENERS
  useEffect(() => {
    socket.on("room_data", (data) => {
      setRoomPlayers(data.players);
      setView("lobby");
    });

    socket.on("match_found", (data) => {
      setRoomData(data);
      setView("game");
    });

    return () => {
      socket.off("room_data");
      socket.off("match_found");
    };
  }, []);

  // AUTH
  const handleLogin = () => {
    if (username.trim()) setView("menu");
  };

  const handleLogout = () => {
    setUsername("");
    setRoomData(null);
    setRoomPlayers([]);
    setRoomCode("");
    setView("login");
  };

  // 1V1
  const open1v1Setup = () => setShow1v1Modal(true);

  // HOST ROOM
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

  // FILE
  const handleFileClick = () => fileInputRef.current.click();
  const handleFileChange = (e) => {
    if (e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  // GAME END
  const handleGameEnd = (score) => {
    setQuestionsSolved((prev) => prev + score);
  };

  return (
    <div
      className="relative w-full min-h-screen bg-black text-white overflow-hidden"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <Background theme={getTheme()} />

      {view !== "login" && (
        <Sidebar username={username} setView={setView} onLogout={handleLogout} />
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
            open1v1Setup={open1v1Setup}
            questionsSolved={questionsSolved}
          />
        )}

        {view === "join" && (
          <JoinRoom socket={socket} setView={setView} username={username} />
        )}

        {view === "host" && (
          <SquadHost
            setView={setView}
            inputType={inputType}
            setInputType={setInputType}
            topic={topic}
            setTopic={setTopic}
            handleFileClick={handleFileClick}
            handleFileChange={handleFileChange}
            selectedFile={selectedFile}
            fileInputRef={fileInputRef}
            createRoom={createRoom}
          />
        )}

        {view === "lobby" && (
          <Lobby
            socket={socket}
            roomCode={roomCode}
            username={username}
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

        {view === "grimoire" && <Grimoire setView={setView} />}
        {view === "rank" && <RankOverview questionsSolved={questionsSolved} />}
        {view === "history" && <History />}
        {view === "analysis" && <AIAnalysis />}
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
