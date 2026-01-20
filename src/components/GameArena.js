import React, { useState, useEffect } from 'react';

// --- MOCK QUESTIONS (Placeholder for AI) ---
const MOCK_QUESTIONS = [
  { id: 1, text: "Which spell disarms an opponent?", options: ["Avada Kedavra", "Expelliarmus", "Lumos", "Accio"], correct: 1 },
  { id: 2, text: "What is the primary key in React lists?", options: ["id", "key", "index", "ref"], correct: 1 },
  { id: 3, text: "Who is the Half-Blood Prince?", options: ["Voldemort", "Snape", "Harry", "Dumbledore"], correct: 1 },
  { id: 4, text: "CSS: How do you center a div?", options: ["text-align: center", "flex + justify-center", "float: center", "align: middle"], correct: 1 },
  { id: 5, text: "What protects the Sorcerer's Stone?", options: ["Fluffy", "Dragon", "Troll", "Snake"], correct: 0 },
  { id: 6, text: "Which hook replaces componentDidMount?", options: ["useState", "useEffect", "useContext", "useReducer"], correct: 1 },
  { id: 7, text: "What is the core of Harry's wand?", options: ["Dragon Heartstring", "Unicorn Hair", "Phoenix Feather", "Veela Hair"], correct: 2 },
  { id: 8, text: "Big O: What is the complexity of binary search?", options: ["O(n)", "O(n^2)", "O(log n)", "O(1)"], correct: 2 },
  { id: 9, text: "Who killed Dumbledore?", options: ["Draco", "Bellatrix", "Snape", "Greyback"], correct: 2 },
  { id: 10, text: "How do you check types in JavaScript?", options: ["typeof", "checkType", "getType", "varType"], correct: 0 },
];

