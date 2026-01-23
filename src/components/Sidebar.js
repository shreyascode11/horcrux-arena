import React, { useState, useRef } from "react";

function Sidebar({ username: initialUsername, setView, onLogout }) {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Profile state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    username: initialUsername,
    dob: "2000-01-01",
    rank: "Adept Wizard",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  });

  // Photo handlers
  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile({ ...profile, photo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setIsProfileModalOpen(false);
  };

  return (
    <>
      {/* INVISIBLE HOVER ZONE */}
      <div
        className="fixed left-0 top-0 h-full w-4 z-50"
        onMouseEnter={() => setOpen(true)}
      />

      {/* SIDEBAR */}
      <aside
        onMouseLeave={() => setOpen(false)}
        className={`fixed left-0 top-0 h-full w-64 bg-black/40 backdrop-blur-2xl border-r border-white/10 z-50 flex flex-col transition-all duration-500 ease-in-out shadow-[20px_0_60px_rgba(0,0,0,0.7)] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="px-6 py-8 border-b border-white/5">
          <div className="flex items-center gap-4 mb-4">
            <div
              onClick={() => setIsProfileModalOpen(true)}
              className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden cursor-pointer hover:border-pink-500 hover:scale-110 transition-all duration-300 bg-gray-900"
            >
              <img
                src={profile.photo}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="text-2xl font-black tracking-tighter text-white">
              HORCRUX
            </h1>
          </div>

          <p className="text-sm text-gray-300">Welcome, {profile.username}</p>
          <p className="text-[10px] text-pink-500 font-bold uppercase tracking-[0.2em]">
            {profile.rank}
          </p>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-4 py-8 flex flex-col gap-2">
          <SidebarItem label="🏠 Dashboard" onClick={() => setView("menu")} />
          <SidebarItem label="🏆 Rank Overview" onClick={() => setView("rank")} />
          <SidebarItem label="📜 Match History" onClick={() => setView("history")} />
          <SidebarItem label="🤖 AI Analysis" onClick={() => setView("analysis")} />
          <SidebarItem label="📖 Grimoire" onClick={() => setView("grimoire")} />
        </nav>

        {/* FOOTER */}
        <div className="px-4 py-6 border-t border-white/5 bg-white/5">
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 font-bold text-sm"
          >
            🚪 Logout
          </button>

          <button
            onClick={() => setView("settings")}
            className="w-full text-left px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 text-sm mt-2"
          >
            ⚙️ Settings
          </button>
        </div>
      </aside>

      {/* PROFILE MODAL */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-black/60 backdrop-blur-3xl border border-white/20 w-full max-w-md rounded-[2.5rem] p-10">
            <div className="flex justify-between items-center mb-8 text-white">
              <h2 className="text-2xl font-black">Edit Profile</h2>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="text-white/40 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="flex flex-col items-center">
                <div
                  onClick={handlePhotoClick}
                  className="w-28 h-28 rounded-full overflow-hidden cursor-pointer border-4 border-white/10 hover:border-pink-500/50"
                >
                  <img
                    src={profile.photo}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <input
                type="text"
                value={profile.username}
                onChange={(e) =>
                  setProfile({ ...profile, username: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white"
                placeholder="Username"
              />

              <button
                type="submit"
                className="w-full bg-pink-600 py-4 rounded-xl font-bold uppercase"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

const SidebarItem = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left px-4 py-4 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
  >
    {label}
  </button>
);

export default Sidebar;