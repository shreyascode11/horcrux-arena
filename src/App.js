import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

// --- EXISTING IMPORTS ---
import Background from './components/background';
import Login from './components/Login';         
import Dashboard from './components/Dashboard'; 
import SquadHost from './components/SquadHost'; 
import DuelModal from './components/DuelModal'; 
import RoomSpace from './components/RoomSpace'; 

// HIS FEATURES
import Sidebar from "./components/Sidebar";
import RankOverview from "./components/RankOverview";
import History from "./components/History";
import AIAnalysis from "./components/AIAnalysis";
import GameArena from './components/GameArena';
import Grimoire from './components/Grimoire'; 

// --- JOIN ROOM ---
import JoinRoom from './components/JoinRoom'; 

// --- CONNECT TO SERVER ---
const socket = io.connect("http://localhost:3001");

function App() {
  // --- GLOBAL STATE ---
  const [view, setView] = useState('login'); 
  const [username, setUsername] = useState('');
  
  // --- AVATAR STATE ---
  const [avatarSeed, setAvatarSeed] = useState('felix'); 

  // --- PROGRESS TRACKING STATE ---
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
      case 'join':  return 'purple';
      case 'lobby': return 'green';
      case 'game':  return 'green';
      case 'grimoire': return 'purple';
      default:      return 'red';
    }
  };

  const handleGameEnd = (scoreFromGame) => {
    console.log("🏆 Game Finished! Adding score:", scoreFromGame);
    setQuestionsSolved(prev => prev + scoreFromGame);
  };

  useEffect(() => {
    const handleRoomData = (data) => {
      setRoomPlayers(data.players);
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

  const handleLogin = () => { 
    if (username.trim()) {
        setAvatarSeed(username);
        setView('menu'); 
    }
  };
  
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
    setView('roomspace'); 
  };

  const handleJoinLobby = () => setView('lobby');
  const handleFileClick = () => fileInputRef.current.click();
  const handleFileChange = (e) => { if (e.target.files[0]) setSelectedFile(e.target.files[0]); };

  return (
    <div className="relative w-full min-h-screen overflow-hidden text-white bg-black" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      
      <Background theme={getTheme()} />

      {/* --- SIDEBAR: ONLY SHOW IN DASHBOARD ('menu') --- */}
      {view === 'menu' && (
        <Sidebar 
          username={username} 
          setUsername={setUsername} 
          avatarSeed={avatarSeed}   
          setAvatarSeed={setAvatarSeed} 
          setView={setView} 
          onLogout={handleLogout} 
        />
      )}

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

        {view === 'join' && (
          <JoinRoom 
            socket={socket} 
            setView={setView} 
            username={username} 
          />
        )}

        {view === 'grimoire' && <Grimoire setView={setView} username={username} />}
        {view === 'rank' && <RankOverview questionsSolved={questionsSolved} setView={setView} />}
        {view === 'history' && <History />}
        
        {/* PASS setView HERE */}
        {view === 'analysis' && <AIAnalysis setView={setView} />}

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

        {view === 'lobby' && (
            <div className="text-center animate-[fadeIn_0.5s]">
              <h2 className="text-9xl font-bold mb-8 text-white">{roomCode}</h2>
              <div className="flex justify-center gap-6 mb-12">
                 {roomPlayers.map((p, i) => (
                    <span key={i} className="text-green-400 font-bold text-xl uppercase tracking-widest">{p}</span>
                 ))}
              </div>
              <p className="text-gray-400">Waiting for host to start...</p>
            </div>
        )}

        {view === 'game' && (
          <GameArena 
             socket={socket} 
             roomData={roomData} 
             username={username} 
             setView={setView} 
             onGameEnd={handleGameEnd} 
          />
        )}

      </div>

      {show1v1Modal && (
          <DuelModal socket={socket} username={username} setRoomData={setRoomData} setView={setView} setShow1v1Modal={setShow1v1Modal} />
      )}

    </div>
  );
}

export default App;