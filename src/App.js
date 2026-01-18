import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

// --- CONNECT TO SERVER ---
const socket = io.connect("http://localhost:3001");

// --- ICONS ---
// (Kept for internal game use, removed from login)
const IconSnitch = () => (
  <svg className="w-12 h-12 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" opacity=".4"/>
    <path d="M12 6a6 6 0 1 0 6 6 6 6 0 0 0-6-6z"/>
    <path d="M22 12h-2a8 8 0 0 0-8-8V2a10 10 0 0 1 10 10z" className="animate-pulse"/> 
    <path d="M2 12h2a8 8 0 0 1 8-8V2A10 10 0 0 0 2 12z" className="animate-pulse"/>
  </svg>
);

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

  const joinRoom = () => {
    if (joinCode.length === 4) { setRoomCode(joinCode); socket.emit("join_room", { username, roomCode: joinCode }); } 
    else { alert("Please enter a valid 4-digit code!"); }
  };

  const handleFileClick = () => { fileInputRef.current.click(); };
  const handleFileChange = (e) => { if (e.target.files[0]) setSelectedFile(e.target.files[0]); };

  return (
    <div className="relative w-full min-h-screen overflow-hidden font-body text-white bg-black">
      
      {/* --- HERO BACKGROUND EFFECT --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* 1. Deep Void Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0b2e] via-black to-[#0f0518]"></div>
        
        {/* 2. Moving 'Light Shafts' */}
        <div className="absolute inset-0 opacity-40 mix-blend-screen animate-pulse">
             <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg_at_50%_50%,_transparent_0deg,_#ff0055_20deg,_transparent_60deg)] animate-[spin_8s_linear_infinite] blur-[100px]"></div>
        </div>

        {/* 3. Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>


      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center p-4">

        {/* 1. HERO LOGIN */}
        {view === 'login' && (
          <div className="flex flex-col items-center justify-center w-full max-w-4xl animate-[fadeIn_1.5s_ease-out]">
            
            {/* Logo Area (Clean, No Snitch) */}
            <div className="mb-12 relative group">
                <div className="w-40 h-40 rounded-full border border-white/10 flex items-center justify-center bg-black/30 backdrop-blur-md shadow-[0_0_50px_rgba(255,0,85,0.2)] group-hover:shadow-[0_0_80px_rgba(255,0,85,0.5)] transition-all duration-700">
                     <span className="text-gray-500 font-magic text-sm tracking-widest">LOGO</span>
                </div>
            </div>

            {/* Main Title */}
            <h1 className="text-6xl md:text-8xl font-magic text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 tracking-tighter mb-4 drop-shadow-2xl">
              HORCRUX
            </h1>
            <p className="text-pink-200/60 text-sm md:text-base tracking-[0.5em] uppercase mb-20 font-light">
              Enter the Arena
            </p>

            {/* Input & Button */}
            <div className="w-full max-w-md relative flex flex-col items-center">
                <input 
                  type="text" 
                  className="w-full bg-transparent border-b-2 border-white/20 text-center text-4xl md:text-5xl py-4 font-magic text-white placeholder-white/10 focus:outline-none focus:border-pink-500 transition-all duration-500"
                  placeholder="Your Name"
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  autoFocus
                />
                
                {/* ENTER Button */}
                <div className={`mt-12 transition-all duration-700 ${username ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <button 
                        onClick={handleLogin}
                        className="group relative px-16 py-4 bg-transparent overflow-hidden rounded-full border border-pink-500/50 hover:border-pink-500 transition-all"
                    >
                        <div className="absolute inset-0 w-full h-full bg-pink-500/20 group-hover:bg-pink-500/40 transition-all blur-xl"></div>
                        <span className="relative text-xl font-bold tracking-[0.2em] uppercase">ENTER</span>
                    </button>
                </div>
            </div>

          </div>
        )}

        {/* 2. DASHBOARD (Menu) */}
        {view === 'menu' && (
          <div className="w-full max-w-5xl animate-[slideUp_0.8s_cubic-bezier(0.16,1,0.3,1)]">
             <div className="flex justify-between items-center mb-12">
                <div>
                   <h2 className="text-4xl font-magic">Welcome, {username}</h2>
                   <p className="text-gray-400">Ready your wand.</p>
                </div>
                <button onClick={() => setView('login')} className="text-red-400 hover:text-white transition-colors">Logout</button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div onClick={open1v1Setup} className="group relative h-80 bg-white/5 border border-white/10 rounded-3xl p-8 cursor-pointer overflow-hidden hover:border-blue-500/50 transition-all duration-500">
                    <div className="absolute inset-0 bg-blue-500/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <IconSword />
                    <h3 className="text-3xl font-magic mt-4 mb-2">1 vs 1 Duel</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Match with a random wizard based on your topic of choice.</p>
                 </div>

                 <div onClick={() => setView('host')} className="group relative h-80 bg-white/5 border border-white/10 rounded-3xl p-8 cursor-pointer overflow-hidden hover:border-purple-500/50 transition-all duration-500">
                    <div className="absolute inset-0 bg-purple-500/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <IconUsers />
                    <h3 className="text-3xl font-magic mt-4 mb-2">Squad Battle</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Create a private room. Invite friends via code. Battle together.</p>
                 </div>

                 <div className="group relative h-80 bg-white/5 border border-white/10 rounded-3xl p-8 cursor-pointer overflow-hidden hover:border-green-500/50 transition-all duration-500">
                    <div className="absolute inset-0 bg-green-500/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <IconScroll />
                    <h3 className="text-3xl font-magic mt-4 mb-2">Grimoire</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Check your past battle history and performance stats.</p>
                 </div>
             </div>
          </div>
        )}

        {/* 3. HOST CONFIGURATION */}
        {view === 'host' && (
           <div className="w-full max-w-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-12 rounded-3xl animate-[fadeIn_0.5s_ease-out]">
              <button onClick={() => setView('menu')} className="mb-8 text-gray-500 hover:text-white">← Back</button>
              <h2 className="text-4xl font-magic mb-8 text-center">Summon a Room</h2>
              
              <div className="flex gap-4 mb-8">
                  <button onClick={() => setInputType('topic')} className={`flex-1 py-4 rounded-xl border transition-all ${inputType === 'topic' ? 'bg-purple-600 border-purple-400 text-white' : 'border-white/10 text-gray-500'}`}>Topic</button>
                  <button onClick={() => setInputType('file')} className={`flex-1 py-4 rounded-xl border transition-all ${inputType === 'file' ? 'bg-blue-600 border-blue-400 text-white' : 'border-white/10 text-gray-500'}`}>Upload PDF</button>
              </div>

              <div className="mb-8">
                 {inputType === 'topic' ? (
                   <input type="text" placeholder="e.g. Dark Arts, ReactJS..." className="w-full bg-black/50 border border-white/20 p-4 rounded-xl text-white focus:border-purple-500 outline-none" value={topic} onChange={(e) => setTopic(e.target.value)} />
                 ) : (
                   <div onClick={handleFileClick} className="border-2 border-dashed border-white/20 hover:border-blue-400 rounded-xl p-8 text-center cursor-pointer transition-all">
                      <IconUpload />
                      <p className="mt-2 text-sm text-gray-400">{selectedFile ? selectedFile.name : "Click to Upload Document"}</p>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept=".pdf,.doc,.docx" />
                   </div>
                 )}
              </div>
              
              <button onClick={createRoom} className="w-full py-4 bg-white text-black font-bold rounded-xl hover:scale-[1.02] transition-transform">CREATE ROOM</button>
           </div>
        )}

        {/* 4. GAME LOBBY */}
        {view === 'lobby' && (
           <div className="text-center animate-[fadeIn_0.5s]">
              <h2 className="text-5xl font-magic mb-2">Room {roomCode}</h2>
              <p className="text-gray-400 mb-12">Waiting for challengers...</p>
              <div className="flex justify-center gap-8 mb-12">
                 {roomPlayers.map((p, i) => (
                    <div key={i} className="flex flex-col items-center gap-4">
                       <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-3xl border-4 border-black shadow-[0_0_20px_rgba(147,51,234,0.5)]">🧙‍♂️</div>
                       <span className="font-bold">{p}</span>
                    </div>
                 ))}
                 {roomPlayers.length < 2 && <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-600">?</div>}
              </div>
              <button onClick={() => setView('game')} className="px-12 py-4 bg-pink-600 rounded-full font-bold hover:bg-pink-500 transition-all shadow-[0_0_30px_rgba(219,39,119,0.4)]">START DUEL</button>
           </div>
        )}
        
        {/* 5. GAME SCREEN (Placeholder) */}
        {view === 'game' && <div className="text-4xl font-magic animate-pulse">Battle In Progress...</div>}

        {/* 1v1 Modal */}
        {show1v1Modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
             <div className="bg-black border border-white/20 p-8 rounded-2xl w-full max-w-md text-center">
                {!isSearching ? (
                   <>
                     <h3 className="text-2xl font-magic mb-6">Enter Topic</h3>
                     <input type="text" className="w-full bg-white/5 border border-white/20 p-4 rounded-xl text-center mb-6 text-white focus:border-blue-500 outline-none" value={searchTopic} onChange={(e) => setSearchTopic(e.target.value)} autoFocus />
                     <div className="flex gap-4">
                        <button onClick={() => setShow1v1Modal(false)} className="flex-1 py-3 text-gray-500 hover:text-white">Cancel</button>
                        <button onClick={startMatchmaking} className="flex-1 py-3 bg-blue-600 rounded-xl font-bold">Find</button>
                     </div>
                   </>
                ) : (
                   <div className="py-12">
                      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                      <p className="animate-pulse">Searching the void...</p>
                   </div>
                )}
             </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;