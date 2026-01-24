require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" },
});

// =================================================
// 🧠 GLOBAL STORAGE
// =================================================
const roomInfo = {};
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// =================================================
// 🔧 HELPER: ROBUST JSON EXTRACTOR
// =================================================
function extractJson(text) {
  try {
    // 1. Remove Markdown code blocks (```json, ```) and whitespace
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    // 2. Locate the actual JSON object or array to ignore intro text
    const firstOpenBrace = cleanText.indexOf('{');
    const firstOpenBracket = cleanText.indexOf('[');
    
    let startIndex = -1;
    let endIndex = -1;

    if (firstOpenBrace !== -1 && (firstOpenBracket === -1 || firstOpenBrace < firstOpenBracket)) {
         startIndex = firstOpenBrace;
         endIndex = cleanText.lastIndexOf('}') + 1;
    } else if (firstOpenBracket !== -1) {
         startIndex = firstOpenBracket;
         endIndex = cleanText.lastIndexOf(']') + 1;
    }

    if (startIndex !== -1 && endIndex !== -1) {
        cleanText = cleanText.substring(startIndex, endIndex);
    }

    return JSON.parse(cleanText);
  } catch (e) {
    console.error("⚠️ JSON Extraction Failed. Raw Text:", text);
    return null; 
  }
}

// =================================================
// 🤖 AI AGENT 1: STEM QUIZ GENERATOR
// =================================================
async function agentStemQuiz(topic, difficulty) {
  console.log(`🧪 STEM Agent generating quiz on: ${topic} (${difficulty})`);
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a specialized Quiz API. Output raw JSON only. No markdown, no intro." },
        { role: "user", content: `Generate exactly 10 multiple-choice questions about "${topic}".
          Format: [{"id": 1, "text": "Question?", "options": ["A", "B", "C", "D"], "correctAnswer": "A"}]` 
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5, 
      max_tokens: 4000,
    });

    let text = completion.choices[0]?.message?.content || "";
    const questions = extractJson(text);
    
    if (Array.isArray(questions) && questions.length > 0) {
      while (questions.length < 10) {
        questions.push({ ...questions[0], id: questions.length + 1, text: questions[0].text + " (Bonus)" });
      }
      return questions.slice(0, 10);
    } else {
      throw new Error("AI output was not a valid array");
    }
  } catch (error) {
    console.error("❌ Quiz Agent Error:", error.message);
    // Fallback Question if AI fails
    return [{ id: 1, text: "AI Service Unavailable. Try again?", options: ["Retry", "Wait", "Reboot", "Sleep"], correctAnswer: "Retry" }];
  }
}

