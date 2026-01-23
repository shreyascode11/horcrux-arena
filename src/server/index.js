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

// Check if API Key exists
if (!process.env.GROQ_API_KEY) {
  console.error("❌ FATAL ERROR: GROQ_API_KEY is missing in .env file!");
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --- HELPER: CLEAN JSON OUTPUT ---
function cleanJson(text) {
  if (!text) return null;
  let clean = text.replace(/```json/g, "").replace(/```/g, "");
  
  const firstBrace = clean.indexOf('{');
  const firstBracket = clean.indexOf('[');
  
  let start = -1;
  let end = -1;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    start = firstBrace;
    end = clean.lastIndexOf('}');
  } 
  else if (firstBracket !== -1) {
    start = firstBracket;
    end = clean.lastIndexOf(']');
  }

  if (start !== -1 && end !== -1) {
    clean = clean.substring(start, end + 1);
  }
  
  return clean.trim();
}

// --- AGENT 1: STEM QUIZ ---
async function agentStemQuiz(topic, difficulty) {
  const seed = Date.now();
  console.log(`🧪 Quiz Agent: Requesting "${topic}" (Seed: ${seed})`);
  
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a Quiz Generator. Output raw JSON array only." },
        { 
          role: "user", 
          content: `Generate 10 multiple-choice questions about "${topic}". Difficulty: ${difficulty}.
          Random Seed: ${seed}.
          
          Format: JSON Array only.
          [
            {
              "id": 1, 
              "text": "Question?", 
              "options": ["A", "B", "C", "D"], 
              "correctAnswer": "A" 
            }
          ]` 
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7, 
    });

    const text = completion.choices[0]?.message?.content || "";
    const cleaned = cleanJson(text);
    return JSON.parse(cleaned);

  } catch (error) {
    console.error("❌ Quiz Agent Failed:", error.message);
    return []; 
  }
}

// --- AGENT 2: CAREER GUIDANCE (DEBUG MODE) ---
async function agentCareerGuidance(profile) {
  console.log(`🚀 Career Agent: Analyzing ${profile.name}...`);

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a Career Architect. Output ONLY valid JSON.`
        },
        {
          role: "user",
          content: `Profile: ${JSON.stringify(profile)}.
          
          Return JSON object:
          {
            "recommended_careers": [
              { "title": "Job Title", "match_score": "90%", "reason": "Why" }
            ],
            "roadmap": [
              "Step 1: Detailed instruction",
              "Step 2: Detailed instruction",
              "Step 3: Detailed instruction",
              "Step 4: Detailed instruction"
            ],
            "education_path": "Degree name",
            "market_outlook": "Growth stats"
          }`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1, // Low temp to prevent errors
    });

    const text = completion.choices[0]?.message?.content || "";
    console.log("📝 AI Response Received (Raw length):", text.length);

    const cleanedText = cleanJson(text);
    
    if (!cleanedText) throw new Error("Empty response from AI");
    
    return JSON.parse(cleanedText);

  } catch (error) {
    console.error("❌ Career Agent Failed:", error.message);
    
    // ✅ FALLBACK DATA (This ensures the UI never breaks)
    return {
      recommended_careers: [
        { title: "Software Engineer", match_score: "95%", reason: "Fallback: Matches your tech skills." },
        { title: "Data Scientist", match_score: "88%", reason: "Fallback: Matches your analytical background." },
        { title: "Product Manager", match_score: "80%", reason: "Fallback: Good fit for leadership interests." }
      ],
      roadmap: [
        "Step 1: Master the Basics. Focus on Python and JavaScript logic.",
        "Step 2: Build Projects. Create a portfolio with at least 3 full-stack apps.",
        "Step 3: Advanced Concepts. Learn System Design and Cloud Architecture.",
        "Step 4: Job Hunt. Optimize your resume and practice LeetCode."
      ],
      education_path: "B.Tech in Computer Science or equivalent certification.",
      market_outlook: "Stable and high demand globally."
    };
  }
}

// --- SOCKET CONNECTION ---
io.on('connection', (socket) => {
  console.log(`⚡ User Connected: ${socket.id}`);

  socket.on('find_match', async ({ username, topic, difficulty }) => {
    const roomCode = `room_${socket.id}`;
    socket.join(roomCode);
    
    const questions = await agentStemQuiz(topic || "Science", difficulty || "Medium");
    
    const finalQuestions = questions.length > 0 ? questions : [
       { id: 1, text: "AI Unavailable. What is 2+2?", options: ["3", "4", "5", "6"], correctAnswer: "4" }
    ];

    socket.emit("match_found", {
      roomCode,
      questions: finalQuestions,
      players: [{ id: socket.id, username, avatar: '👨‍🎓' }, { id: 'BOT', username: 'StemBot', avatar: '🤖' }]
    });
  });

  socket.on('get_career_advice', async (userProfile) => {
    console.log("📩 Received Career Request for:", userProfile.name);
    const careerData = await agentCareerGuidance(userProfile);
    console.log("📤 Sending Results back to Client...");
    socket.emit("career_advice_result", careerData);
  });
});

server.listen(3001, () => {
  console.log("🎓 SERVER RUNNING ON PORT 3001");
});