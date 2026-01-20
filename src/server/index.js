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
async function generateQuestions(topic) {
  console.log(`🧠 Groq AI Generating questions for: ${topic}...`);
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a quiz generator. Output ONLY a raw JSON array of 10 questions. No Markdown. No explanations."
        },
        {
          role: "user",
          content: `Generate 10 multiple-choice questions about "${topic}". 
          Format: [{"id": 1, "text": "Question?", "options": ["A", "B", "C", "D"], "correctAnswer": "A"}]`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
    });

    let text = completion.choices[0]?.message?.content || "";
    // Clean up any Markdown formatting the AI might add
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    console.log("📝 AI Output:", text.substring(0, 50) + "..."); 

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