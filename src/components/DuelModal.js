import React, { useState, useEffect } from 'react';

const DuelModal = ({ socket, username, setShow1v1Modal, setView, setRoomData }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchTopic, setSearchTopic] = useState('');

  useEffect(() => {
    if(!socket) return;

    // Listen for the "Match Found" signal
    const handleMatch = (data) => {
      console.log("MATCH FOUND!", data);
      setIsSearching(false);
      setShow1v1Modal(false);
      setRoomData(data);
      setView('game');
    };

    socket.on("match_found", handleMatch);
    return () => socket.off("match_found", handleMatch);
  }, [socket, setShow1v1Modal, setView, setRoomData]);

  const startMatchmaking = () => {
    if (!searchTopic.trim()) return;
    setIsSearching(true);
    socket.emit("find_match", { username, topic: searchTopic });
  };

  const fontStyle = { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" };

  return (
    // Z-INDEX 100 ensures it is the TOPMOST layer
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-[fadeIn_0.3s_ease-out]" style={fontStyle}>
        
        {/* MODAL CARD (Increased size to max-w-xl) */}
        <div className="relative bg-[#0f0f0f] border border-white/10 p-14 rounded-[2.5rem] w-full max-w-xl text-center shadow-[0_0_60px_rgba(220,38,38,0.2)] overflow-hidden">
           
           {/* Background Glow (Dark Red) */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-red-900/20 blur-[100px] rounded-full pointer-events-none"></div>

           {!isSearching ? (
               <div className="relative z-10">
                 {/* HEADER */}
                 <h2 className="text-5xl font-bold text-white mb-3 tracking-tight">
                   Enter <span className="text-red-600">Arena</span>
                 </h2>
                 <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em] mb-12">
                   Prepare for 1v1 Combat
                 </p>

                 {/* INPUT FIELD (Dark Red Theme) */}
                 <div className="text-left mb-10">
                    <label className="text-red-600 text-[10px] font-bold uppercase tracking-widest ml-1">Duel Topic</label>
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border-2 border-white/10 rounded-xl p-5 text-white mt-2 focus:border-red-600 focus:bg-white/10 outline-none transition-all placeholder:text-gray-600 font-bold text-xl"
                      placeholder="Maths, Python" 
                      value={searchTopic} 
                      onChange={(e) => setSearchTopic(e.target.value)} 
                      autoFocus 
                      onKeyDown={(e) => e.key === 'Enter' && startMatchmaking()}
                    />
                 </div>

                 {/* BUTTONS */}
                 <div className="flex gap-4 mt-8">
                   <button 
                     onClick={() => setShow1v1Modal(false)} 
                     className="flex-1 py-5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all uppercase text-xs tracking-widest font-bold"
                   >
                     Cancel
                   </button>
                   <button 
                     onClick={startMatchmaking} 
                     className="flex-1 py-5 rounded-xl bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-red-600 hover:text-white hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all transform hover:scale-105"
                   >
                     Find Match
                   </button>
                 </div>
               </div>
           ) : (
               // SEARCHING STATE (Dark Red Theme)
               <div className="py-10 flex flex-col items-center relative z-10">
                  <div className="relative mb-10">
                      <div className="w-24 h-24 border-4 border-white/10 border-t-red-600 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl animate-pulse">⚡</span>
                      </div>
                  </div>
                  
                  <h3 className="animate-pulse font-bold text-xl tracking-[0.2em] uppercase text-white mb-2">
                    Scanning <span className="text-red-600">Void</span>
                  </h3>
                  <p className="text-gray-500 text-xs tracking-widest uppercase font-bold">
                    Target: {searchTopic}
                  </p>

                  <button 
                    onClick={() => setIsSearching(false)} 
                    className="mt-16 text-[10px] text-gray-600 hover:text-red-600 uppercase tracking-widest transition-colors font-bold border-b border-transparent hover:border-red-600 pb-1"
                  >
                    Abort Search
                  </button>
               </div>
           )}
        </div>
    </div>
  );
};

export default DuelModal;