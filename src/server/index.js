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

// --- 1. GLOBAL STORAGE ---
const roomInfo = {}; 

// --- GROQ AI CONFIGURATION ---
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --- HELPER: ROBUST JSON EXTRACTOR ---
// Uses Regex to find the JSON array/object even if AI adds extra text
function extractJson(text) {
  try {
    // 1. Try finding an array [ ... ]
    const arrayMatch = text.match(/\[.*\]/s);
    if (arrayMatch) return JSON.parse(arrayMatch[0]);
    
    // 2. Try finding an object { ... }
    const objectMatch = text.match(/\{[\s\S]*\}/);
    if (objectMatch) return JSON.parse(objectMatch[0]);

    // 3. Fallback: Parse whole text
    return JSON.parse(text);
  } catch (e) {
    console.error("⚠️ JSON Extraction Failed. Raw Text:", text);
    return null; 
  }
}

// --- AGENT 1: STEM QUIZ (10 QUESTIONS) ---
async function agentStemQuiz(topic, difficulty) {
  console.log(`🧪 STEM Agent generating quiz on: ${topic} (${difficulty})`);
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a specialized Quiz API. Output raw JSON only. No markdown, no intro." },
        // INSTRUCTION: EXPLICITLY ASK FOR 10 QUESTIONS
        { role: "user", content: `Generate exactly 10 multiple-choice questions about "${topic}".
          Format: [{"id": 1, "text": "Question?", "options": ["A", "B", "C", "D"], "correctAnswer": "A"}]` 
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5, 
    });

    let text = completion.choices[0]?.message?.content || "";
    const questions = extractJson(text);
    
    if (Array.isArray(questions) && questions.length > 0) {
      // If AI gave less than 10, duplicate questions to reach 10 so game doesn't break
      while (questions.length < 10) {
        questions.push({ ...questions[0], id: questions.length + 1, text: questions[0].text + " (Bonus)" });
      }
      return questions.slice(0, 10); // Ensure exactly 10
    } else {
      throw new Error("AI output was not a valid array");
    }

  } catch (error) {
    console.error("❌ Quiz Agent Error:", error.message);
    return [];
  }
}

