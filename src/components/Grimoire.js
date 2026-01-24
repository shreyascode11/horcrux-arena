import React, { useState, useEffect } from 'react';

const Grimoire = ({ setView, username }) => {
  const [battleHistory, setBattleHistory] = useState([]);

  useEffect(() => {
    // 1. Load History from LocalStorage
    const savedHistory = localStorage.getItem('wizardBattleLog');
    
    if (savedHistory) {
      setBattleHistory(JSON.parse(savedHistory));
    } else {
      // 2. Fallback to Demo Data if empty (so judges see something)
      setBattleHistory([
        { 
          id: 1, type: "1v1", topic: "Defense Against Dark Arts", opponent: "DracoM", 
          myScore: 8, opScore: 5, date: "JAN 21, 2026", result: "Victory"
        },
        { 
          id: 2, type: "Squad", topic: "Advanced Potions", rank: 2, totalPlayers: 30,
          myScore: 9, date: "JAN 19, 2026", result: "Podium" 
        }
      ]);
    }
  }, []);

  return (
    <div className="w-full max-w-5xl animate-[fadeIn_0.5s_ease-out] text-white">
      {/* HEADER */}
      <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-6xl font-bold tracking-tighter">GRIMOIRE</h1>
          <p className="text-pink-500/60 uppercase tracking-[0.4em] text-xs mt-2">
            Combat Records of {username}
          </p>
        </div>
        <button 
          onClick={() => setView('menu')}
          className="px-8 py-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-pink-500/50 rounded-full transition-all text-sm font-bold tracking-widest"
        >
          BACK TO ARENA
        </button>
      </div>

      {/* BATTLE LOG */}
      <div className="space-y-4">
        {battleHistory.map((battle, index) => {
          const isSquad = battle.type === "Squad";
          // Calculate margin safely
          const margin = !isSquad && battle.opScore ? Math.abs(battle.myScore - battle.opScore) : 0;
          const isVictory = battle.result === "Victory" || (isSquad && battle.rank === 1);
          const isDraw = battle.result === "Draw";

          return (
            <div key={index} className="relative group overflow-hidden bg-white/5 border border-white/5 rounded-2xl p-6 transition-all hover:bg-white/[0.07] hover:border-white/20">
              {/* Mode Badge */}
              <div className={`absolute top-0 right-12 px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-b-lg ${isSquad ? 'bg-purple-600' : 'bg-red-600'}`}>
                {battle.type || "1v1"}
              </div>

              {/* Result Line */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${isVictory ? 'bg-green-500' : isDraw ? 'bg-yellow-500' : 'bg-red-500'}`} />

              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex-1">
                  <span className="text-[10px] text-white/30 uppercase tracking-widest">{battle.date}</span>
                  <h3 className="text-2xl font-bold tracking-tight mb-1">{battle.topic}</h3>
                  <p className="text-sm text-gray-400">
                    {isSquad 
                      ? `Classroom Battle` 
                      : `Duel against ${battle.opponent || "Unknown"}`}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-2 px-6 border-x border-white/5">
                  <p className="text-[8px] text-white/30 uppercase tracking-[0.2em]">Accuracy</p>
                  <div className="flex gap-1">
                    {[...Array(10)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1.5 h-4 rounded-full ${i < battle.myScore ? 'bg-pink-500' : 'bg-white/10'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-xs font-bold text-pink-500">{battle.myScore}/10</p>
                </div>

                <div className="text-right min-w-[120px]">
                  <p className={`text-xl font-black uppercase tracking-tighter ${isVictory ? 'text-green-500' : isDraw ? 'text-yellow-500' : 'text-red-500'}`}>
                    {battle.result}
                  </p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">
                    {isSquad ? `Rank #${battle.rank || 5}` : (isDraw ? 'Perfect Match' : `Margin: ${margin} pts`)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Grimoire;