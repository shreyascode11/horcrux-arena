import React from 'react';
// Assuming Icons.js exists in the same folder
import { IconScroll } from './Icons';

// Fallback if Icons are missing
const LocalIconScroll = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
);

const quotes = [
  "It matters not what someone is born, but what they grow to be.",
  "Happiness can be found even in the darkest of times.",
  "We are only as strong as we are united.",
  "It takes a great deal of bravery to stand up to our enemies.",
  "Every great wizard in history has started out as nothing more than we are now."
];

const monthlyProgress = [
  { month: "Jan", solved: 22 },
  { month: "Feb", solved: 35 },
  { month: "Mar", solved: 41 },
  { month: "Apr", solved: 18 },
  { month: "May", solved: 50 }
];

const Dashboard = ({ username, setView, open1v1Setup }) => {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  const maxSolved = Math.max(...monthlyProgress.map(m => m.solved));

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
          onClick={() => setView("join")}
          className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-bold hover:scale-105 transition mt-6 md:mt-0 flex items-center gap-2 uppercase tracking-widest"
        >
          Enter Code ✨
        </button>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-12 gap-8">

        {/* 1v1 CARD */}
        <div onClick={open1v1Setup} className="col-span-12 lg:col-span-7 bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-10 cursor-pointer hover:scale-[1.02] transition hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative z-10">
              <p className="text-gray-500 font-bold tracking-[0.2em] text-xs uppercase mb-2">Duelling Club</p>
              <h2 className="text-4xl font-bold text-white mb-4">Wizard’s Duel</h2>
              <p className="text-gray-400 max-w-md">Face a random wizard and test your spellcraft.</p>
          </div>
        </div>

        {/* SQUAD CARD */}
        <div className="col-span-12 lg:col-span-5 bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-10 cursor-pointer hover:scale-[1.02] transition hover:border-green-500/50 hover:shadow-[0_0_40px_rgba(34,197,94,0.15)] relative overflow-hidden group" onClick={() => setView("host")}>
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative z-10">
              <p className="text-gray-500 font-bold tracking-[0.2em] text-xs uppercase mb-2">Order of the Phoenix</p>
              <h2 className="text-4xl font-bold text-white mb-4">Squad Battle</h2>
              <p className="text-gray-400">Assemble allies. Enter a private magical skirmish.</p>
          </div>
        </div>

        {/* MONTHLY PROGRESS */}
        <div className="col-span-12 lg:col-span-4 bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-8 hover:scale-[1.02] transition">
          <h3 className="text-lg font-bold text-white mb-4">Monthly Progress</h3>
          <div className="space-y-3">
            {monthlyProgress.map((m, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1 text-gray-400">
                  <span>{m.month}</span>
                  <span className="text-purple-300 font-bold">{m.solved}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded overflow-hidden">
                  <div className="h-2 bg-purple-500 rounded transition-all" style={{ width: `${(m.solved / maxSolved) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI INSIGHT */}
        <div className="col-span-12 lg:col-span-4 bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-8 hover:scale-[1.02] transition">
          <h3 className="text-lg font-bold text-white mb-2">AI Insight</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Your spell accuracy excels in Charms but weakens in Dark Arts.</p>
        </div>

        {/* GRIMOIRE CARD (FIXED ALIGNMENT) */}
        <div 
          onClick={() => setView('grimoire')} 
          className="col-span-12 lg:col-span-4 bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-8 cursor-pointer transition-all duration-500 group hover:scale-[1.02] hover:border-yellow-600/50 hover:shadow-[0_0_40px_rgba(234,179,8,0.2)] relative overflow-hidden"
          style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
        >
           {/* Yellow Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          {/* Changed 'justify-center' to 'flex-col' only to align top-left */}
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