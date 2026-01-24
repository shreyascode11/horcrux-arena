import React from "react";
import { ranks, getRank } from "./rank-system";

function RankOverview({ points = 0 }) {
  const currentRankName = getRank(points);
  const currentRankIndex = ranks.findIndex(
    (r) => r.name === currentRankName
  );

  const currentRank = ranks[currentRankIndex];
  const nextRank = ranks[currentRankIndex + 1];

  const progress = nextRank
    ? Math.min(
        ((points - currentRank.min) /
          (nextRank.min - currentRank.min)) *
          100,
        100
      )
    : 100;

  return (
    <div className="w-full max-w-3xl mx-auto p-8 text-white">
      <h1 className="text-4xl font-bold mb-8">🏆 Rank Progress</h1>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <p className="text-xs uppercase tracking-widest text-gray-400">
          Current Rank
        </p>
        <h2 className="text-3xl font-bold mt-2">
          {currentRank.name}
        </h2>
        <p className="text-gray-400 mt-2">
          Total XP:{" "}
          <span className="text-white font-bold">
            {points}
          </span>
        </p>
      </div>

      {nextRank ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">
            Progress to {nextRank.name}
          </p>

          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-sm text-gray-400 mt-3">
            {points} / {nextRank.min} XP
          </p>
        </div>
      ) : (
        <p className="mt-6 text-green-400 font-bold">
          🎓 Max Rank Achieved: Headmaster
        </p>
      )}
    </div>
  );
}

export default RankOverview;
