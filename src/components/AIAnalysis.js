import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:3001");

// --- ICON COMPONENT ---
const IconArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);

const AIAnalysis = ({ setView }) => {
  // --- STATE FOR INPUT FORM ---
  const [formData, setFormData] = useState({
    name: '',
    skills: '',
    interests: '',
    grades: ''
  });

  const [loading, setLoading] = useState(false);
  const [careerData, setCareerData] = useState(null);

  // --- LISTEN FOR AI RESULTS ---
  useEffect(() => {
    socket.on("career_advice_result", (data) => {
      setCareerData(data);
      setLoading(false);
    });
    return () => socket.off("career_advice_result");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Send data to the Career Agent
    socket.emit('get_career_advice', formData);
  };

  const fontStyle = { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" };

  return (
    <div className="min-h-screen w-full p-8 flex flex-col items-center animate-[fadeIn_0.5s] relative z-10" style={fontStyle}>
      
      {/* --- RETURN BUTTON (Top Left) --- */}
      <div className="w-full max-w-6xl flex items-center justify-start mb-8">
        <button 
          onClick={() => setView('menu')}
          className="group flex items-center gap-3 text-purple-400 hover:text-purple-300 transition-colors px-2 py-2"
        >
          <div className="transform group-hover:-translate-x-1 transition-transform duration-300">
            <IconArrowLeft />
          </div>
          <span className="text-sm font-bold tracking-[0.2em] uppercase">Return</span>
        </button>
      </div>

      {/* HEADER */}
      <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight text-center drop-shadow-lg">
        Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Guidance</span>
      </h1>
      <p className="text-gray-400 mb-12 text-center max-w-lg font-medium">
        Powered by Multi-Agent Profiling System
      </p>

      {!careerData ? (
        // --- INPUT FORM (Liquid Glass Style) ---
        <div className="relative w-full max-w-2xl bg-black/30 backdrop-blur-xl border border-white/20 p-10 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] overflow-hidden">
          
          {/* Background Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div>
              <label className="text-purple-300 text-xs font-bold uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                className="w-full bg-white/5 border-2 border-white/10 rounded-xl p-4 text-white mt-2 focus:border-purple-500 focus:bg-white/10 outline-none transition-all placeholder:text-gray-500 font-bold backdrop-blur-md"
                placeholder="e.g. Harry Potter"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-blue-300 text-xs font-bold uppercase tracking-widest ml-1">Key Skills</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border-2 border-white/10 rounded-xl p-4 text-white mt-2 focus:border-blue-500 focus:bg-white/10 outline-none transition-all placeholder:text-gray-500 font-bold backdrop-blur-md"
                  placeholder="e.g. Potions, Flying"
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                />
              </div>
              <div>
                <label className="text-purple-300 text-xs font-bold uppercase tracking-widest ml-1">Interests</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border-2 border-white/10 rounded-xl p-4 text-white mt-2 focus:border-purple-500 focus:bg-white/10 outline-none transition-all placeholder:text-gray-500 font-bold backdrop-blur-md"
                  placeholder="e.g. Dark Arts"
                  onChange={(e) => setFormData({...formData, interests: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="text-blue-300 text-xs font-bold uppercase tracking-widest ml-1">Academic Grades</label>
              <input 
                type="text" 
                className="w-full bg-white/5 border-2 border-white/10 rounded-xl p-4 text-white mt-2 focus:border-blue-500 focus:bg-white/10 outline-none transition-all placeholder:text-gray-500 font-bold backdrop-blur-md"
                placeholder="e.g. Outstanding (O)"
                onChange={(e) => setFormData({...formData, grades: e.target.value})}
              />
            </div>

            {/* PRIMARY BUTTON STYLE */}
            <button 
              disabled={loading}
              className="w-full py-5 bg-white text-black rounded-xl font-bold text-lg uppercase tracking-[0.2em] hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 hover:text-white hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all duration-300 mt-8 relative overflow-hidden group"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </>
                ) : "Generate Roadmap"}
              </div>
            </button>
          </form>
        </div>
      ) : (
        // --- RESULTS DISPLAY ---
        <>
          <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            
            {/* LEFT: CAREER MATCHES (Liquid Glass Cards) */}
            <div className="space-y-6">
               <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4 pl-2">Top Career Matches</h2>
               {careerData.recommended_careers.map((job, i) => (
                 <div key={i} className="bg-black/30 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-purple-500/50 transition duration-300 group shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-center mb-3 relative z-10">
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">{job.title}</h3>
                      <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-3 py-1 rounded-full border border-purple-500/30 backdrop-blur-md">{job.match_score} Match</span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed relative z-10">{job.reason}</p>
                 </div>
               ))}
               
               {/* Market Outlook (Liquid Glass) */}
               <div className="bg-blue-900/20 backdrop-blur-md border border-blue-500/30 p-8 rounded-2xl shadow-lg relative overflow-hidden">
                 <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 blur-[50px] rounded-full pointer-events-none"></div>
                 <h3 className="text-blue-300 font-bold mb-3 tracking-widest uppercase text-xs relative z-10">Market Outlook</h3>
                 <p className="text-gray-200 text-sm leading-relaxed relative z-10">{careerData.market_outlook}</p>
               </div>
            </div>

            {/* RIGHT: ROADMAP (Liquid Glass Container) */}
            <div className="bg-black/30 backdrop-blur-xl border border-white/20 p-10 rounded-[2.5rem] relative overflow-hidden shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] h-full">
               {/* Background Glow */}
               <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>
               <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

               <h2 className="text-3xl font-bold text-white mb-10 relative z-10">Personalized <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Roadmap</span></h2>
               
               <div className="space-y-0 relative border-l-2 border-white/10 ml-3 z-10">
                 {careerData.roadmap.map((step, i) => (
                   <div key={i} className="pb-12 ml-8 relative group">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[43px] top-1 w-6 h-6 rounded-full bg-black border-4 border-white/20 group-hover:border-purple-500 transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)]"></div>
                      
                      <h4 className="text-white font-bold text-xl mb-3 group-hover:text-purple-300 transition-colors">Step {i+1}</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{step}</p>
                   </div>
                 ))}
               </div>

               <div className="mt-2 p-6 bg-white/5 border border-white/10 rounded-2xl relative z-10 backdrop-blur-md">
                 <p className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-2">Recommended Education</p>
                 <p className="text-white font-bold text-lg">{careerData.education_path}</p>
               </div>
            </div>

          </div>

          {/* --- ANALYZE ANOTHER BUTTON (Centered & Primary Style) --- */}
          <div className="w-full flex justify-center pb-16 relative z-20">
             <button 
                onClick={() => setCareerData(null)} 
                className="px-12 py-5 bg-white text-black rounded-xl font-bold text-lg uppercase tracking-[0.2em] hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 hover:text-white hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all duration-300 transform hover:scale-105"
             >
               Analyze Another Profile
             </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AIAnalysis;