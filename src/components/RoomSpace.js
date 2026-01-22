import React, { useEffect } from 'react';

// --- ICONS ---
const IconCopy = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" /></svg>;
const IconArrowRight = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>;
const IconArrowLeft = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>;

const RoomSpace = ({ 
  roomCode, 
  topic, 
  inputType, 
  username, 
  onJoin,
  onExit 
}) => {
  
  const fontStyle = { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" };
  const avatarUrl = `https://api.dicebear.com/9.x/initials/svg?seed=${username}&backgroundColor=b6e3f4`;

  // --- NEW: Handle Enter Key Press ---
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        onJoin();
      }
    };

    // Attach listener to window
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup listener when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onJoin]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center animate-[slideUp_0.8s_cubic-bezier(0.16,1,0.3,1)]" style={fontStyle}>
      
      {/* EXIT BUTTON - Top Left */}
      <div className="w-full max-w-lg flex items-center justify-start mb-8">
        <button 
          onClick={onExit}
          style={fontStyle} 
          className="group flex items-center gap-3 text-purple-500 hover:text-purple-400 transition-colors duration-300 px-2 py-2"
        >
          <div className="transform group-hover:-translate-x-1 transition-transform duration-300">
            <IconArrowLeft />
          </div>
          <span className="text-sm font-bold tracking-[0.2em] uppercase">
            Exit Room
          </span>
        </button>
      </div>

      {/* MAIN GLASS CARD */}
      <div className="w-full max-w-lg relative bg-black/40 border border-white/5 rounded-3xl p-12 overflow-hidden backdrop-blur-md shadow-2xl">
        
        {/* Purple Glow Background */}
        <div className="absolute top-[-50%] left-[-50%] w-[150%] h-[150%] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center space-y-10">
          
          {/* 1. ROOM CODE SECTION */}
          <div className="space-y-4 w-full">
            <p className="text-gray-500 text-xs font-bold tracking-[0.3em] uppercase">Room Entry Code</p>
            
            {/* The Code Display Container */}
            <div 
              className="group flex items-center justify-center gap-4 cursor-pointer" 
              onClick={() => navigator.clipboard.writeText(roomCode)}
              title="Click to copy"
            >
              {/* Digits */}
              {roomCode.split('').map((digit, i) => (
                <div 
                  key={i} 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl font-bold transition-all duration-300 border bg-white/5 border-white/10 backdrop-blur-sm text-white shadow-lg group-hover:scale-110 group-hover:bg-purple-600/10 group-hover:border-purple-500/30 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                >
                  {digit}
                </div>
              ))}
              
              {/* Copy Icon */}
              <div className="ml-2 p-3 rounded-full bg-white/5 text-purple-500 opacity-60 group-hover:opacity-100 group-hover:bg-purple-600/10 group-hover:scale-110 transition-all duration-300 backdrop-blur-sm border border-white/10">
                <IconCopy />
              </div>
            </div>

            {/* 2. TITLE / ATTACHED FILE INDICATOR */}
            <div className="pt-2">
               <h3 className="text-xl font-medium text-purple-200 tracking-wide">
                 {inputType === 'topic' ? (
                   <span>"{topic || 'Unknown Topic'}"</span>
                 ) : (
                   <span className="flex items-center justify-center gap-2">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                     Attached File
                   </span>
                 )}
               </h3>
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

          {/* 3. HOST INFO SECTION */}
          <div className="flex flex-col items-center space-y-3">
             <div className="relative">
                <img 
                  src={avatarUrl} 
                  alt="Host" 
                  className="w-20 h-20 rounded-full border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                />
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-black rounded-full" title="Online"></div>
             </div>
             <div>
                <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-1">Host</p>
                <p className="text-white text-lg font-bold tracking-wide">{username}</p>
             </div>
          </div>

          {/* 4. JOIN BUTTON */}
          <button 
            onClick={onJoin}
            className="w-full group relative overflow-hidden bg-white text-black font-bold uppercase tracking-[0.2em] py-4 rounded-xl hover:bg-purple-500 hover:text-white transition-all duration-500 shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              Join Room
              <div className="group-hover:translate-x-1 transition-transform duration-300">
                <IconArrowRight />
              </div>
            </span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default RoomSpace;