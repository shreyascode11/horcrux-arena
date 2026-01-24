import React, { useState, useRef, useEffect } from 'react';
import { IconLogout } from './Icons';

const Sidebar = ({ username, setUsername, avatarSeed, setAvatarSeed, setView, view, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(username);
  const inputRef = useRef(null);

  // Focus input automatically when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSaveName = () => {
    if (editName.trim()) {
      setUsername(editName);
    } else {
      setEditName(username); // Revert if empty
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSaveName();
    if (e.key === 'Escape') {
      setEditName(username);
      setIsEditing(false);
    }
  };

  // Helper for active button styles
  const getButtonClass = (targetView, colorClass) => {
    const isActive = view === targetView;
    const baseClass = "flex items-center gap-4 p-4 rounded-xl transition-all duration-300 relative group overflow-hidden whitespace-nowrap";
    
    if (isActive) {
      return `${baseClass} ${colorClass} text-white shadow-[0_0_20px_rgba(255,255,255,0.2)]`;
    }
    return `${baseClass} text-gray-400 hover:text-white hover:bg-white/10`;
  };

  const fontStyle = { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" };

  return (
    // --- MAIN CONTAINER WITH HELVETICA FONT ---
    <div 
      className="fixed left-0 top-0 h-full w-24 hover:w-80 bg-black/40 backdrop-blur-2xl border-r border-white/10 flex flex-col py-8 z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group overflow-hidden shadow-2xl"
      style={fontStyle}
    >
      
      {/* 1. AVATAR & NAME SECTION */}
      <div className="mb-10 flex flex-col items-center w-full px-4 transition-all duration-500">
         
         {/* Avatar (Changed to 'Avataaars' style) */}
         <div 
           className="relative w-12 h-12 group-hover:w-20 group-hover:h-20 transition-all duration-500 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-[2px] cursor-pointer shadow-[0_0_30px_rgba(168,85,247,0.3)]"
           onClick={() => setAvatarSeed(Math.random().toString())}
           title="Click to change Avatar"
         >
            <img 
               src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`} 
               alt="avatar" 
               className="w-full h-full rounded-full bg-black object-cover"
            />
            {/* Edit Icon Overlay */}
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
               <span className="text-[10px] text-white font-bold">CHANGE</span>
            </div>
         </div>
         
         {/* Name Editor */}
         <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 delay-100 flex flex-col items-center mt-4 w-full">
            {isEditing ? (
              <div className="relative w-full">
                <input
                  ref={inputRef}
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={handleSaveName}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-white/10 border border-purple-500/50 rounded-lg py-2 px-3 text-center text-white font-bold outline-none focus:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all"
                />
                <span className="text-[10px] text-gray-400 mt-1 block text-center">Press Enter to Save</span>
              </div>
            ) : (
              <div 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 cursor-pointer hover:bg-white/5 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-white/10"
              >
                <h3 className="text-xl font-bold text-white truncate max-w-[180px]">{username}</h3>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
              </div>
            )}
            {/* Removed Adept Wizard Text */}
         </div>
      </div>

      {/* 2. NAVIGATION BUTTONS (Removed History) */}
      <div className="flex-1 flex flex-col gap-3 w-full px-3">
         
         {/* DASHBOARD */}
         <button onClick={() => setView('menu')} className={getButtonClass('menu', 'bg-purple-600')}>
            <div className="min-w-[24px]"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg></div>
            <span className="font-bold tracking-widest text-xs uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">Dashboard</span>
         </button>

         {/* RANKINGS */}
         <button onClick={() => setView('rank')} className={getButtonClass('rank', 'bg-yellow-500')}>
            <div className="min-w-[24px]"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0V5.625a1.125 1.125 0 00-1.125-1.125h-2.25a1.125 1.125 0 00-1.125 1.125v9.75" /></svg></div>
            <span className="font-bold tracking-widest text-xs uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">Rankings</span>
         </button>

         {/* CAREER */}
         <button onClick={() => setView('career')} className={getButtonClass('career', 'bg-blue-600')}>
            <div className="min-w-[24px]"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></div>
            <span className="font-bold tracking-widest text-xs uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">Career Guidance</span>
         </button>

      </div>

      {/* LOGOUT */}
      <button 
        onClick={onLogout} 
        className="mx-3 mb-4 p-4 rounded-xl text-red-500 hover:bg-red-500/20 hover:text-white transition-all flex items-center gap-4 overflow-hidden whitespace-nowrap"
        title="Logout"
      >
         <div className="min-w-[24px]"><IconLogout /></div>
         <span className="font-bold tracking-widest text-xs uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">Logout</span>
      </button>

    </div>
  );
};

export default Sidebar;