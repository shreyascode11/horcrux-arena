import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

// --- COMPONENTS ---
import Background from './components/background';
import Login from './components/Login';         
import Dashboard from './components/Dashboard'; 
import SquadHost from './components/SquadHost'; 
import DuelModal from './components/DuelModal'; 

// ✅ FIX: Importing the file we just created
import RoomSpace from './components/RoomSpace'; 

import Sidebar from "./components/Sidebar";
import RankOverview from "./components/RankOverview";
import History from "./components/History";
import AIAnalysis from "./components/AIAnalysis";
import GameArena from './components/GameArena';
import Grimoire from './components/Grimoire'; 

// --- CONNECT TO SERVER ---
const socket = io.connect("http://localhost:3001");

function App() {
  // --- GLOBAL STATE ---
  const [view, setView] = useState('login'); 
  const [username, setUsername] = useState('');
  
  // HIS STATE (Rank Progress)
  const [questionsSolved, setQuestionsSolved] = useState(69);

  // GAME & ROOM STATE
  const [roomData, setRoomData] = useState(null);
  const [difficulty, setDifficulty] = useState('Moderate');
  const [inputType, setInputType] = useState('topic');
  const [topic, setTopic] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [roomPlayers, setRoomPlayers] = useState([]);
  
  // FILE & MODALS
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [show1v1Modal, setShow1v1Modal] = useState(false);

  // --- THEME LOGIC ---
  const getTheme = () => {
    switch(view) {
      case 'login': return 'red';
      case 'menu':  return 'blue';
      case 'host':  return 'purple';
      case 'lobby': return 'green';
      case 'game':  return 'green';
      case 'grimoire': return 'purple'; 
      default:      return 'red';
    }
  };

  // --- SOCKET LISTENERS ---
  useEffect(() => {
    const handleRoomData = (data) => {
      setRoomPlayers(data.players);
      // Only go to lobby if we are NOT in the host/roomspace setup
      if (view !== 'roomspace' && view !== 'host') {
        setView('lobby'); 
      }
    };

    const handleMatchFound = (data) => {
      console.log("⚡ MATCH FOUND!", data);
      setRoomData(data); 
      setView('game');   
    };

    socket.on("room_data", handleRoomData);
    socket.on("match_found", handleMatchFound);

    return () => {
      socket.off("room_data", handleRoomData);
      socket.off("match_found", handleMatchFound);
    };
  }, [view]); 

  // --- HANDLERS ---
  const handleLogin = () => { if (username.trim()) setView('menu'); };
  
  const handleLogout = () => {
    setUsername('');
    setRoomData(null);
    setRoomPlayers([]);
    setView('login');
  };

  const open1v1Setup = () => { setShow1v1Modal(true); };
  
  const createRoom = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setRoomCode(code);
    
    socket.emit("create_room", { 
        username, 
        roomCode: code, 
        config: { topic, difficulty, file: selectedFile?.name } 
    });

    // Go to YOUR RoomSpace
    setView('roomspace'); 
  };

  const handleJoinLobby = () => setView('lobby');
  const handleFileClick = () => fileInputRef.current.click();
  const handleFileChange = (e) => { if (e.target.files[0]) setSelectedFile(e.target.files[0]); };

  return (
    <div className="relative w-full min-h-screen overflow-hidden text-white bg-black" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      
      {/* 1. BACKGROUND */}
      <Background theme={getTheme()} />

      {/* 2. SIDEBAR */}
      {view !== "login" && (
        <Sidebar
          username={username}
          setView={setView}
          onLogout={handleLogout}
        />
      )}

      {/* 3. MAIN CONTENT */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center p-6">
        
        {view === 'login' && (
          <Login username={username} setUsername={setUsername} handleLogin={handleLogin} />
        )}

        {view === 'menu' && (
          <Dashboard 
            username={username} 
            setView={setView} 
            open1v1Setup={open1v1Setup}
            questionsSolved={questionsSolved} 
          />
        )}

        {/* OTHER PAGES */}
        {view === 'grimoire' && <Grimoire setView={setView} username={username} />}
        {view === 'rank' && <RankOverview questionsSolved={questionsSolved} />}
        {view === 'history' && <History />}
        {view === 'analysis' && <AIAnalysis />}

        {/* HOST PAGE */}
        {view === 'host' && (
          <SquadHost 
            setView={setView} 
            inputType={inputType} setInputType={setInputType} 
            topic={topic} setTopic={setTopic}
            handleFileClick={handleFileClick} handleFileChange={handleFileChange} 
            selectedFile={selectedFile} fileInputRef={fileInputRef}
            createRoom={createRoom}
          />
        )}

        {/* ✅ ROOMSPACE PAGE (Now working) */}
        {view === 'roomspace' && (
          <RoomSpace 
            roomCode={roomCode}
            topic={topic}
            inputType={inputType} 
            username={username}
            onJoin={handleJoinLobby}
            onExit={() => setView('host')} 
          />
        )}

        {/* LOBBY */}
        {view === 'lobby' && (
           <div className="text-center animate-[fadeIn_0.5s]">
              <h2 className="text-9xl font-bold mb-8 text-white">{roomCode}</h2>
              <div className="flex justify-center gap-6 mb-12">
                 {roomPlayers.map((p, i) => (
                    <span key={i} className="text-green-400 font-bold text-xl uppercase tracking-widest">{p}</span>
                 ))}
              </div>
              <button onClick={() => setView('game')} className="px-12 py-4 bg-green-600 text-black rounded-full font-bold hover:scale-105 transition-transform">START GAME</button>
           </div>
        )}

        {/* GAME ARENA */}
        {view === 'game' && (
           <GameArena 
             socket={socket} 
             roomData={roomData} 
             username={username} 
             setView={setView} 
           />
        )}

      </div>

      {/* MODAL LAYER */}
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