// --- AGENT 2: CAREER MATCHING (DETAILED PROMPTS RESTORED) ---
async function agentCareerGuidance(profile) {
  console.log(`🚀 Career Agent analyzing profile for: ${profile.name}`);

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a Senior Career Architect. You do not speak. You only output valid JSON data.
          
          CRITICAL INSTRUCTION FOR 'roadmap': 
          Each step MUST be a detailed paragraph (3-4 sentences).
          You MUST mention:
          1. Specific tools (e.g., VS Code, Jupyter, Figma).
          2. Specific platforms (e.g., Coursera, GitHub, LeetCode).
          3. A concrete project to build (e.g., "Build a Weather App", "Create a Chatbot").

          Example of a GOOD step:
          "Master Python Fundamentals. Start by installing VS Code and taking the 'Python for Everybody' course on Coursera. Once comfortable with loops, build a 'To-Do List CLI' project using the 'Click' library to practice logic."`
        },
        {
          role: "user",
          content: `Analyze this student profile:
          Name: ${profile.name}
          Skills: ${profile.skills}
          Interests: ${profile.interests}
          Grades: ${profile.grades}
          
          Return a JSON object with this EXACT structure:
          {
            "recommended_careers": [
              { "title": "string", "match_score": "string", "reason": "Detailed reason why this fits" },
              { "title": "string", "match_score": "string", "reason": "Detailed reason why this fits" },
              { "title": "string", "match_score": "string", "reason": "Detailed reason why this fits" }
            ],
            "roadmap": [
              "Phase 1: [Detailed actionable paragraph with specific resources and a project idea]",
              "Phase 2: [Detailed actionable paragraph with specific resources and a project idea]",
              "Phase 3: [Detailed actionable paragraph with specific resources and a project idea]",
              "Phase 4: [Detailed actionable paragraph with specific resources and a project idea]"
            ],
            "education_path": "Detailed degree or certification recommendation.",
            "market_outlook": "Detailed market analysis."
          }`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3, 
    });

    let text = completion.choices[0]?.message?.content || "";
    const data = extractJson(text);
    if (!data) throw new Error("Invalid JSON from Career Agent");
    return data;

  } catch (error) {
    console.error("❌ Career Agent Error:", error.message);
    
    // FULL FALLBACK DATA (Restored)
    return {
      recommended_careers: [
        { title: "AI Research Scientist", match_score: "98%", reason: "Strong theoretical grasp combined with coding skills." },
        { title: "Robotics Engineer", match_score: "92%", reason: "Interest in hardware and automation." },
        { title: "Data Analyst", match_score: "85%", reason: "Matches analytical background." }
      ],
      roadmap: [
        "Phase 1: Foundations. Master Advanced Python. Don't just watch videos; build a 'Library Management System' to understand databases. Complete the 'CS50' course from Harvard online.",
        "Phase 2: Mathematics & ML. Dive deep into Linear Algebra. Build a 'Handwritten Digit Recognizer' using MNIST data to understand neural networks.",
        "Phase 3: Hardware Integration. Buy an Arduino or Raspberry Pi and code an 'Obstacle Avoidance Bot'. Learn ROS (Robot Operating System).",
        "Phase 4: Professional Portfolio. Contribute to Open Source on GitHub. Build a comprehensive Portfolio Website showcasing your Bot."
      ],
      education_path: "Masters in CS or Mechatronics recommended.",
      market_outlook: "Very High growth expected."
    };
  }
}

// --- SOCKET CONNECTION ---
io.on('connection', (socket) => {
  console.log(`⚡ User Connected: ${socket.id}`);

  // --- 1. MATCHMAKING ---
  socket.on('find_match', async ({ username, topic, difficulty }) => {
    console.log(`🔍 ${username} is searching for: ${topic}`);
    const roomCode = `room_${socket.id}`;
    socket.join(roomCode);
    
    // Capture the actual topic or fallback
    const searchTopic = topic || "General Science";

    // Use the AI Agent (Requests 10 questions)
    const questions = await agentStemQuiz(searchTopic, difficulty || "Medium");
    
    // If AI fails completely, use this fallback
    const finalQuestions = questions.length > 0 ? questions : [
       { id: 1, text: "AI Generation Failed. Please check server logs.", options: ["Retry", "Check API", "Reboot", "Sleep"], correctAnswer: "Check API" }
    ];

    socket.emit("match_found", {
      roomCode,
      topic: searchTopic, // <--- Correctly sends topic to client for History
      questions: finalQuestions,
      players: [{ id: socket.id, username, avatar: '👨‍🎓' }, { id: 'BOT', username: 'StemBot', avatar: '🤖' }]
    });
  });

  // --- 2. CAREER ADVICE ---
  socket.on('get_career_advice', async (userProfile) => {
    const careerData = await agentCareerGuidance(userProfile);
    socket.emit("career_advice_result", careerData);
  });

  // --- 3. CREATE ROOM ---
  socket.on("create_room", (data) => {
    const { username, roomCode, config } = data;
    socket.join(roomCode);
    
    roomInfo[roomCode] = {
      host: username,
      topic: config?.topic || "General Magic",
      file: config?.file
    };

    console.log(`🏰 Room Created: ${roomCode} by ${username}`);
    
    io.to(roomCode).emit("room_data", { 
        players: [username], 
        roomCode 
    });
  });

  // --- 4. CHECK ROOM ---
  socket.on("check_room", (roomCode) => {
    const room = io.sockets.adapter.rooms.get(roomCode);
    const info = roomInfo[roomCode];

    if (room && info) {
      socket.emit("room_preview", { 
        exists: true, 
        name: `Room ${roomCode}`, 
        topic: info.topic,
        host: info.host,
        count: room.size 
      });
    } else {
      socket.emit("room_preview", { exists: false });
    }
  });

  // --- 5. JOIN ROOM ---
  socket.on("join_room", (data) => {
    const { roomCode, username } = data;
    const room = io.sockets.adapter.rooms.get(roomCode);

    if (room) {
      socket.join(roomCode);
      console.log(`👋 ${username} joined ${roomCode}`);
      const players = Array(room.size).fill("Wizard");
      players[players.length - 1] = username;
      io.to(roomCode).emit("room_data", { players, roomCode });
    }
  });

  socket.on('disconnect', () => {
    console.log('🔥 Wizard Disconnected');
  });
});

server.listen(3001, () => {
  console.log("🎓 SERVER RUNNING ON PORT 3001");
});