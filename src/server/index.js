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

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --- AGENT 1: STEM QUIZ ---
async function agentStemQuiz(topic, difficulty) {
  console.log(`🧪 STEM Agent generating quiz on: ${topic} (${difficulty})`);
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a Gamified STEM Education Agent." },
        { role: "user", content: `Generate 5 multiple-choice questions about "${topic}". Output JSON ONLY.` }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });
    let text = completion.choices[0]?.message?.content || "";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("❌ Quiz Agent Error:", error.message);
    return [];
  }
}

// --- HELPER: CLEAN JSON OUTPUT ---
function cleanJson(text) {
  let clean = text.replace(/```json/g, "").replace(/```/g, "");
  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    clean = clean.substring(firstBrace, lastBrace + 1);
  }
  return clean.trim();
}

// --- AGENT 2: CAREER MATCHING (EXTREME DETAIL MODE) ---
async function agentCareerGuidance(profile) {
  console.log(`🚀 Career Agent analyzing profile for: ${profile.name}`);

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          // UPDATED: Forced detailed instructions
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
      temperature: 0.3, // Increased slightly to allow for longer, more descriptive text
    });

    let text = completion.choices[0]?.message?.content || "";
    const cleanedText = cleanJson(text);
    return JSON.parse(cleanedText);

  } catch (error) {
    console.error("❌ PARSING ERROR:", error.message);

    
    
    // Fallback Data (Also Detailed)
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

  socket.on('find_match', async ({ username, topic, difficulty }) => {
    const roomCode = `room_${socket.id}`;
    socket.join(roomCode);
    const questions = await agentStemQuiz(topic || "General Science", difficulty || "Medium");
    
    const finalQuestions = questions.length > 0 ? questions : [
       { id: 1, text: "AI Error. What is the speed of light?", options: ["3x10^8 m/s", "300 km/h", "Infinite", "Zero"], correctAnswer: "3x10^8 m/s" }
    ];

    socket.emit("match_found", {
      roomCode,
      questions: finalQuestions,
      players: [{ id: socket.id, username, avatar: '👨‍🎓' }, { id: 'BOT', username: 'StemBot', avatar: '🤖' }]
    });
  });

  socket.on('get_career_advice', async (userProfile) => {
    const careerData = await agentCareerGuidance(userProfile);
    socket.emit("career_advice_result", careerData);
  });
});

server.listen(3001, () => {
  console.log("🎓 SERVER RUNNING ON PORT 3001");
});