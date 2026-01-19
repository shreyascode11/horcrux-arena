import React from 'react';

const DuelModal = ({ isSearching, searchTopic, setSearchTopic, setShow1v1Modal, startMatchmaking }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
       <div className="bg-black/80 border border-white/10 p-12 rounded-2xl w-full max-w-md text-center shadow-2xl">
          {!isSearching ? (
             <>
               <h3 className="text-xl font-bold mb-10 tracking-[0.2em] uppercase text-gray-400">Duel Topic</h3>
               <input type="text" className="w-full bg-transparent border-b border-white/20 p-4 text-center mb-12 text-white focus:border-pink-500 outline-none font-thin text-2xl" placeholder="e.g. History" value={searchTopic} onChange={(e) => setSearchTopic(e.target.value)} autoFocus />
               <div className="flex gap-4">
                  <button onClick={() => setShow1v1Modal(false)} className="flex-1 py-4 text-gray-600 hover:text-white font-bold text-xs uppercase tracking-widest border border-transparent hover:border-white/10 rounded-full">Cancel</button>
                  <button onClick={startMatchmaking} className="flex-1 py-4 bg-white text-black rounded-full font-bold text-xs uppercase tracking-widest hover:bg-pink-200 transition-colors">Find Match</button>
               </div>
             </>
          ) : (
             <div className="py-12">
                <div className="w-16 h-16 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
                <p className="animate-pulse font-bold text-xs tracking-[0.3em] uppercase text-pink-500">Scanning Void...</p>
             </div>
          )}
       </div>
    </div>
  );
};

export default DuelModal;