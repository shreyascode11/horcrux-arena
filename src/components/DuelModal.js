import React, { useState, useEffect } from 'react';

const DuelModal = ({ socket, username, setShow1v1Modal, setView, setRoomData }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchTopic, setSearchTopic] = useState('');

  useEffect(() => {
    if(!socket) return;

    // Listen for the "Match Found" signal
    const handleMatch = (data) => {
      console.log("MATCH FOUND!", data); // Debug Log
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

  return (
    // Z-INDEX 100 ensures it is the TOPMOST layer
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]">
       <div className="bg-black/80 border border-white/10 p-12 rounded-2xl w-full max-w-md text-center shadow-[0_0_50px_rgba(255,0,0,0.2)]">
          {!isSearching ? (
             <>
               <h3 className="text-xl font-bold mb-10 tracking-[0.2em] uppercase text-gray-400">Duel Topic</h3>
               <input 
                 type="text" 
                 className="w-full bg-transparent border-b border-white/20 p-4 text-center mb-12 text-white focus:border-red-500 outline-none font-thin text-2xl" 
                 placeholder="e.g. Spells" 
                 value={searchTopic} 
                 onChange={(e) => setSearchTopic(e.target.value)} 
                 autoFocus 
                 onKeyDown={(e) => e.key === 'Enter' && startMatchmaking()}
               />
               <div className="flex gap-4">
                  <button onClick={() => setShow1v1Modal(false)} className="flex-1 py-4 text-gray-600 hover:text-white font-bold text-xs uppercase tracking-widest border border-transparent hover:border-white/10 rounded-full">Cancel</button>
                  <button onClick={startMatchmaking} className="flex-1 py-4 bg-white text-black rounded-full font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Find Match</button>
               </div>
             </>
          ) : (
             <div className="py-12 flex flex-col items-center">
                <div className="w-16 h-16 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-8"></div>
                <h3 className="animate-pulse font-bold text-sm tracking-[0.3em] uppercase text-red-500 mb-2">Scanning Void</h3>
                <p className="text-gray-600 text-xs tracking-widest uppercase">Subject: {searchTopic}</p>
                <button onClick={() => setIsSearching(false)} className="mt-12 text-[10px] text-gray-700 hover:text-red-500 uppercase tracking-widest">Cancel</button>
             </div>
          )}
       </div>
    </div>
  );
};

export default DuelModal;