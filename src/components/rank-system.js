// src/components/rankSystem.js

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

export const getRank = (questionsSolved) => {
  return [...ranks]
    .reverse()
    .find((rank) => questionsSolved >= rank.min)?.name || ranks[0].name;
};
