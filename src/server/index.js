require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const Groq = require("groq-sdk");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// --- GROQ AI CONFIGURATION ---
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --- FALLBACK QUESTIONS (Safety Net) ---
const FALLBACK_QUESTIONS = [
  { id: 1, text: "The AI is napping. Who is the Boy Who Lived?", options: ["Harry", "Ron", "Draco", "Neville"], correctAnswer: "Harry" },
  { id: 2, text: "Which spell unlocks doors?", options: ["Lumos", "Alohomora", "Accio", "Expelliarmus"], correctAnswer: "Alohomora" },
  { id: 3, text: "What language do snakes speak?", options: ["English", "Python", "Parseltongue", "C++"], correctAnswer: "Parseltongue" },
  { id: 4, text: "Who is the Potions Master?", options: ["Snape", "Sprout", "Flitwick", "Hagrid"], correctAnswer: "Snape" }
];

// --- AI GENERATION FUNCTION ---
// --- AI GENERATION FUNCTION (INDIA FOCUSED) ---
async function generateQuestions(topic) {
  // 1. Random styles to keep it fresh, but focused on India
  const styles = [
    "focused on Ancient India (Mauryas, Guptas, etc)",
    "focused on the Indian Freedom Struggle",
    "focused on Medieval India (Mughals, Marathas, Cholas)",
    "focused on Post-Independence Indian History",
    "focused on Indian Culture and Heritage",
    "difficult and deep cuts from Indian history",
    "focused on famous Indian personalities"
  ];
  
  // Pick a random style
  const randomStyle = styles[Math.floor(Math.random() * styles.length)];
  const randomSeed = Math.floor(Math.random() * 50000);

  console.log(`🧠 Groq AI Generating: ${topic} (${randomStyle})...`);

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert on INDIAN History and Culture. Your goal is to test knowledge specifically about India."
        },
        {
          role: "user",
          // INSTRUCTION: FORCE INDIAN CONTEXT
          content: `Generate 10 UNIQUE multiple-choice questions about "${topic}". 
          CRITICAL INSTRUCTION: Focus STRICTLY on the INDIAN context. 
          (e.g., If topic is 'History', ask about Indian History. If 'Kings', ask about Indian Kings).
          
          Current Flavor: Make these questions ${randomStyle}.
          Random Seed: ${randomSeed}.
          
          Format: Output ONLY a raw JSON array: [{"id": 1, "text": "Question?", "options": ["A", "B", "C", "D"], "correctAnswer": "A"}]`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.9, 
    });

    let text = completion.choices[0]?.message?.content || "";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : FALLBACK_QUESTIONS;

  } catch (error) {
    console.error("❌ Groq Error:", error.message);
    return FALLBACK_QUESTIONS;
  }
}

// --- SOCKET CONNECTION ---
io.on('connection', (socket) => {
  console.log(`⚡ Wizard Connected: ${socket.id}`);

  socket.on('find_match', async ({ username, topic }) => {
    console.log(`🔍 ${username} is searching for: ${topic}`);
    const roomCode = `room_${socket.id}`; // Simple 1-player room for now
    socket.join(roomCode);

    // CALL THE AI
    const aiQuestions = await generateQuestions(topic);

    const matchData = {
      roomCode,
      topic,
      mode: '1v1_BOT',
      questions: aiQuestions,
      players: [
        { id: socket.id, username: username, avatar: '🧙‍♂️' },
        { id: 'BOT', username: 'Dueling Dummy', avatar: '🤖' }
      ]
    };

    socket.emit("match_found", matchData);
    console.log(`🤖 Bot Duel Started for ${username}`);
  });

  socket.on('disconnect', () => {
    console.log('🔥 Wizard Disconnected');
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING ON PORT 3001 - GROQ AI ONLINE 🚀");
});