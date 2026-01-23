import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:3001");

const AIAnalysis = () => {
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

  return (
    <div className="min-h-screen w-full p-8 flex flex-col items-center animate-[fadeIn_0.5s]">
      
      {/* HEADER */}
      <h1 className="text-5xl font-bold text-white mb-2">AI Career Guidance</h1>
      <p className="text-gray-400 mb-12">Powered by Multi-Agent Profiling System</p>

      {!careerData ? (
        // --- INPUT FORM ---
        <div className="w-full max-w-2xl bg-[#0f0f0f] border border-white/10 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-purple-400 text-xs font-bold uppercase tracking-widest">Full Name</label>
              <input 
                type="text" 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white mt-2 focus:border-purple-500 outline-none"
                placeholder="e.g. arnadeep"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-green-400 text-xs font-bold uppercase tracking-widest">Key Skills</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white mt-2 focus:border-green-500 outline-none"
                  placeholder="e.g. Python, Math, Logic"
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                />
              </div>
              <div>
                <label className="text-blue-400 text-xs font-bold uppercase tracking-widest">Interests</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white mt-2 focus:border-blue-500 outline-none"
                  placeholder="e.g. Robotics, Space"
                  onChange={(e) => setFormData({...formData, interests: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="text-yellow-400 text-xs font-bold uppercase tracking-widest">Academic Grades / SGPA</label>
              <input 
                type="text" 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white mt-2 focus:border-yellow-500 outline-none"
                placeholder="e.g. 9.9 SGPA in CSE"
                onChange={(e) => setFormData({...formData, grades: e.target.value})}
              />
            </div>

            <button 
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-white uppercase tracking-widest hover:scale-105 transition-transform"
            >
              {loading ? "AI Agents Analyzing..." : "Generate Career Roadmap"}
            </button>
          </form>
        </div>
      ) : (
        // --- RESULTS DISPLAY ---
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LEFT: CAREER MATCHES */}
          <div className="space-y-6">
             <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4">Top Career Matches</h2>
             {careerData.recommended_careers.map((job, i) => (
               <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-green-400">{job.title}</h3>
                    <span className="bg-green-500/20 text-green-300 text-xs font-bold px-2 py-1 rounded">{job.match_score} Match</span>
                  </div>
                  <p className="text-gray-400 text-sm">{job.reason}</p>
               </div>
             ))}
             
             <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-2xl">
               <h3 className="text-blue-400 font-bold mb-2">Market Outlook</h3>
               <p className="text-gray-300 text-sm">{careerData.market_outlook}</p>
             </div>
          </div>

          {/* RIGHT: ROADMAP */}
          <div className="bg-[#0f0f0f] border border-white/10 p-8 rounded-3xl">
             <h2 className="text-2xl font-bold text-white mb-6">Your Personalized Roadmap</h2>
             
             <div className="space-y-0 relative border-l-2 border-purple-500/30 ml-3">
               {careerData.roadmap.map((step, i) => (
                 <div key={i} className="mb-8 ml-6 relative">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-purple-500 border-4 border-black"></div>
                    <h4 className="text-white font-bold text-lg">Step {i+1}</h4>
                    <p className="text-gray-400 text-sm mt-1">{step}</p>
                 </div>
               ))}
             </div>

             <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
               <p className="text-yellow-500 text-xs font-bold uppercase tracking-widest mb-1">Recommended Education</p>
               <p className="text-white font-bold">{careerData.education_path}</p>
             </div>
             
             <button onClick={() => setCareerData(null)} className="mt-8 w-full py-3 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/5">
               Analyze Another Profile
             </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default AIAnalysis;