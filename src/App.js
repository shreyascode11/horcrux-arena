import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

// --- CONNECT TO SERVER ---
const socket = io.connect("http://localhost:3001");

// --- ICONS ---
const IconSword = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const IconUsers = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const IconScroll = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const IconUpload = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>;
const IconMagic = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>;
const IconCopy = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const IconClose = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

function App() {
  const [view, setView] = useState('login'); 
  const [username, setUsername] = useState('');
  const [stars, setStars] = useState({ small: '', medium: '', big: '' });

  // Game Data
  const [difficulty, setDifficulty] = useState('Moderate');
  const [inputType, setInputType] = useState('topic');
  const [topic, setTopic] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [roomPlayers, setRoomPlayers] = useState([]);
  
  // File Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // 1v1 Modal State
  const [show1v1Modal, setShow1v1Modal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTopic, setSearchTopic] = useState('');

  useEffect(() => {
    // Star Generator
    const generateStars = (count) => {
      let result = "";
      for (let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * 2000);
        const y = Math.floor(Math.random() * 2000);
        result += `${x}px ${y}px #FFF, `;
      }
      return result.slice(0, -2);
    };
    setStars({ small: generateStars(700), medium: generateStars(200), big: generateStars(100) });

    socket.on("room_data", (data) => {
      setRoomPlayers(data.players);
      setView('lobby'); 
    });
  }, []);

  // --- ACTIONS ---
  const handleLogin = () => { if (username.trim()) setView('menu'); };

  // 1v1 Logic
  const open1v1Setup = () => { setShow1v1Modal(true); };

  const startMatchmaking = () => {
    if (!searchTopic) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setShow1v1Modal(false);
      setView('game'); // <--- THIS STARTS THE GAME
    }, 2500);
  };

  const createRoom = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setRoomCode(code);
    socket.emit("create_room", { 
      username, 
      roomCode: code, 
      config: { topic, difficulty, file: selectedFile ? selectedFile.name : null } 
    });
  };

  const joinRoom = () => {
    if (joinCode.length === 4) {
      setRoomCode(joinCode);
      socket.emit("join_room", { username, roomCode: joinCode });
    } else {
      alert("Please enter a valid 4-digit code!");
    }
  };

  // Upload Logic
  const handleFileClick = () => { fileInputRef.current.click(); };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) setSelectedFile(file);
  };

  // --- THE FIX: Start Game Logic ---
  const startGame = () => {
    setView('game');
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-y-auto font-body text-white">
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom,_#2e0235_0%,_#0d0115_40%,_#000000_100%)] -z-20"></div>
      <div className="fixed inset-0 animate-[floatUp_50s_linear_infinite] -z-10" style={{ boxShadow: stars.small, width: '1px', height: '1px', opacity: 0.4 }}></div>

      <div className="z-10 w-full max-w-4xl p-4 flex flex-col items-center my-10">

        {/* --- 1v1 SETUP MODAL --- */}
        {show1v1Modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
            <div className="glass-panel p-8 rounded-2xl w-full max-w-md relative border border-blue-500/50 shadow-[0_0_40px_rgba(59,130,246,0.3)]">
              {!isSearching && (
                <button onClick={() => setShow1v1Modal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><IconClose /></button>
              )}

              {isSearching ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                  <h3 className="text-2xl font-bold animate-pulse">Scanning the Void...</h3>
                  <p className="text-gray-400 mt-2">Looking for opponents interested in <span className="text-blue-400">{searchTopic}</span></p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400"><IconSword /></div>
                  <h3 className="text-2xl font-magic mb-2">Prepare for Duel</h3>
                  <p className="text-gray-400 text-sm mb-6">Choose your battlefield.</p>
                  
                  <input type="text" placeholder="Enter Topic (e.g. React, History)" className="w-full p-4 rounded-xl text-center text-lg bg-black/50 border border-blue-500 text-white placeholder-gray-500 focus:outline-none focus:border-blue-300 transition-all mb-6" value={searchTopic} onChange={(e) => setSearchTopic(e.target.value)} autoFocus />
                  
                  <button onClick={startMatchmaking} disabled={!searchTopic} className={`w-full py-4 rounded-xl text-lg font-bold tracking-wider transition-all ${searchTopic ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}>FIND MATCH</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 1. LOGIN */}
        {view === 'login' && (
          <div className="glass-panel p-10 rounded-2xl max-w-md w-full text-center flex flex-col gap-6 animate-[fadeIn_1s_ease-out]">
            <div>
              <h1 className="text-5xl font-magic text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-2">Horcrux</h1>
              <p className="text-purple-200 text-xs tracking-[0.3em] uppercase opacity-70">The Ultimate Wizarding Quiz</p>
            </div>
            <input type="text" placeholder="Enter Wizard Name" className="w-full p-4 rounded-xl text-center text-lg bg-black/50 border border-purple-500 text-white placeholder-gray-400 focus:outline-none focus:border-purple-300 transition-all" value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
            <button onClick={handleLogin} className="glow-btn text-white font-bold py-4 rounded-xl text-lg tracking-wider">Enter Dashboard</button>
          </div>
        )}

        {/* 2. DASHBOARD */}
        {view === 'menu' && (
          <div className="w-full animate-[fadeIn_0.5s_ease-out]">
            <div className="flex justify-between items-center mb-8 px-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 border-2 border-white/20 flex items-center justify-center font-magic text-xl">{username.charAt(0).toUpperCase()}</div>
                <div className="text-left"><h3 className="text-lg font-bold">{username}</h3><p className="text-xs text-purple-300">Level 1 Apprentice</p></div>
              </div>
              <button onClick={() => setView('login')} className="text-xs text-red-400 hover:text-red-300">Logout</button>
            </div>

            {/* Quick Join */}
            <div className="glass-panel p-6 rounded-2xl mb-8 flex flex-col md:flex-row items-center gap-4 border-l-4 border-yellow-500">
              <h3 className="font-bold text-lg whitespace-nowrap">Join via Code:</h3>
              <input type="text" placeholder="Ex: 4821" className="w-full md:w-40 p-3 rounded-lg bg-black/50 border border-gray-600 text-center text-white tracking-widest" maxLength={4} value={joinCode} onChange={(e) => setJoinCode(e.target.value)} />
              <button onClick={joinRoom} className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors w-full md:w-auto">JOIN</button>
            </div>

            {/* Main Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div onClick={open1v1Setup} className="glass-panel p-8 rounded-2xl hover:scale-105 transition-all cursor-pointer group flex flex-col items-center gap-4 border-t-4 border-blue-500">
                <div className="p-4 rounded-full bg-blue-500/20 text-blue-300 group-hover:bg-blue-500 group-hover:text-white"><IconSword /></div><h3 className="text-2xl font-magic">1 vs 1 Duel</h3><p className="text-sm text-gray-400 text-center">Random Matchmaking</p>
              </div>
              
              <div onClick={() => setView('host')} className="glass-panel p-8 rounded-2xl hover:scale-105 transition-all cursor-pointer group flex flex-col items-center gap-4 border-t-4 border-purple-500">
                <div className="p-4 rounded-full bg-purple-500/20 text-purple-300 group-hover:bg-purple-500 group-hover:text-white"><IconUsers /></div><h3 className="text-2xl font-magic">Squad Battle</h3><p className="text-sm text-gray-400 text-center">Create a Private Room</p>
              </div>

               <div className="glass-panel p-8 rounded-2xl hover:scale-105 transition-all cursor-pointer group flex flex-col items-center gap-4 border-t-4 border-green-500">
                <div className="p-4 rounded-full bg-green-500/20 text-green-300 group-hover:bg-green-500 group-hover:text-white"><IconScroll /></div><h3 className="text-2xl font-magic">Grimoire</h3><p className="text-sm text-gray-400 text-center">View match history.</p>
              </div>
            </div>
          </div>
        )}

        {/* 3. HOST INTERFACE */}
        {view === 'host' && (
          <div className="glass-panel p-8 rounded-2xl w-full max-w-2xl animate-[fadeIn_0.5s_ease-out] relative">
            <button onClick={() => setView('menu')} className="absolute top-6 left-6 text-sm text-gray-400 hover:text-white">← Back</button>
            <h2 className="text-3xl font-magic text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">Configure Your Arena</h2>
            
            <div className="flex gap-4 mb-8 justify-center">
              <button onClick={() => setInputType('topic')} className={`px-6 py-3 rounded-xl border transition-all ${inputType === 'topic' ? 'bg-purple-600 border-purple-400 text-white' : 'bg-transparent border-gray-600 text-gray-400'}`}>Generated by AI</button>
              <button onClick={() => setInputType('file')} className={`px-6 py-3 rounded-xl border transition-all ${inputType === 'file' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-transparent border-gray-600 text-gray-400'}`}>Upload File (AI)</button>
            </div>

            <div className="mb-8 min-h-[120px] flex flex-col justify-center">
              {inputType === 'topic' ? (
                <div className="relative">
                  <div className="absolute left-4 top-4 text-purple-400"><IconMagic /></div>
                  <input type="text" placeholder="e.g. Ancient Runes, Python Basics..." className="w-full p-4 pl-12 rounded-xl text-lg bg-black/50 border border-purple-500 text-white placeholder-gray-400 focus:outline-none focus:border-purple-300 transition-all" value={topic} onChange={(e) => setTopic(e.target.value)} />
                </div>
              ) : (
                <div onClick={handleFileClick} className="border-2 border-dashed border-gray-600 hover:border-blue-400 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-black/20 hover:bg-black/40">
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept=".pdf,.doc,.docx,.txt" />
                  <IconUpload />
                  {selectedFile ? (
                     <span className="mt-2 text-green-400 font-bold">{selectedFile.name}</span>
                  ) : (
                     <>
                       <span className="mt-2 text-gray-300">Drag & Drop PDF or Click to Upload</span>
                       <span className="text-xs text-gray-500 mt-1">AI will read your document and quiz you.</span>
                     </>
                  )}
                </div>
              )}
            </div>
            
            <div className="mb-10">
              <p className="text-sm text-gray-400 mb-3 text-center uppercase tracking-widest">Select Difficulty</p>
              <div className="grid grid-cols-3 gap-4">
                {['Easy', 'Moderate', 'Hard'].map((level) => (
                  <button key={level} onClick={() => setDifficulty(level)} className={`py-3 rounded-lg border transition-all font-bold ${difficulty === level ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'bg-transparent border-gray-700 text-gray-500 hover:border-gray-500'}`}>{level}</button>
                ))}
              </div>
            </div>
            <button onClick={createRoom} className="w-full glow-btn py-4 rounded-xl text-xl font-bold tracking-widest uppercase">Summon Room</button>
          </div>
        )}

        {/* 4. WAITING LOBBY */}
        {view === 'lobby' && (
          <div className="glass-panel p-8 rounded-2xl w-full max-w-lg text-center animate-[fadeIn_0.5s_ease-out]">
            <h2 className="text-2xl font-magic text-purple-300 mb-2">Chamber of Secrets</h2>
            <p className="text-gray-400 text-sm mb-6">Waiting for wizards to join...</p>

            <div className="bg-black/40 border border-purple-500/50 p-6 rounded-xl mb-8 relative group cursor-pointer hover:border-purple-400 transition-all" onClick={() => alert('Code Copied!')}>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Room Portkey</p>
              <div className="text-4xl font-mono font-bold tracking-wider text-white flex justify-center items-center gap-3">{roomCode}<IconCopy /></div>
            </div>

            <div className="flex gap-4 justify-center mb-10 flex-wrap">
              {roomPlayers.map((player, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-purple-600 border-2 border-purple-300 flex items-center justify-center text-2xl animate-pulse">🧙‍♂️</div>
                  <span className="text-sm font-bold">{player}</span>
                </div>
              ))}
              {roomPlayers.length < 2 && (
                 <div className="flex flex-col items-center gap-2 opacity-50">
                  <div className="w-16 h-16 rounded-full bg-white/5 border-2 border-dashed border-gray-600 flex items-center justify-center text-2xl">?</div>
                  <span className="text-sm text-gray-500">Waiting...</span>
                </div>
              )}
            </div>

            <div className="flex gap-4">
               <button onClick={() => setView('menu')} className="flex-1 py-4 rounded-xl border border-red-500/50 text-red-400 hover:bg-red-500/10 font-bold">Exit</button>
              
              {/* --- HERE IS THE START BUTTON --- */}
              <button onClick={startGame} className="flex-[2] glow-btn py-4 rounded-xl text-lg font-bold">Start Duel</button>
            </div>
          </div>
        )}

        {/* 5. GAME SCREEN */}
        {view === 'game' && (
          <div className="glass-panel p-6 md:p-10 rounded-2xl w-full max-w-3xl animate-[fadeIn_0.5s_ease-out] relative">
            <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
              <div className="text-xl font-bold text-purple-300">Round 1/10</div>
              <div className="px-4 py-2 bg-red-900/50 rounded-lg text-red-200 font-mono font-bold border border-red-500/50 animate-pulse">
                ⏳ 14s
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-magic text-center mb-10 leading-relaxed">
              "Which spell is used to disarm an opponent in a duel?"
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {['A) Avada Kedavra', 'B) Expelliarmus', 'C) Lumos', 'D) Wingardium Leviosa'].map((opt) => (
                <button key={opt} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-purple-600 hover:border-purple-400 transition-all text-left text-lg font-bold">
                  {opt}
                </button>
              ))}
            </div>
            <div className="flex justify-between items-center text-sm text-gray-400">
               <span>P1: {username} (0 pts)</span>
               <span>Opponent: ??? (0 pts)</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;