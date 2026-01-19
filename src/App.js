import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

// --- IMPORT COMPONENTS (THE TEAM) ---
import Background from './components/background';
import Login from './components/Login';         // Person 1
import Dashboard from './components/Dashboard'; // Main Menu
import SquadHost from './components/SquadHost'; // Person 3
import DuelModal from './components/DuelModal'; // Person 2

// --- CONNECT TO SERVER ---
const socket = io.connect("http://localhost:3001");

function App() {
  // --- GLOBAL STATE ---
  const [view, setView] = useState('login'); 
  const [username, setUsername] = useState('');
  
  // Game Data
  const [difficulty, setDifficulty] = useState('Moderate');
  const [inputType, setInputType] = useState('topic');
  const [topic, setTopic] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [roomPlayers, setRoomPlayers] = useState([]);
  
  // File Upload & Modals
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [show1v1Modal, setShow1v1Modal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTopic, setSearchTopic] = useState('');

  // --- LOGIC ---
  useEffect(() => {
    socket.on("room_data", (data) => {
      setRoomPlayers(data.players);
      setView('lobby'); 
    });
  }, []);

  const handleLogin = () => { if (username.trim()) setView('menu'); };
  const open1v1Setup = () => { setShow1v1Modal(true); };
  
  const startMatchmaking = () => {
    if (!searchTopic) return;
    setIsSearching(true);
    setTimeout(() => { setIsSearching(false); setShow1v1Modal(false); setView('game'); }, 2500);
  };

  const createRoom = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setRoomCode(code);
    socket.emit("create_room", { username, roomCode: code, config: { topic, difficulty, file: selectedFile?.name } });
  };

  const handleFileClick = () => { fileInputRef.current.click(); };
  const handleFileChange = (e) => { if (e.target.files[0]) setSelectedFile(e.target.files[0]); };

  return (
    <div className="relative w-full min-h-screen overflow-hidden text-white bg-black" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      
      {/* SHARED BACKGROUND */}
      <Background />

      {/* CONTENT LAYER */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center p-6">
        
        {/* VIEW: LOGIN (Person 1) */}
        {view === 'login' && (
          <Login username={username} setUsername={setUsername} handleLogin={handleLogin} />
        )}

        {/* VIEW: DASHBOARD (Menu) */}
        {view === 'menu' && (
          <Dashboard username={username} setView={setView} open1v1Setup={open1v1Setup} />
        )}

        {/* VIEW: SQUAD HOST (Person 3) */}
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

        {/* VIEW: LOBBY (Simplified for now) */}
        {view === 'lobby' && (
           <div className="text-center">
              <h2 className="text-8xl font-bold mb-8">{roomCode}</h2>
              <button onClick={() => setView('game')} className="px-12 py-4 bg-pink-600 rounded-full font-bold">START</button>
           </div>
        )}

        {/* MODAL: 1v1 (Person 2) */}
        {show1v1Modal && (
          <DuelModal 
            isSearching={isSearching} 
            searchTopic={searchTopic} setSearchTopic={setSearchTopic} 
            setShow1v1Modal={setShow1v1Modal} 
            startMatchmaking={startMatchmaking} 
          />
        )}

      </div>
    </div>
  );
}

export default App;