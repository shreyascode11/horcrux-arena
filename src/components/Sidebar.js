import React, { useState } from 'react';

// --- ICONS ---
const IconDashboard = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const IconBriefcase = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
// NEW ICON FOR RANK
const IconTrophy = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M12 15.4V22"></path><path d="M12 6a4 4 0 0 0-4 4v2a4 4 0 0 0 4 4 4 4 0 0 0 4-4v-2a4 4 0 0 0-4-4Z"></path></svg>;
const IconSettings = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const IconLogout = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const IconEdit = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconRefresh = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/></svg>;

const Sidebar = ({ username, setUsername, setView, onLogout, avatarSeed, setAvatarSeed }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(username);

  const handleEditClick = () => {
    setTempName(username);
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (tempName.trim()) {
      setUsername(tempName); 
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSaveClick();
  };

  const shuffleAvatar = (e) => {
    e.stopPropagation(); 
    const randomSeed = Math.random().toString(36).substring(7);
    setAvatarSeed(randomSeed);
  };

  return (
    // DARK LIQUID GLASS EFFECT
    <div 
      className={`fixed left-0 top-0 h-screen bg-black/20 backdrop-blur-xl border-r border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] z-50 flex flex-col justify-between p-5 transition-all duration-300 ease-in-out group overflow-hidden ${isEditing ? 'w-80' : 'w-24 hover:w-80'}`}
    >
      
      {/* --- TOP SECTION --- */}
      <div className="flex flex-col w-full">
        
        {/* LOGO & AVATAR ROW */}
        <div className="flex items-center gap-4 mb-12 pl-1">
          
          {/* AVATAR */}
          <div 
            onClick={shuffleAvatar}
            className="relative flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 cursor-pointer hover:scale-105 transition-transform shadow-lg"
            title="Click to shuffle avatar"
          >
             <img 
               src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed || username}`} 
               alt="avatar" 
               className="w-full h-full rounded-full bg-black/50"
             />
             <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <IconRefresh />
             </div>
          </div>

          {/* APP TITLE */}
          <span className="text-xl font-bold text-white tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden delay-75 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            HORCRUX
          </span>
        </div>

        {/* PROFILE SECTION */}
        <div className="mb-10 pl-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 whitespace-nowrap overflow-hidden">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Welcome,</p>
            
            <div className="flex items-center gap-2 h-8">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="bg-white/10 text-white text-sm font-bold p-1 rounded w-32 outline-none border border-purple-500 backdrop-blur-md"
                  />
                  <button onClick={handleSaveClick} className="text-green-400 hover:text-green-300">
                    <IconCheck />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group/edit cursor-pointer" onClick={handleEditClick}>
                  <h3 className="text-white font-bold text-lg truncate max-w-[140px] drop-shadow-md">{username}</h3>
                  <button className="text-gray-500 hover:text-purple-400 opacity-0 group-hover/edit:opacity-100 transition-opacity">
                    <IconEdit />
                  </button>
                </div>
              )}
            </div>
        </div>

        {/* --- NAVIGATION MENU --- */}
        <nav className="space-y-4 w-full">
          
          {/* Dashboard */}
          <button 
            onClick={() => setView('menu')}
            className="w-full flex items-center gap-6 px-2 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            <div className="flex-shrink-0 drop-shadow-lg"><IconDashboard /></div>
            <span className="text-sm font-bold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap delay-75">Dashboard</span>
          </button>

          {/* Rank Overview (NEW) */}
          <button 
            onClick={() => setView('rank')}
            className="w-full flex items-center gap-6 px-2 py-3 text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-xl transition-all"
          >
            <div className="flex-shrink-0 drop-shadow-lg"><IconTrophy /></div>
            <span className="text-sm font-bold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap delay-75">Rank Overview</span>
          </button>

          {/* Career Guidance */}
          <button 
            onClick={() => setView('analysis')}
            className="w-full flex items-center gap-6 px-2 py-3 text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all"
          >
            <div className="flex-shrink-0 drop-shadow-lg"><IconBriefcase /></div>
            <span className="text-sm font-bold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap delay-75">Career Guidance</span>
          </button>

        </nav>
      </div>

      {/* --- BOTTOM SECTION --- */}
      <div className="space-y-2 pt-6 border-t border-white/10 w-full">
        <button className="w-full flex items-center gap-6 px-2 py-3 text-gray-400 hover:text-white transition-colors">
           <div className="flex-shrink-0"><IconSettings /></div>
           <span className="text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap delay-75">Settings</span>
        </button>

        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-6 px-2 py-3 text-red-400/80 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <div className="flex-shrink-0"><IconLogout /></div>
          <span className="text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap delay-75">Logout</span>
        </button>
      </div>

    </div>
  );
};

export default Sidebar;