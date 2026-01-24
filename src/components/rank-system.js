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

export const getRank = (points = 0) => {
  return [...ranks]
    .reverse()
    .find((rank) => points >= rank.min)?.name || ranks[0].name;
};

/**
 * Battle reward calculator
 */
export const calculateBattleRewards = ({
  correctAnswers = 0,
  totalQuestions = 0,
}) => {
  const accuracy = totalQuestions
    ? correctAnswers / totalQuestions
    : 0;

  const baseXP = correctAnswers * 10;
  const accuracyBonus = Math.floor(accuracy * 50);

  return {
    xp: baseXP + accuracyBonus,
    correctAnswers,
  };
};