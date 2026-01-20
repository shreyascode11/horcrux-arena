require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function getAvailableModels() {
  const key = process.env.GEMINI_API_KEY;
  console.log("🔑 Using Key:", key ? key.substring(0, 8) + "..." : "MISSING");

  const genAI = new GoogleGenerativeAI(key);
  
  try {
    // This connects to the Server and asks for the "Menu"
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Placeholder
    
    // We access the API manager directly to list models
    const result = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await result.json();

    if (data.models) {
        console.log("\n✅ SUCCESS! Here are the models you can use:");
        console.log("---------------------------------------------");
        data.models.forEach(m => {
            // We only care about models that can "generateContent"
            if(m.supportedGenerationMethods.includes("generateContent")) {
                console.log(`👉 ${m.name.replace("models/", "")}`); 
            }
        });
        console.log("---------------------------------------------\n");
    } else {
        console.log("❌ ERROR: No models found. Full response:", data);
    }

  } catch (error) {
    console.error("❌ CRITICAL ERROR:", error.message);
  }
}

getAvailableModels();