// =================================================
// 🤖 AI AGENT 2: CAREER GUIDANCE
// =================================================
async function agentCareerGuidance(profile) {
  console.log(`🚀 Career Agent analyzing profile for: ${profile.name}`);
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a Senior Career Architect. Output valid JSON data only.`
        },
        {
          role: "user",
          content: `Analyze this student profile:
          Name: ${profile.name}, Skills: ${profile.skills}, Interests: ${profile.interests}, Grades: ${profile.grades}
          
          Return a JSON object with: "recommended_careers" (array), "roadmap" (array of strings), "education_path" (string), "market_outlook" (string).`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 4000,
    });

    let text = completion.choices[0]?.message?.content || "";
    const data = extractJson(text);
    if (!data) throw new Error("Invalid JSON from Career Agent");
    return data;

  } catch (error) {
    console.error("❌ Career Agent Error:", error.message);
    return null; // Frontend handles null
  }
}

// =================================================
// 🔌 SOCKET CONNECTION
// =================================================
io.on("connection", (socket) => {
  console.log("⚡ Connected:", socket.id);

  // ---------------------------------------------
  // FEATURE 1: AI MATCHMAKING (1v1 DUEL)
  // ---------------------------------------------
  socket.on('find_match', async ({ username, topic, difficulty }) => {
    console.log(`🔍 ${username} is searching for: ${topic}`);
    const roomCode = `duel_${socket.id}`;
    socket.join(roomCode);
    
    const searchTopic = topic || "General Science";
    
    // Generate AI Questions
    const questions = await agentStemQuiz(searchTopic, difficulty || "Medium");
    
    socket.emit("match_found", {
      roomCode,
      topic: searchTopic,
      questions: questions,
      players: [{ id: socket.id, username, avatar: '👨‍🎓' }, { id: 'BOT', username: 'StemBot', avatar: '🤖' }]
    });
  });

  // ---------------------------------------------
  // FEATURE 2: CAREER ADVICE
  // ---------------------------------------------
  socket.on('get_career_advice', async (userProfile) => {
    const careerData = await agentCareerGuidance(userProfile);
    socket.emit("career_advice_result", careerData);
  });

  // ---------------------------------------------
  // FEATURE 3: SQUAD ROOMS (MULTIPLAYER)
  // ---------------------------------------------
  
  // 1. CREATE ROOM
  socket.on("create_room", ({ username, roomCode, config }) => {
    socket.join(roomCode);

    roomInfo[roomCode] = {
      roomCode,
      topic: config?.topic || "General Magic",
      maxPlayers: 5,
      players: [
        {
          id: socket.id,
          username,
          ready: false,
          avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`,
          questionsSolved: 0,
          isHost: true,
        },
      ],
    };

    emitRoom(roomCode);
  });

  // 2. CHECK ROOM (For Join Screen)
  socket.on("check_room", (roomCode) => {
    const room = roomInfo[roomCode];
    socket.emit("room_preview", room ? {
        exists: true,
        host: room.players.find(p => p.isHost)?.username,
        topic: room.topic,
        count: room.players.length,
      } : { exists: false }
    );
  });

  // 3. JOIN ROOM
  socket.on("join_room", ({ roomCode, username }) => {
    const room = roomInfo[roomCode];
    if (!room || room.players.length >= room.maxPlayers) return;

    if (!room.players.find(p => p.username === username)) {
      room.players.push({
        id: socket.id,
        username,
        ready: false,
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`,
        questionsSolved: 0,
        isHost: false,
      });
    }

    socket.join(roomCode);
    emitRoom(roomCode);
  });

  // 4. RECONNECT (If browser refresh)
  socket.on("reconnect_room", ({ roomCode, username }) => {
    const room = roomInfo[roomCode];
    if (!room) return;
    const player = room.players.find(p => p.username === username);
    if (!player) return;
    player.id = socket.id;
    socket.join(roomCode);
    emitRoom(roomCode);
  });

  // 5. TOGGLE READY
  socket.on("toggle_ready", ({ roomCode, username }) => {
    const room = roomInfo[roomCode];
    if (!room) return;
    const player = room.players.find(p => p.username === username);
    if (!player) return;
    player.ready = !player.ready;
    emitRoom(roomCode);
    checkAutoStart(roomCode);
  });

  // 6. START MATCH (For Squads)
  socket.on("start_match", async (roomCode) => {
    const room = roomInfo[roomCode];
    if (!room) return;

    // Optional: Generate Questions for the Squad
    const questions = await agentStemQuiz(room.topic, "Medium");

    io.to(roomCode).emit("match_found", {
      roomCode,
      topic: room.topic,
      questions: questions,
      players: room.players,
    });
  });

  // 7. KICK PLAYER
  socket.on("kick_player", ({ roomCode, target }) => {
    const room = roomInfo[roomCode];
    if (!room) return;
    const host = room.players.find(p => p.isHost && p.id === socket.id);
    if (!host) return;

    const kicked = room.players.find(p => p.username === target);
    if (!kicked) return;

    io.to(kicked.id).emit("kicked");
    io.sockets.sockets.get(kicked.id)?.leave(roomCode);
    room.players = room.players.filter(p => p.username !== target);
    emitRoom(roomCode);
  });

  // 8. DISCONNECT HANDLING
  socket.on("disconnect", () => {
    for (const code in roomInfo) {
      const room = roomInfo[code];
      const index = room.players.findIndex(p => p.id === socket.id);
      if (index === -1) continue;

      const wasHost = room.players[index].isHost;
      room.players.splice(index, 1);

      if (wasHost && room.players.length > 0) {
        room.players[0].isHost = true;
      }

      if (room.players.length === 0) {
        delete roomInfo[code];
        return;
      }
      emitRoom(code);
    }
  });

  // --- HELPERS ---
  function emitRoom(roomCode) {
    io.to(roomCode).emit("room_data", roomInfo[roomCode]);
  }

  function checkAutoStart(roomCode) {
    const room = roomInfo[roomCode];
    if (room && room.players.length >= 2 && room.players.every(p => p.ready)) {
       // Auto-start logic if you want it, otherwise wait for host
    }
  }
});

server.listen(3001, () => {
  console.log("🎓 SERVER RUNNING ON PORT 3001");
});