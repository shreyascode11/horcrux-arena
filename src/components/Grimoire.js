import React, { useState, useEffect } from 'react';

// --- ICON COMPONENT ---
const IconArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);

const Grimoire = ({ setView, username }) => {
  const [battleHistory, setBattleHistory] = useState([]);

  useEffect(() => {
    // Load History
    const savedHistory = localStorage.getItem('wizardBattleLog');
    if (savedHistory) {
      setBattleHistory(JSON.parse(savedHistory).reverse());
    }
  }, []);

  const fontStyle = { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" };

  return (
    <div className="min-h-screen w-full p-8 flex flex-col items-center animate-[fadeIn_0.5s]" style={fontStyle}>
      
      {/* --- RETURN BUTTON --- */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-8">
        <button 
          onClick={() => setView('menu')}
          className="group flex items-center gap-3 text-pink-500 hover:text-pink-400 transition-colors px-2 py-2"
        >
          <div className="transform group-hover:-translate-x-1 transition-transform duration-300">
            <IconArrowLeft />
          </div>
          <span className="text-sm font-bold tracking-[0.2em] uppercase">Return</span>
        </button>
      </div>

      {/* HEADER */}
      <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight text-center">
        Battle <span className="text-pink-600">History</span>
      </h1>
      <p className="text-gray-400 mb-12 text-center max-w-lg uppercase tracking-widest text-xs font-bold">
        Combat Records of {username}
      </p>

      {/* BATTLE LOG LIST */}
      <div className="w-full max-w-5xl space-y-4">
        {battleHistory.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-gray-500 font-bold uppercase tracking-widest">No battles recorded yet.</p>
            <p className="text-gray-600 text-xs mt-2">Play a game to see your history here.</p>
          </div>
        ) : (
          battleHistory.map((battle, index) => {
            const isSquad = battle.type === "Squad" || battle.mode === "SQUAD";
            const isVictory = battle.result === "Victory" || battle.result === "WIN";
            const isDraw = battle.result === "Draw";
            const dateStr = battle.date || new Date().toLocaleDateString();
            
            // --- DYNAMIC TOTAL QUESTIONS LOGIC ---
            // If totalQuestions exists (new games), use it. Defaults to 10.
            const totalQ = battle.totalQuestions || 10; 

            return (
              <div key={index} className="relative group overflow-hidden bg-[#0f0f0f] border border-white/10 rounded-2xl p-8 transition-all hover:border-pink-500/30 hover:shadow-[0_0_30px_rgba(236,72,153,0.1)]">
                
                {/* Mode Badge */}
                <div className={`absolute top-0 right-12 px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-b-lg ${isSquad ? 'bg-purple-600' : 'bg-red-600'}`}>
                  {isSquad ? "SQUAD" : "1v1 DUEL"}
                </div>

                {/* Victory Bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isVictory ? 'bg-green-500' : isDraw ? 'bg-yellow-500' : 'bg-red-500'}`} />

                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  
                  {/* LEFT: INFO */}
                  <div className="flex-1 text-center md:text-left">
                    <span className="text-[10px] text-pink-500/70 uppercase tracking-[0.2em] font-bold">{dateStr}</span>
                    <h3 className="text-2xl font-bold text-white mt-1 mb-1">{battle.topic || "Unknown Topic"}</h3>
                    <p className="text-sm text-gray-400">
                      {isSquad ? `Classroom Battle` : `Duel against ${battle.opponent || "Bot"}`}
                    </p>
                  </div>

                  {/* CENTER: ACCURACY BARS */}
                  <div className="flex flex-col items-center gap-2 px-8 md:border-x border-white/10">
                    <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-bold">Accuracy</p>
                    <div className="flex gap-1.5">
                      {/* Dynamically generate bars based on Total Questions */}
                      {[...Array(totalQ)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-1.5 h-6 rounded-full transition-all ${i < (battle.myScore || 0) ? 'bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.5)]' : 'bg-white/10'}`} 
                        />
                      ))}
                    </div>
                    {/* DYNAMIC SCORE */}
                    <p className="text-xs font-bold text-white mt-1">{battle.myScore || 0} / {totalQ}</p>
                  </div>

                  {/* RIGHT: RESULT */}
                  <div className="text-center md:text-right min-w-[120px]">
                    <p className={`text-2xl font-black uppercase tracking-tighter ${isVictory ? 'text-green-500' : isDraw ? 'text-yellow-500' : 'text-red-500'}`}>
                      {isVictory ? "VICTORY" : isDraw ? "DRAW" : "DEFEAT"}
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                      {isSquad ? "Rank #1" : "Match Complete"}
                    </p>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Grimoire;