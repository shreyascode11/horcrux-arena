import React from 'react';
import { IconArrowRight } from './Icons';

const Login = ({ username, setUsername, handleLogin }) => {
  const maxScanLength = 12; 
  const progress = Math.min(username.length / maxScanLength, 1);
  const bgPosX = `${100 - (progress * 100)}%`;

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl animate-[fadeIn_1.5s_ease-out]">
      <div className="mb-12 relative group">
          <div className="w-32 h-32 rounded-full border border-white/5 flex items-center justify-center bg-black/50 backdrop-blur-md shadow-[0_0_50px_rgba(255,255,255,0.05)]">
               <span className="text-gray-600 font-thin text-xs tracking-[0.3em]">LOGO</span>
          </div>
      </div>
      <div className="relative mb-4">
          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter select-none text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/10 drop-shadow-[0_0_15px_rgba(255,0,85,0.3)] relative z-10">HORCRUX</h1>
          <h1 aria-hidden="true" style={{ backgroundImage: 'linear-gradient(to right, transparent 30%, #ff0055 45%, #ffffff 50%, #ff0055 55%, transparent 70%)', backgroundSize: '200% auto', backgroundPosition: `${bgPosX} center`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', transition: 'background-position 0.1s linear' }} className="absolute inset-0 text-7xl md:text-9xl font-bold tracking-tighter select-none pointer-events-none z-20 mix-blend-overlay brightness-150">HORCRUX</h1>
      </div>
      <p className="text-pink-200/50 text-sm md:text-base tracking-[0.8em] font-thin uppercase mb-24">Enter the Arena</p>
      <div className="w-full max-w-md relative flex items-center">
          <input type="text" className="w-full bg-transparent border-b border-white/10 text-center text-3xl md:text-4xl py-4 font-thin text-white placeholder-white/5 focus:outline-none focus:border-pink-500/50 transition-all duration-500 pr-10" placeholder="Your Name" value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} autoFocus />
          <button onClick={handleLogin} className={`absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-pink-400 hover:scale-110 transition-all duration-500 ${username ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}><IconArrowRight /></button>
      </div>
    </div>
  );
};

export default Login;