const GameArena = ({ socket, roomData, username, setView }) => {
 // If roomData has questions, use them. Otherwise, use Harry Potter as backup.
  const [questions, setQuestions] = useState(
  roomData?.questions && roomData.questions.length > 0 
    ? roomData.questions 
    : MOCK_QUESTIONS
  );
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null); // To show visual feedback
  const [answerStatus, setAnswerStatus] = useState(null); // 'correct' or 'wrong'

  // Identify Opponent Name
  const opponentName = roomData?.players.find(p => p.username !== username)?.username || "Rival";

  const handleAnswer = (index) => {
    if (selectedOption !== null) return; // Prevent double clicking

    setSelectedOption(index);
    const isCorrect = index === questions[currentQIndex].correct;

    if (isCorrect) {
      setAnswerStatus('correct');
      setMyScore(prev => prev + 1);
      // TODO: Emit socket event here to update server about your move
    } else {
      setAnswerStatus('wrong');
    }

    // Delay to show the "Spell Cast" animation before moving to next question
    setTimeout(() => {
      setSelectedOption(null);
      setAnswerStatus(null);
      
      if (currentQIndex + 1 < questions.length) {
        setCurrentQIndex(prev => prev + 1);
      } else {
        setFinished(true);
      }
    }, 1000); // 1 second delay for dramatic effect
  };

  // --- PROGRESS CALCULATION (5% to 92%) ---
  // We start at 5% so the brooms aren't off-screen, and end at 92% (The Snitch)
  const myProgress = 5 + ((myScore / questions.length) * 87);
  const oppProgress = 5 + ((opponentScore / questions.length) * 87);

  return (
    <div className="w-full max-w-6xl animate-[fadeIn_0.5s_ease-out] flex flex-col items-center min-h-[80vh] justify-center">
      
      {/* --- 1. THE SNITCH CHASE TRACK (HUD) --- */}
      <div className="w-full relative mb-16 px-4">
         {/* Glass Panel Background */}
         <div className="absolute inset-0 bg-gradient-to-r from-black/0 via-black/60 to-black/0 blur-xl"></div>
         
         <div className="relative w-full border-y border-white/10 py-12 bg-black/20 backdrop-blur-sm overflow-hidden rounded-xl">
             
             {/* FINISH LINE (Golden Snitch) */}
             <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                <div className="text-4xl animate-[bounce_2s_infinite] filter drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]">⚡</div>
             </div>

             {/* TRACK LINES */}
             <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/10"></div>
             <div className="absolute top-1/4 left-0 right-0 h-[1px] bg-white/5 border-dashed"></div>
             <div className="absolute top-3/4 left-0 right-0 h-[1px] bg-white/5 border-dashed"></div>

             {/* PLAYER 1: YOU (Green Firebolt) */}
             <div 
               className="absolute top-1/4 -translate-y-1/2 transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) z-10 flex items-center gap-3"
               style={{ left: `${myProgress}%` }}
             >
                <div className="relative group">
                    <div className="text-4xl transform -rotate-12 filter drop-shadow-[0_0_20px_rgba(34,197,94,0.6)] transition-transform duration-300 group-hover:rotate-0">🧹</div>
                    {/* Engine Trail Effect */}
                    <div className="absolute top-1/2 right-full w-24 h-1 bg-gradient-to-l from-green-500 to-transparent blur-sm opacity-60"></div>
                </div>
                <div className="bg-black/80 border border-green-500/30 px-3 py-1 rounded-full backdrop-blur-md">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-green-400">You</span>
                </div>
             </div>

             {/* PLAYER 2: RIVAL (Red Nimbus) */}
             <div 
               className="absolute top-3/4 -translate-y-1/2 transition-all duration-1000 ease-linear z-10 flex items-center gap-3"
               style={{ left: `${oppProgress}%` }}
             >
                <div className="relative">
                    <div className="text-4xl transform -rotate-12 filter drop-shadow-[0_0_20px_rgba(239,68,68,0.6)] grayscale opacity-80">🧹</div>
                     {/* Engine Trail Effect */}
                     <div className="absolute top-1/2 right-full w-24 h-1 bg-gradient-to-l from-red-500 to-transparent blur-sm opacity-30"></div>
                </div>
                <div className="bg-black/80 border border-red-500/30 px-3 py-1 rounded-full backdrop-blur-md">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">{opponentName}</span>
                </div>
             </div>
         </div>
      </div>

      {/* --- 2. THE DUELING CARD (Questions) --- */}
      {!finished ? (
        <div className="w-full max-w-3xl relative">
           
           {/* Question Header */}
           <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
              <span className="text-xs font-bold tracking-[0.3em] text-gray-500 uppercase">Question {currentQIndex + 1} / {questions.length}</span>
              <span className="text-xs font-bold tracking-[0.3em] text-green-500 uppercase animate-pulse flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span> Live Duel
              </span>
           </div>
           
           {/* Question Text */}
           <h2 className="text-3xl md:text-5xl font-bold mb-12 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-lg min-h-[120px] flex items-center">
             {questions[currentQIndex].text}
           </h2>

           {/* Options Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions[currentQIndex].options.map((option, idx) => {
                // Determine styling based on selection
                let cardStyle = "border-white/10 hover:border-white/40 hover:bg-white/5"; // Default state
                
                if (selectedOption === idx) {
                    if (answerStatus === 'correct') {
                        cardStyle = "border-green-500 bg-green-500/10 shadow-[0_0_30px_rgba(34,197,94,0.3)] scale-[1.02]";
                    }
                    if (answerStatus === 'wrong') {
                        cardStyle = "border-red-500 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.3)] shake-animation";
                    }
                }

                return (
                    <button 
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={selectedOption !== null}
                      className={`p-6 rounded-2xl border text-left flex items-center gap-4 transition-all duration-200 group relative overflow-hidden ${cardStyle}`}
                    >
                      {/* Letter Marker (A, B, C, D) */}
                      <span className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs transition-colors font-bold ${selectedOption === idx ? 'border-transparent bg-white text-black' : 'border-white/20 text-gray-400 group-hover:border-white group-hover:text-white'}`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      
                      <span className="text-lg font-medium tracking-wide z-10 text-gray-200 group-hover:text-white">{option}</span>
                      
                      {/* Subtle Hover Gradient Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
                    </button>
                );
              })}
           </div>

        </div>
      ) : (
        // --- 3. VICTORY SCREEN (End of Duel) ---
        <div className="text-center animate-[scaleIn_0.5s] p-12 bg-black/40 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl">
           <div className="text-7xl mb-6 filter drop-shadow-[0_0_25px_rgba(234,179,8,0.5)]">🏆</div>
           <h2 className="text-5xl font-bold mb-4 text-white">Duel Complete</h2>
           <p className="text-gray-400 tracking-widest uppercase text-sm mb-12">Calculating Final Metrics...</p>
           
           <div className="flex justify-center gap-16 mb-12">
               <div className="text-center">
                   <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Accuracy</p>
                   <p className="text-5xl font-bold text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">{Math.round((myScore / questions.length) * 100)}%</p>
               </div>
               <div className="text-center">
                   <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Snitch Caught</p>
                   <p className="text-5xl font-bold text-white">{myScore > opponentScore ? "YES" : "NO"}</p>
               </div>
           </div>

           <button onClick={() => setView('menu')} className="px-12 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]">
             Return to Lobby
           </button>
        </div>
      )}

    </div>
  );
};

export default GameArena;