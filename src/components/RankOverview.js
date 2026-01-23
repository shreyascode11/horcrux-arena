import React from "react";
import { ranks, getRank } from "./rank-system";

// --- ICON ---
const IconArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);

// Added 'setView' prop
function RankOverview({ questionsSolved = 0, setView }) {
  const currentRankName = getRank(questionsSolved);
  const currentRankIndex = ranks.findIndex(
    (r) => r.name === currentRankName
  );

  const currentRank = ranks[currentRankIndex];
  const nextRank = ranks[currentRankIndex + 1];

  const progress = nextRank
    ? Math.min(
        ((questionsSolved - currentRank.min) /
          (nextRank.min - currentRank.min)) *
          100,
        100
      )
    : 100;

  return (
    <div className="w-full max-w-3xl mx-auto p-10 text-white animate-[fadeIn_0.5s]">
      
      {/* --- RETURN BUTTON (Pink to match Progress Bar) --- */}
      <div className="w-full flex items-center justify-start mb-8">
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

      <h1 className="text-4xl font-bold mb-8">🏆 Rank Overview</h1>

      {/* CURRENT RANK */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
        <p className="text-xs uppercase tracking-widest text-gray-400">
          Current Rank
        </p>
        <h2 className="text-3xl font-bold mt-2">
          {currentRank.name}
        </h2>
        <p className="text-gray-400 mt-3">
          Questions Solved:{" "}
          <span className="font-bold text-white">
            {questionsSolved}
          </span>
        </p>
      </div>

      {/* PROGRESS */}
      {nextRank && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">
            Progress to {nextRank.name}
          </p>

          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-sm text-gray-400 mt-3">
            {questionsSolved} / {nextRank.min} questions
          </p>
        </div>
      )}

      {!nextRank && (
        <p className="mt-6 text-green-400 font-bold">
          🎓 You have reached the highest rank: Headmaster
        </p>
      )}
    </div>
  );
}

export default RankOverview;