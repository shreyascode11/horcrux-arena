export const ranks = [
  { name: "First-Year Student", min: 0 },
  { name: "Hogwarts Apprentice", min: 20 },
  { name: "House Scholar", min: 50 },
  { name: "Prefect", min: 100 },
  { name: "Auror Trainee", min: 200 },
  { name: "Order Member", min: 350 },
  { name: "Master Wizard", min: 600 },
  { name: "Headmaster", min: 1000 },
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
