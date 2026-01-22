import React from "react";
import { ranks, getRank } from "./rank-system";

function RankOverview({ questionsSolved = 0 }) {
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
    <div className="w-full max-w-3xl mx-auto p-10 text-white">
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
