import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

// --- CONNECT TO SERVER ---
const socket = io.connect("http://localhost:3001");

// --- ICONS ---
const IconArrowRight = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>;
const IconSword = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const IconUsers = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const IconScroll = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const IconUpload = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>;

function App() {
  const [view, setView] = useState('login'); 
  const [username, setUsername] = useState('');
  
  // --- UPDATED SHINE LOGIC ---
  const maxScanLength = 12; 
  const progress = Math.min(username.length / maxScanLength, 1);
  // Start at 100% (Left), move to 0% (Right)
  const bgPosX = `${100 - (progress * 100)}%`;

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
    // ENFORCING HELVETICA GLOBALLY
    <div className="relative w-full min-h-screen overflow-hidden text-white bg-black" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      
      {/* --- HERO BACKGROUND EFFECT --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0b2e] via-black to-[#0f0518]"></div>
        <div className="absolute inset-0 opacity-50 mix-blend-screen animate-pulse">
             <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg_at_50%_50%,_transparent_0deg,_#ff0055_20deg,_transparent_60deg)] animate-[spin_8s_linear_infinite] blur-[100px]"></div>
        </div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>


      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center p-4">

        {/* 1. HERO LOGIN */}
        {view === 'login' && (
          <div className="flex flex-col items-center justify-center w-full max-w-4xl animate-[fadeIn_1.5s_ease-out]">
            
            {/* Logo Area */}
            <div className="mb-12 relative group">
                <div className="w-32 h-32 rounded-full border border-white/5 flex items-center justify-center bg-black/50 backdrop-blur-md shadow-[0_0_50px_rgba(255,255,255,0.05)]">
                     <span className="text-gray-600 font-thin text-xs tracking-[0.3em]">LOGO</span>
                </div>
            </div>

            {/* --- UPDATED TITLE (LAYERED FIX) --- */}
            <div className="relative mb-4">
                {/* LAYER 1: BASE GLASSY TEXT (Always bright and legible) */}
                <h1 className="text-7xl md:text-9xl font-bold tracking-tighter select-none
                               text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/10
                               drop-shadow-[0_0_15px_rgba(255,0,85,0.3)] relative z-10">
                  HORCRUX
                </h1>

                {/* LAYER 2: DYNAMIC SHINE OVERLAY (Sits on top, transparent edges) */}
                <h1 
                  aria-hidden="true" 
                  style={{ 
                    // Gradient ends are now transparent, so it doesn't dim the text beneath
                    backgroundImage: 'linear-gradient(to right, transparent 30%, #ff0055 45%, #ffffff 50%, #ff0055 55%, transparent 70%)',
                    backgroundSize: '200% auto',
                    backgroundPosition: `${bgPosX} center`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    transition: 'background-position 0.1s linear'
                  }}
                  className="absolute inset-0 text-7xl md:text-9xl font-bold tracking-tighter select-none pointer-events-none z-20 mix-blend-overlay brightness-150"
                >
                  HORCRUX
                </h1>
            </div>
            
            <p className="text-pink-200/50 text-sm md:text-base tracking-[0.8em] font-thin uppercase mb-24">
              Enter the Arena
            </p>

            {/* Input & Arrow Container */}
            <div className="w-full max-w-md relative flex items-center">
                
                <input 
                  type="text" 
                  className="w-full bg-transparent border-b border-white/10 text-center text-3xl md:text-4xl py-4 font-thin text-white placeholder-white/5 focus:outline-none focus:border-pink-500/50 transition-all duration-500 pr-10"
                  placeholder="Your Name"
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  autoFocus
                />
                
                <button 
                    onClick={handleLogin}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-pink-400 hover:scale-110 transition-all duration-500 
                                ${username ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}
                >
                    <IconArrowRight />
                </button>

            </div>

          </div>
        )}

        {/* 2. DASHBOARD (Menu) */}
        {view === 'menu' && (
          <div className="w-full max-w-5xl animate-[slideUp_0.8s_cubic-bezier(0.16,1,0.3,1)]">
             <div className="flex justify-between items-center mb-16 border-b border-white/10 pb-6">
                <div>
                   <h2 className="text-5xl font-bold mb-2">Welcome, {username}</h2>
                   <p className="text-gray-400 font-thin tracking-wide">Ready your wand.</p>
                </div>
                <button onClick={() => setView('login')} className="text-xs font-bold tracking-widest text-red-500 hover:text-white transition-colors uppercase">Logout</button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div onClick={open1v1Setup} className="group relative h-80 bg-white/5 border border-white/10 rounded-xl p-8 cursor-pointer overflow-hidden hover:bg-white/10 transition-all duration-500">
                    <IconSword />
                    <h3 className="text-2xl font-thin mt-6 mb-2 tracking-wide">1 vs 1 Duel</h3>
                    <div className="w-8 h-[1px] bg-white/20 mb-4"></div>
                    <p className="text-gray-500 text-sm font-light leading-relaxed">Match with a random wizard based on your topic of choice.</p>
                 </div>

                 <div onClick={() => setView('host')} className="group relative h-80 bg-white/5 border border-white/10 rounded-xl p-8 cursor-pointer overflow-hidden hover:bg-white/10 transition-all duration-500">
                    <IconUsers />
                    <h3 className="text-2xl font-thin mt-6 mb-2 tracking-wide">Squad Battle</h3>
                    <div className="w-8 h-[1px] bg-white/20 mb-4"></div>
                    <p className="text-gray-500 text-sm font-light leading-relaxed">Create a private room. Invite friends via code. Battle together.</p>
                 </div>

                 <div className="group relative h-80 bg-white/5 border border-white/10 rounded-xl p-8 cursor-pointer overflow-hidden hover:bg-white/10 transition-all duration-500">
                    <IconScroll />
                    <h3 className="text-2xl font-thin mt-6 mb-2 tracking-wide">Grimoire</h3>
                    <div className="w-8 h-[1px] bg-white/20 mb-4"></div>
                    <p className="text-gray-500 text-sm font-light leading-relaxed">Check your past battle history and performance stats.</p>
                 </div>
             </div>
          </div>
        )}

        {/* 3. HOST CONFIGURATION */}
        {view === 'host' && (
           <div className="w-full max-w-2xl bg-black/50 backdrop-blur-xl border border-white/10 p-12 rounded-xl animate-[fadeIn_0.5s_ease-out]">
              <button onClick={() => setView('menu')} className="mb-8 text-xs font-bold tracking-widest text-gray-500 hover:text-white uppercase">← Back</button>
              
              <h2 className="text-4xl font-bold mb-2">Summon a Room</h2>
              <p className="text-gray-500 font-thin mb-12">Configure your battle arena parameters.</p>
              
              <div className="flex gap-4 mb-8">
                  <button onClick={() => setInputType('topic')} className={`flex-1 py-4 rounded-lg border text-sm font-bold tracking-widest transition-all ${inputType === 'topic' ? 'bg-white text-black border-white' : 'border-white/10 text-gray-500'}`}>TOPIC</button>
                  <button onClick={() => setInputType('file')} className={`flex-1 py-4 rounded-lg border text-sm font-bold tracking-widest transition-all ${inputType === 'file' ? 'bg-white text-black border-white' : 'border-white/10 text-gray-500'}`}>UPLOAD PDF</button>
              </div>

              <div className="mb-12">
                 {inputType === 'topic' ? (
                   <input type="text" placeholder="e.g. Dark Arts, ReactJS..." className="w-full bg-transparent border-b border-white/20 p-4 text-xl font-thin text-white focus:border-pink-500 outline-none placeholder-gray-700" value={topic} onChange={(e) => setTopic(e.target.value)} />
                 ) : (
                   <div onClick={handleFileClick} className="border border-dashed border-white/20 hover:border-white/50 rounded-lg p-10 text-center cursor-pointer transition-all">
                      <div className="flex justify-center mb-2"><IconUpload /></div>
                      <p className="text-sm font-thin text-gray-400">{selectedFile ? selectedFile.name : "Click to Upload Document"}</p>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept=".pdf,.doc,.docx" />
                   </div>
                 )}
              </div>
              
              <button onClick={createRoom} className="w-full py-5 bg-white text-black font-bold tracking-[0.2em] rounded-lg hover:bg-pink-200 transition-colors uppercase">Create Room</button>
           </div>
        )}

        {/* 4. GAME LOBBY */}
        {view === 'lobby' && (
           <div className="text-center animate-[fadeIn_0.5s]">
              <p className="text-gray-500 font-bold tracking-widest uppercase mb-4">Room Code</p>
              <h2 className="text-8xl font-thin mb-12 tracking-tighter text-white">{roomCode}</h2>
              
              <p className="text-gray-400 font-thin mb-12">Waiting for challengers...</p>
              
              <div className="flex justify-center gap-8 mb-16">
                 {roomPlayers.map((p, i) => (
                    <div key={i} className="flex flex-col items-center gap-4">
                       <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-2xl border border-white/20">🧙‍♂️</div>
                       <span className="font-bold text-sm tracking-wide">{p}</span>
                    </div>
                 ))}
                 {roomPlayers.length < 2 && <div className="w-16 h-16 rounded-full border border-dashed border-white/20 flex items-center justify-center text-gray-600 font-thin">?</div>}
              </div>
              
              <button onClick={() => setView('game')} className="px-16 py-4 bg-pink-600 text-white rounded-full font-bold tracking-widest hover:bg-pink-500 hover:scale-105 transition-all shadow-[0_0_30px_rgba(219,39,119,0.3)]">START</button>
           </div>
        )}
        
        {/* 5. GAME SCREEN */}
        {view === 'game' && <div className="text-4xl font-thin animate-pulse tracking-widest">BATTLE IN PROGRESS...</div>}

        {/* 1v1 Modal */}
        {show1v1Modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
             <div className="bg-black border border-white/10 p-12 rounded-xl w-full max-w-md text-center">
                {!isSearching ? (
                   <>
                     <h3 className="text-2xl font-thin mb-8 tracking-wide">Enter Topic</h3>
                     <input type="text" className="w-full bg-transparent border-b border-white/20 p-4 text-center mb-10 text-white focus:border-pink-500 outline-none font-light text-xl" value={searchTopic} onChange={(e) => setSearchTopic(e.target.value)} autoFocus />
                     <div className="flex gap-4">
                        <button onClick={() => setShow1v1Modal(false)} className="flex-1 py-3 text-gray-500 hover:text-white font-bold text-xs uppercase tracking-widest">Cancel</button>
                        <button onClick={startMatchmaking} className="flex-1 py-3 bg-white text-black rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-pink-200 transition-colors">Find Match</button>
                     </div>
                   </>
                ) : (
                   <div className="py-12">
                      <div className="w-12 h-12 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
                      <p className="animate-pulse font-thin text-sm tracking-widest uppercase">Searching...</p>
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