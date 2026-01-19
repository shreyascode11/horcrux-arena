import React from 'react';
import { IconSword, IconUsers, IconScroll, IconLogout, IconArrowRight } from './Icons';

const Dashboard = ({ username, setView, open1v1Setup }) => {
  return (
    <div className="w-full max-w-7xl animate-[slideUp_0.8s_cubic-bezier(0.16,1,0.3,1)]">
       <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-white/5 pb-8">
          <div className="relative">
             <p className="text-gray-500 font-thin tracking-[0.3em] text-xs uppercase mb-2">Authenticated</p>
             <h2 className="text-6xl md:text-7xl font-bold tracking-tighter text-white">
                Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">{username}</span>
             </h2>
          </div>
          <button onClick={() => setView('login')} className="mt-6 md:mt-0 group flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 hover:border-red-500/50 hover:bg-red-500/5 transition-all duration-300">
              <span className="text-xs font-bold tracking-widest text-gray-400 group-hover:text-red-400 uppercase transition-colors">Logout</span>
              <div className="text-gray-600 group-hover:text-red-500 transition-colors"><IconLogout /></div>
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* 1v1 CARD */}
           <div onClick={open1v1Setup} className="group relative h-[450px] bg-black/40 border border-white/5 rounded-3xl p-10 cursor-pointer overflow-hidden transition-all duration-500 hover:border-red-600/50 hover:shadow-[0_0_50px_rgba(220,38,38,0.2)]">
              <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 text-gray-400 group-hover:text-red-400 group-hover:bg-red-500/10 group-hover:scale-110 transition-all duration-500 border border-white/5 group-hover:border-red-500/30"><IconSword /></div>
                      <h3 className="text-4xl font-bold mb-4 tracking-tight group-hover:text-red-100 transition-colors">1 vs 1 Duel</h3>
                      <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-[80%] group-hover:text-gray-400">Enter the void. Match with a random wizard.</p>
                  </div>
                  <div className="flex items-center gap-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                      <span className="text-xs font-bold tracking-[0.3em] uppercase text-red-500">Initialize</span>
                      <div className="text-red-500"><IconArrowRight /></div>
                  </div>
              </div>
           </div>

           {/* SQUAD CARD */}
           <div onClick={() => setView('host')} className="group relative h-[450px] bg-black/40 border border-white/5 rounded-3xl p-10 cursor-pointer overflow-hidden transition-all duration-500 hover:border-purple-600/50 hover:shadow-[0_0_50px_rgba(147,51,234,0.2)]">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 text-gray-400 group-hover:text-purple-400 group-hover:bg-purple-500/10 group-hover:scale-110 transition-all duration-500 border border-white/5 group-hover:border-purple-500/30"><IconUsers /></div>
                      <h3 className="text-4xl font-bold mb-4 tracking-tight group-hover:text-purple-100 transition-colors">Squad Battle</h3>
                      <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-[80%] group-hover:text-gray-400">Create a private sanctuary. Invite allies via code.</p>
                  </div>
                  <div className="flex items-center gap-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                      <span className="text-xs font-bold tracking-[0.3em] uppercase text-purple-500">Create Room</span>
                      <div className="text-purple-500"><IconArrowRight /></div>
                  </div>
              </div>
           </div>

           {/* GRIMOIRE CARD */}
           <div className="group relative h-[450px] bg-black/40 border border-white/5 rounded-3xl p-10 cursor-pointer overflow-hidden transition-all duration-500 hover:border-yellow-600/50 hover:shadow-[0_0_50px_rgba(234,179,8,0.2)]">
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 text-gray-400 group-hover:text-yellow-400 group-hover:bg-yellow-500/10 group-hover:scale-110 transition-all duration-500 border border-white/5 group-hover:border-yellow-500/30"><IconScroll /></div>
                      <h3 className="text-4xl font-bold mb-4 tracking-tight group-hover:text-yellow-100 transition-colors">Grimoire</h3>
                      <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-[80%] group-hover:text-gray-400">Access your archives. Review past battles.</p>
                  </div>
                  <div className="flex items-center gap-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                      <span className="text-xs font-bold tracking-[0.3em] uppercase text-yellow-500">Open Archives</span>
                      <div className="text-yellow-500"><IconArrowRight /></div>
                  </div>
              </div>
           </div>
       </div>
    </div>
  );
};

export default Dashboard;