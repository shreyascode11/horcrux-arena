import React, { useState, useEffect } from 'react';

// --- ICONS ---
const IconArrowLeft = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>;
const IconUsers = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>;

const JoinRoom = ({ socket, setView, username }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [roomPreview, setRoomPreview] = useState(null); 
  const [isChecking, setIsChecking] = useState(false);

  const fontStyle = { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" };

  // --- 1. LISTEN FOR SERVER RESPONSE ---
  useEffect(() => {
    if (!socket) return;

    const handlePreview = (data) => {
      console.log("📥 CLIENT RECEIVED PREVIEW:", data);
      setIsChecking(false);
      
      if (data.exists) {
        setRoomPreview(data); 
        setError('');
      } else {
        setRoomPreview(null);
        setError("ROOM DOESN'T EXIST");
      }
    };

    socket.on("room_preview", handlePreview);
    return () => socket.off("room_preview", handlePreview);
  }, [socket]);

  // --- 2. HANDLE ENTER KEY ---
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && roomPreview) handleJoin();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [roomPreview]);

  // --- 3. INPUT HANDLER ---
  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setCode(value);
    setRoomPreview(null);
    setError('');

    if (value.length === 4) {
      setIsChecking(true);
      console.log("📤 CLIENT SENDING CHECK FOR:", value);
      socket.emit("check_room", value); 
    }
  };

  const handleJoin = () => {
    if (roomPreview) {
      socket.emit("join_room", { roomCode: code, username });
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center animate-[slideUp_0.8s_cubic-bezier(0.16,1,0.3,1)]" style={fontStyle}>
      
      {/* RETURN BUTTON */}
      <div className="w-full max-w-2xl flex items-center justify-start mb-8">
        <button onClick={() => setView('menu')} className="group flex items-center gap-3 text-purple-500 hover:text-purple-400 transition-colors px-2 py-2">
          <div className="transform group-hover:-translate-x-1 transition-transform duration-300"><IconArrowLeft /></div>
          <span className="text-sm font-bold tracking-[0.2em] uppercase">Return</span>
        </button>
      </div>

      {/* GLASS CARD CONTAINER - Reduced padding (p-10) for smaller height */}
      <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] w-full max-w-2xl shadow-[0_0_80px_rgba(168,85,247,0.15)]">
        
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-900/20 blur-[100px] rounded-full pointer-events-none"></div>

        {/* TITLE */}
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-2 text-white tracking-tight">
          Join <span className="text-purple-500">Room</span>
        </h2>

        {/* NEW SENTENCE */}
        <p className="text-gray-500 text-sm font-bold tracking-[0.2em] uppercase text-center mb-8">
            Enter your room code
        </p>

        {/* INPUT BOX - Made smaller (py-5, text-3xl) */}
        <div className="relative mb-8 group max-w-lg mx-auto">
          <input
            type="text"
            value={code}
            onChange={handleInputChange}
            placeholder="ENTER CODE"
            maxLength={4}
            style={fontStyle}
            className="w-full bg-white/5 border-2 border-white/10 text-center text-3xl font-bold tracking-[0.3em] text-white py-5 rounded-xl focus:outline-none focus:border-purple-500 focus:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all placeholder:text-gray-700 placeholder:font-bold placeholder:tracking-[0.1em]"
          />
          {isChecking && (
             <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>

        {/* INFO / ERROR SECTION */}
        <div className="w-full min-h-[120px] flex items-center justify-center mb-4">
            {error && (
                <p className="text-red-500 font-bold tracking-widest animate-pulse border border-red-500/20 bg-red-500/5 px-6 py-3 rounded-xl text-sm">
                    ⚠️ {error}
                </p>
            )}

            {roomPreview && (
                <div className="w-full bg-purple-500/10 border border-purple-500/30 p-6 rounded-2xl animate-[slideUp_0.3s_ease-out]">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                           <p className="text-xs text-purple-300 uppercase tracking-widest font-bold mb-1">Topic</p>
                           <p className="text-xl font-bold text-white leading-tight">{roomPreview.topic}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-xs text-purple-300 uppercase tracking-widest font-bold mb-1">Active</p>
                           <div className="flex items-center justify-end gap-2 text-white font-bold text-xl">
                              <IconUsers /> {roomPreview.count}
                           </div>
                        </div>
                    </div>
                    <div className="w-full h-px bg-white/10 my-4"></div>
                    <p className="text-sm text-gray-400">Host: <span className="text-white font-bold">{roomPreview.host}</span></p>
                </div>
            )}
        </div>

        {/* JOIN BUTTON */}
        <button 
            onClick={handleJoin}
            disabled={!roomPreview}
            className={`w-full py-4 rounded-xl font-bold tracking-[0.2em] uppercase transition-all duration-300 text-lg
                ${roomPreview 
                    ? 'bg-white text-black hover:bg-purple-500 hover:text-white shadow-lg hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] cursor-pointer' 
                    : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                }
            `}
        >
            Join Room
        </button>

      </div>
    </div>
  );
};

export default JoinRoom;