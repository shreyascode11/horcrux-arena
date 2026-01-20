import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

// --- IMPORT COMPONENTS ---
import GameArena from './components/GameArena';      // Your AI Game
import Background from './components/background';    // The Smart Background
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SquadHost from './components/SquadHost';      // Team's Squad Host
import DuelModal from './components/DuelModal';      // Your Connected Modal

// --- CONNECT TO SERVER ---
const socket = io.connect("http://localhost:3001");

function App() {
  // --- GLOBAL STATE ---
  const [view, setView] = useState('login'); 
  const [username, setUsername] = useState('');
  const [roomData, setRoomData] = useState(null);

  // --- DYNAMIC THEME LOGIC (Yours - Keep this!) ---
  const getTheme = () => {
    switch(view) {
      case 'login': return 'red';
      case 'menu':  return 'blue';
      case 'host':  return 'purple';
      case 'lobby': return 'green';
      case 'game':  return 'green';
      default:      return 'red';
    }
  };

  // Game Data
  const [difficulty, setDifficulty] = useState('Moderate');
  const [inputType, setInputType] = useState('topic');
  const [topic, setTopic] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [roomPlayers, setRoomPlayers] = useState([]);
  
  // File Upload & Modals
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [show1v1Modal, setShow1v1Modal] = useState(false);

  // --- SOCKET LISTENERS (Yours - The Real Backend) ---
  useEffect(() => {
    // 1. Existing listener for multiplayer lobbies
    socket.on("room_data", (data) => {
      setRoomPlayers(data.players);
      setView('lobby'); 
    });

    // 2. NEW LISTENER: Listen for the AI to finish thinking!
    socket.on("match_found", (data) => {
      console.log("⚡ MATCH FOUND! Questions received:", data.questions);
      setRoomData(data); // Save the AI questions
      setView('game');   // SWITCH VIEW ONLY NOW
    });

    // Cleanup listeners to prevent memory leaks
    return () => {
      socket.off("room_data");
      socket.off("match_found");
    };
  }, []);

  const handleLogin = () => { if (username.trim()) setView('menu'); };
  const open1v1Setup = () => { setShow1v1Modal(true); };
  
  const createRoom = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setRoomCode(code);
    socket.emit("create_room", { username, roomCode: code, config: { topic, difficulty, file: selectedFile?.name } });
  };

  const handleFileClick = () => { fileInputRef.current.click(); };
  const handleFileChange = (e) => { if (e.target.files[0]) setSelectedFile(e.target.files[0]); };

  return (
    <div className="relative w-full min-h-screen overflow-hidden text-white bg-black" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      
      {/* 1. BACKGROUND LAYER (Using your smart theme prop) */}
      <Background theme={getTheme()} />

      {/* 2. MAIN CONTENT LAYER */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center p-6">
        
        {view === 'login' && (
          <Login username={username} setUsername={setUsername} handleLogin={handleLogin} />
        )}

        {view === 'menu' && (
          <Dashboard username={username} setView={setView} open1v1Setup={open1v1Setup} />
        )}

        {/* SQUAD HOST (Team's Feature - fully integrated) */}
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

        {/* LOBBY (Yours is better - has animations & player list) */}
        {view === 'lobby' && (
           <div className="text-center animate-[fadeIn_0.5s]">
              <p className="text-green-500 font-bold tracking-[0.3em] uppercase mb-6 text-xs">Access Code Generated</p>
              <h2 className="text-9xl font-bold mb-8 text-white">{roomCode}</h2>
              <div className="flex justify-center gap-12 mb-20">
                 {roomPlayers.map((p, i) => (
                    <div key={i} className="flex flex-col items-center gap-4">
                       <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-3xl border border-white/20 shadow-[0_0_20px_rgba(34,197,94,0.2)]">🧙‍♂️</div>
                       <span className="font-bold text-sm tracking-widest uppercase text-green-400">{p}</span>
                    </div>
                 ))}
              </div>
              <button onClick={() => setView('game')} className="px-12 py-4 bg-green-600 text-black rounded-full font-bold hover:scale-105 transition-all shadow-[0_0_40px_rgba(34,197,94,0.4)]">ENTER MATRIX</button>
           </div>
        )}

        {/* GAME ARENA (Yours - actually plays the game) */}
        {view === 'game' && (
           <GameArena 
             socket={socket} 
             roomData={roomData} 
             username={username} 
             setView={setView} 
           />
        )}

      </div>

      {/* 3. MODAL LAYER (Using your Smart Modal) */}
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