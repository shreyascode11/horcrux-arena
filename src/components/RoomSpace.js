import React from 'react';

const RoomSpace = ({ roomCode, topic, inputType, username, onJoin, onExit }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen animate-[fadeIn_0.5s]">
      <div className="bg-[#0f0f0f] border border-white/10 p-12 rounded-3xl text-center max-w-2xl w-full shadow-2xl relative overflow-hidden">
        
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>

        <p className="text-gray-500 tracking-[0.3em] text-xs uppercase mb-4">Room Created</p>
        <h1 className="text-8xl font-black text-white mb-2 tracking-tighter">{roomCode}</h1>
        <p className="text-gray-400 text-sm mb-12">Share this code with your squad.</p>

        <div className="grid grid-cols-2 gap-4 text-left mb-12 bg-white/5 p-6 rounded-2xl border border-white/5">
           <div>
             <p className="text-[10px] uppercase text-gray-500 tracking-widest">Host</p>
             <p className="text-white font-bold">{username}</p>
           </div>
           <div>
             <p className="text-[10px] uppercase text-gray-500 tracking-widest">Topic</p>
             <p className="text-green-400 font-bold">{topic || "General Magic"}</p>
           </div>
        </div>

        <div className="flex gap-4">
           <button 
             onClick={onExit} 
             className="flex-1 py-4 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all font-bold uppercase text-xs tracking-widest"
           >
             Cancel
           </button>
           <button 
             onClick={onJoin} 
             className="flex-1 py-4 rounded-xl bg-green-600 text-black font-bold uppercase text-xs tracking-widest hover:scale-105 transition-transform shadow-lg"
           >
             Enter Lobby
           </button>
        </div>
      </div>
    </div>
  );
};

export default RoomSpace;