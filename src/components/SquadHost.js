import React, { useState, useEffect } from 'react';

// --- ICONS ---
const IconArrowRight = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>;
const IconArrowLeft = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>;
const IconUpload = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>;
const IconMagic = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg>;

const SquadHost = ({ 
  setView, 
  inputType, 
  setInputType, 
  topic, 
  setTopic, 
  handleFileClick, 
  handleFileChange, 
  selectedFile, 
  fileInputRef, 
  createRoom 
}) => {
  
  const [playerCount, setPlayerCount] = useState(5);
  const playerOptions = [5, 10, 20, 50];
  
  // Define Helvetica Font Style
  const fontStyle = { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" };

  // --- NEW: Handle Enter Key Press ---
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if Enter is pressed
      if (event.key === 'Enter') {
        // Prevent default behavior if needed (though not strictly necessary here)
        event.preventDefault(); 
        createRoom();
      }
    };

    // Add event listener to the window
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [createRoom]); // Depend on createRoom so it uses the latest version of the function

  return (
    <div className="w-full h-full flex flex-col items-center justify-center animate-[slideUp_0.8s_cubic-bezier(0.16,1,0.3,1)]" style={fontStyle}>
      
      {/* HEADER WITH RETURN BUTTON */}
      <div className="w-full max-w-3xl flex items-center justify-start mb-8">
        <button 
          onClick={() => setView('menu')}
          style={fontStyle} 
          className="group flex items-center gap-3 text-purple-500 hover:text-purple-400 transition-colors duration-300 px-2 py-2"
        >
          {/* Arrow on the LEFT, moves LEFT on hover */}
          <div className="transform group-hover:-translate-x-1 transition-transform duration-300">
            <IconArrowLeft />
          </div>
          <span className="text-sm font-bold tracking-[0.2em] uppercase">
            Return
          </span>
        </button>
      </div>

      {/* MAIN CARD */}
      <div className="w-full max-w-3xl relative bg-black/40 border border-white/5 rounded-3xl p-12 overflow-hidden backdrop-blur-sm">
        
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 space-y-12">
          
          {/* CARD HEADER */}
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-white mb-4">
              Create <span className="text-purple-500">Room</span>
            </h2>
            <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-lg mx-auto">
              Configure the parameters for your squad. Invite allies to join the void.
            </p>
          </div>

          {/* WIZARD CAPACITY */}
          <div className="space-y-6 text-center">
            <label className="text-gray-500 font-thin tracking-[0.3em] text-xs uppercase block">Select Wizard Capacity</label>
            <div className="flex gap-4 justify-center">
              {playerOptions.map((num) => (
                <button
                  key={num}
                  onClick={() => setPlayerCount(num)}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold transition-all duration-300 border
                    ${playerCount === num 
                      ? 'bg-purple-600/20 border-purple-500 text-purple-100 shadow-[0_0_30px_rgba(168,85,247,0.3)] scale-110' 
                      : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300 hover:bg-white/10 hover:border-white/10'
                    }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* INPUT TABS */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-8 border-b border-white/5 pb-4">
              <button 
                onClick={() => setInputType('topic')} 
                className={`flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300 pb-2 relative
                  ${inputType === 'topic' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
              >
                <IconMagic />
                Summon AI
                {inputType === 'topic' && <span className="absolute bottom-[-17px] left-0 w-full h-0.5 bg-purple-500 shadow-[0_0_10px_#a855f7]"></span>}
              </button>

              <button 
                onClick={() => setInputType('file')} 
                className={`flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300 pb-2 relative
                  ${inputType === 'file' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
              >
                <IconUpload />
                Upload Files
                {inputType === 'file' && <span className="absolute bottom-[-17px] left-0 w-full h-0.5 bg-purple-500 shadow-[0_0_10px_#a855f7]"></span>}
              </button>
            </div>

            {/* DYNAMIC INPUT AREA */}
            <div className="min-h-[100px]">
              {inputType === 'topic' ? (
                <div className="animate-[fadeIn_0.5s_ease-out]">
                  <div className="relative group">
                    <input 
                      type="text" 
                      value={topic} 
                      onChange={(e) => setTopic(e.target.value)} 
                      placeholder="e.g. Science, History, Coding" 
                      className="w-full bg-transparent border-b border-white/10 py-4 text-2xl text-white placeholder-gray-700 focus:outline-none focus:border-purple-500 transition-colors font-light tracking-wide text-center"
                    />
                    <div className="absolute right-0 top-4 text-purple-500/50 animate-pulse">✨</div>
                  </div>
                  <p className="mt-2 text-xs text-gray-600 uppercase tracking-wider font-medium text-center">
                    The AI will conjure questions automatically
                  </p>
                </div>
              ) : (
                <div 
                  onClick={handleFileClick}
                  className="animate-[fadeIn_0.5s_ease-out] w-full h-32 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-purple-500/50 transition-all duration-300 group"
                >
                  <p className="text-gray-400 font-medium group-hover:text-purple-300 transition-colors uppercase tracking-widest text-xs mb-2">
                    {selectedFile ? "File Selected" : "Click to Upload Scroll"}
                  </p>
                  <p className="text-white text-lg font-bold">
                    {selectedFile ? selectedFile.name : "PDF / DOCX"}
                  </p>
                  <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                </div>
              )}
            </div>
          </div>

          {/* GENERATE BUTTON */}
          <button 
            onClick={createRoom}
            className="w-full group relative overflow-hidden bg-white text-black font-bold uppercase tracking-[0.2em] py-5 rounded-xl hover:bg-purple-500 hover:text-white transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              Create A Room
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

export default SquadHost;