import React, { useState, useEffect } from 'react';

// --- MOCK QUESTIONS (Legacy Support) ---
const MOCK_QUESTIONS = [
  { id: 1, text: "Which spell disarms an opponent?", options: ["Avada Kedavra", "Expelliarmus", "Lumos", "Accio"], correct: 1 },
  { id: 2, text: "What is the primary key in React lists?", options: ["id", "key", "index", "ref"], correct: 1 },
];

const GameArena = ({ socket, roomData, username, setView, onGameEnd }) => {
  // If roomData has questions, use them. Otherwise, use MOCK.
  const [questions, setQuestions] = useState(
    roomData?.questions && roomData.questions.length > 0 
      ? roomData.questions 
      : MOCK_QUESTIONS
  );
  
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null); 
  const [answerStatus, setAnswerStatus] = useState(null); 

  const opponentName = roomData?.players.find(p => p.username !== username)?.username || "Rival";

  // --- THE FIX IS HERE ---
  const handleAnswer = (index) => {
    if (selectedOption !== null) return; 

    setSelectedOption(index);
    
    const currentQuestion = questions[currentQIndex];
    const selectedText = currentQuestion.options[index];

    // 1. Get the correct answer (Handles both 'correct' index and 'correctAnswer' text)
    const correctAnswerData = currentQuestion.correctAnswer !== undefined 
      ? currentQuestion.correctAnswer 
      : currentQuestion.correct;

    let isCorrect = false;

    // 2. SMART CHECK:
    if (typeof correctAnswerData === 'number') {
      // Logic for Mock Data (Index comparison)
      isCorrect = index === correctAnswerData;
    } else {
      // Logic for AI Data (String comparison)
      // We trim whitespace and ignore case to be safe
      isCorrect = String(selectedText).trim().toLowerCase() === String(correctAnswerData).trim().toLowerCase();
    }

    if (isCorrect) {
      setAnswerStatus('correct');
      setMyScore(prev => prev + 1);
    } else {
      setAnswerStatus('wrong');
      // console.log("Wrong! You clicked:", selectedText, "Expected:", correctAnswerData); // Debugging
    }

    // Delay to show animation
    setTimeout(() => {
      setSelectedOption(null);
      setAnswerStatus(null);
      
      if (currentQIndex + 1 < questions.length) {
        setCurrentQIndex(prev => prev + 1);
      } else {
        setFinished(true);
        // Update global stats if function exists
        if (onGameEnd) onGameEnd(myScore + (isCorrect ? 1 : 0));
      }
    }, 1000); 
  };

  // --- PROGRESS CALCULATION ---
  const myProgress = 5 + ((myScore / questions.length) * 87);
  const oppProgress = 5 + ((opponentScore / questions.length) * 87);

  return (
    <div className="w-full max-w-6xl animate-[fadeIn_0.5s_ease-out] flex flex-col items-center min-h-[80vh] justify-center">
      
      {/* --- HUD TRACK --- */}
      <div className="w-full relative mb-16 px-4">
         <div className="absolute inset-0 bg-gradient-to-r from-black/0 via-black/60 to-black/0 blur-xl"></div>
         <div className="relative w-full border-y border-white/10 py-12 bg-black/20 backdrop-blur-sm overflow-hidden rounded-xl">
             
             {/* FINISH LINE */}
             <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                <div className="text-4xl animate-[bounce_2s_infinite] filter drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]">⚡</div>
             </div>

             {/* TRACK LINES */}
             <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/10"></div>

             {/* PLAYER 1 */}
             <div className="absolute top-1/4 -translate-y-1/2 transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) z-10 flex items-center gap-3" style={{ left: `${myProgress}%` }}>
                 <div className="text-4xl transform -rotate-12 filter drop-shadow-[0_0_20px_rgba(34,197,94,0.6)]">🧹</div>
                 <div className="bg-black/80 border border-green-500/30 px-3 py-1 rounded-full backdrop-blur-md">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-green-400">You</span>
                 </div>
             </div>

             {/* PLAYER 2 */}
             <div className="absolute top-3/4 -translate-y-1/2 transition-all duration-1000 ease-linear z-10 flex items-center gap-3" style={{ left: `${oppProgress}%` }}>
                 <div className="text-4xl transform -rotate-12 filter drop-shadow-[0_0_20px_rgba(239,68,68,0.6)] grayscale opacity-80">🧹</div>
                 <div className="bg-black/80 border border-red-500/30 px-3 py-1 rounded-full backdrop-blur-md">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">{opponentName}</span>
                 </div>
             </div>
         </div>
      </div>

      {/* --- QUESTION CARD --- */}
      {!finished ? (
        <div className="w-full max-w-3xl relative">
           <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
              <span className="text-xs font-bold tracking-[0.3em] text-gray-500 uppercase">Question {currentQIndex + 1} / {questions.length}</span>
              <span className="text-xs font-bold tracking-[0.3em] text-green-500 uppercase animate-pulse flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span> Live Duel
              </span>
           </div>
           
           <h2 className="text-3xl md:text-5xl font-bold mb-12 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-lg min-h-[120px] flex items-center">
             {questions[currentQIndex].text}
           </h2>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions[currentQIndex].options.map((option, idx) => {
                let cardStyle = "border-white/10 hover:border-white/40 hover:bg-white/5"; 
                
                if (selectedOption === idx) {
                    if (answerStatus === 'correct') cardStyle = "border-green-500 bg-green-500/10 shadow-[0_0_30px_rgba(34,197,94,0.3)] scale-[1.02]";
                    if (answerStatus === 'wrong') cardStyle = "border-red-500 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.3)] shake-animation";
                }

                return (
                    <button 
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={selectedOption !== null}
                      className={`p-6 rounded-2xl border text-left flex items-center gap-4 transition-all duration-200 group relative overflow-hidden ${cardStyle}`}
                    >
                      <span className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs transition-colors font-bold ${selectedOption === idx ? 'border-transparent bg-white text-black' : 'border-white/20 text-gray-400 group-hover:border-white group-hover:text-white'}`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-lg font-medium tracking-wide z-10 text-gray-200 group-hover:text-white">{option}</span>
                    </button>
                );
              })}
           </div>

        </div>
      ) : (
        // --- VICTORY SCREEN ---
        <div className="text-center animate-[scaleIn_0.5s] p-12 bg-black/40 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl">
           <div className="text-7xl mb-6 filter drop-shadow-[0_0_25px_rgba(234,179,8,0.5)]">🏆</div>
           <h2 className="text-5xl font-bold mb-4 text-white">Duel Complete</h2>
           <p className="text-gray-400 tracking-widest uppercase text-sm mb-12">Session Recorded</p>
           
           <div className="flex justify-center gap-16 mb-12">
               <div className="text-center">
                   <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Accuracy</p>
                   <p className="text-5xl font-bold text-green-400">{Math.round((myScore / questions.length) * 100)}%</p>
               </div>
           </div>

           <button onClick={() => setView('menu')} className="px-12 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 hover:scale-105 transition-all">
             Return to Lobby
           </button>
        </div>
      )}

    </div>
  );
};

export default GameArena;