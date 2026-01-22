import React, { useState } from "react";

function Sidebar({ username, setView, onLogout }) {
  const [open, setOpen] = useState(false);

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
        className={`fixed left-0 top-0 h-full w-64 bg-black/80 backdrop-blur-xl border-r border-white/10 z-50 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="px-6 py-6 border-b border-white/10">
          <h1 className="text-2xl font-extrabold tracking-widest text-white">
            HORCRUX
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Welcome, {username}
          </p>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
          <SidebarItem label="🏠 Dashboard" onClick={() => setView("menu")} />
          <SidebarItem label="🏆 Rank Overview" onClick={() => setView("rank")} />
          <SidebarItem label="📜 Match History" onClick={() => setView("history")} />
          <SidebarItem label="🤖 AI Analysis" onClick={() => setView("analysis")} />
        </nav>

        {/* FOOTER */}
        <div className="px-4 py-6 border-t border-white/10 flex flex-col gap-3">
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition font-semibold"
          >
            🚪 Logout
          </button>

          <button
            onClick={() => setView("settings")}
            className="w-full text-left px-4 py-3 rounded-lg text-gray-400 hover:bg-white/10 transition"
          >
            ⚙️ Settings
          </button>
        </div>
      </aside>
    </>
  );
}

const SidebarItem = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left px-4 py-3 rounded-lg text-white hover:bg-white/10 transition"
  >
    {label}
  </button>
);

export default Sidebar;
