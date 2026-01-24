// File: src/components/rank-system.js

export const ranks = [
  { name: "Novice", min: 0 },
  { name: "Seeker", min: 20 },
  { name: "Learner", min: 50 },
  { name: "Scholar", min: 100 },
  { name: "Expert", min: 200 },
  { name: "Mastermind", min: 350 },
  { name: "Quiz Titan", min: 600 },
  { name: "Trivia Saga", min: 1000 },
];

export const getRank = (questionsSolved) => {
  return [...ranks]
    .reverse()
    .find((rank) => questionsSolved >= rank.min)?.name || ranks[0].name;
};