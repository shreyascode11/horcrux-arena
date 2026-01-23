import React from 'react';
// Assuming Icons.js exists in the same folder
import { IconSword, IconUsers, IconLogout, IconArrowRight, IconScroll } from './Icons';

// Fallback if Icons are missing to prevent crash
const LocalIconScroll = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
);
const LocalIconArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);

const quotes = [
  "It matters not what someone is born, but what they grow to be.",
  "Happiness can be found even in the darkest of times.",
  "We are only as strong as we are united.",
  "It takes a great deal of bravery to stand up to our enemies.",
  "Every great wizard in history has started out as nothing more than we are now."
];

// Pass 'questionsSolved' as a new prop
const Dashboard = ({ username, setView, open1v1Setup, questionsSolved = 0 }) => {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  
  // --- REORDERED MONTHS (Jan at Top) ---
  const monthlyProgress = [
    { month: "Jan", solved: questionsSolved }, // <--- LIVE SCORE AT TOP
    { month: "Feb", solved: 0 },
    { month: "Mar", solved: 0 },
    { month: "Apr", solved: 0 },
    { month: "May", solved: 0 }
  ];

  const maxGoal = 20; // Visual Scale

  // Use imported icons if available, else local fallback
  const ScrollIcon = IconScroll || LocalIconScroll;
  const ArrowIcon = IconArrowRight || LocalIconArrowRight;

  return (
    <div className="w-full h-full animate-fade-in max-w-7xl">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/5 pb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-widest text-purple-300">WELCOME</h2>
          <h1 className="text-7xl font-extrabold tracking-tight mt-2 text-white">{username}</h1>
          <p className="italic text-purple-300 mt-4 max-w-xl">“{quote}”</p>
          <p className="text-gray-300 mt-6 font-bold">Rank: <span className="text-purple-400 font-extrabold">Adept Wizard</span></p>
        </div>

        {/* JOIN BUTTON */}
        <button 
          onClick={open1v1Setup}
          className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-bold hover:scale-105 transition mt-6 md:mt-0 flex items-center gap-2 uppercase tracking-widest"
        >
          Join Match ✨
        </button>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-12 gap-8">

        {/* 1. WIZARD'S DUEL */}
        <div onClick={open1v1Setup} className="col-span-12 lg:col-span-7 bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-10 cursor-pointer hover:scale-[1.02] transition hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative z-10">
              <p className="text-gray-500 font-bold tracking-[0.2em] text-xs uppercase mb-2">Duelling Club</p>
              <h2 className="text-4xl font-bold text-white mb-4">Wizard’s Duel</h2>
              <p className="text-gray-400 max-w-md">Face a random wizard and test your spellcraft.</p>
          </div>
        </div>

        {/* 2. SQUAD BATTLE */}
        <div className="col-span-12 lg:col-span-5 bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-10 cursor-pointer hover:scale-[1.02] transition hover:border-green-500/50 hover:shadow-[0_0_40px_rgba(34,197,94,0.15)] relative overflow-hidden group" onClick={() => setView("host")}>
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative z-10">
              <p className="text-gray-500 font-bold tracking-[0.2em] text-xs uppercase mb-2">Order of the Phoenix</p>
              <h2 className="text-4xl font-bold text-white mb-4">Squad Battle</h2>
              <p className="text-gray-400">Assemble allies. Enter a private magical skirmish.</p>
          </div>
        </div>

        {/* 3. MONTHLY PROGRESS (REORDERED: JAN TOP) */}
        <div className="col-span-12 lg:col-span-4 bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-8 hover:scale-[1.02] transition">
          <h3 className="text-lg font-bold text-white mb-4">Monthly Progress</h3>
          <div className="space-y-3">
            {monthlyProgress.map((m, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1 text-gray-400">
                  <span>{m.month}</span>
                  <span className={`font-bold ${m.month === 'Jan' ? 'text-green-400' : 'text-purple-300'}`}>
                    {m.solved}
                  </span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded overflow-hidden">
                  <div 
                    className={`h-2 rounded transition-all duration-1000 ${m.month === 'Jan' ? 'bg-green-500' : 'bg-purple-500'}`} 
                    style={{ width: `${Math.min((m.solved / maxGoal) * 100, 100)}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. AI INSIGHT */}
        <div 
          onClick={() => setView('analysis')} 
          className="col-span-12 lg:col-span-4 bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-8 hover:scale-[1.02] transition cursor-pointer hover:border-blue-500/30 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">AI Insight</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Click here to analyze your learning gaps and get career recommendations.
            </p>
            <div className="mt-4 flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest">
              <span>Open Analysis</span> <ArrowIcon />
            </div>
          </div>
        </div>

        {/* 5. GRIMOIRE CARD */}
        <div 
          onClick={() => setView('grimoire')} 
          className="col-span-12 lg:col-span-4 bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-8 cursor-pointer transition-all duration-500 group hover:scale-[1.02] hover:border-yellow-600/50 hover:shadow-[0_0_40px_rgba(234,179,8,0.2)] relative overflow-hidden"
          style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
        >
          {/* Yellow Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="relative z-10 flex flex-col h-full">
            {/* Title */}
            <h3 className="text-4xl font-bold text-white mb-4 group-hover:text-yellow-100 transition-colors">Grimoire</h3>
            
            {/* Description */}
            <p className="text-gray-400 leading-relaxed group-hover:text-gray-300">
              Access your archives. Review past battles and magical growth.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;