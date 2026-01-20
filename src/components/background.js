import React from 'react';

const Background = ({ theme }) => {
  // --- THEME PALETTES ---
  // Define the colors for each "Folder" / Section of your app here.
  const themes = {
    red:    { primary: '#ff0055', secondary: 'bg-red-900/20' },    // Login (Sith/Dark)
    blue:   { primary: '#3b82f6', secondary: 'bg-blue-900/20' },   // Dashboard (Tech/System)
    purple: { primary: '#a855f7', secondary: 'bg-purple-900/20' }, // Squad Host (Mystical)
    green:  { primary: '#22c55e', secondary: 'bg-green-900/20' },  // Game/Lobby (Matrix)
    gold:   { primary: '#eab308', secondary: 'bg-yellow-900/20' }  // Grimoire (Ancient)
  };

  // Select the active theme (Default to Red if undefined)
  const active = themes[theme] || themes.red;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none transition-all duration-1000 ease-in-out">
      
      {/* 1. Deep Void Base (Constant) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0518] via-black to-[#1a0b2e]"></div>

      {/* 2. Ambient Glow (Dynamic Color) */}
      <div className={`absolute bottom-0 right-0 w-[500px] h-[500px] blur-[120px] rounded-full mix-blend-screen transition-all duration-1000 ${active.secondary}`}></div>

      {/* 3. Rotating Light Shafts (Dynamic Color) */}
      <div className="absolute inset-0 opacity-50 mix-blend-screen animate-pulse">
           <div 
             className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-[spin_8s_linear_infinite] blur-[100px] transition-all duration-1000"
             style={{ background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${active.primary} 20deg, transparent 60deg)` }}
           ></div>
      </div>

      {/* 4. Film Grain Texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
    </div>
  );
};

export default Background;