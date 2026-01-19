import React, { useRef } from 'react';
import { IconUpload } from './Icons';

const SquadHost = ({ setView, inputType, setInputType, topic, setTopic, handleFileClick, handleFileChange, selectedFile, createRoom, fileInputRef }) => {
  return (
    <div className="w-full max-w-2xl bg-black/60 backdrop-blur-xl border border-white/10 p-12 rounded-2xl animate-[fadeIn_0.5s_ease-out] shadow-2xl">
      <button onClick={() => setView('menu')} className="mb-8 text-xs font-bold tracking-widest text-gray-500 hover:text-white uppercase">← Back</button>
      
      <h2 className="text-4xl font-bold mb-2">Summon a Room</h2>
      <p className="text-gray-500 font-thin mb-12 text-sm tracking-wide">CONFIGURE YOUR BATTLE ARENA</p>
      
      <div className="flex gap-6 mb-12">
          <button onClick={() => setInputType('topic')} className={`flex-1 py-4 rounded-lg border-b-2 text-sm font-bold tracking-[0.2em] transition-all uppercase ${inputType === 'topic' ? 'border-pink-500 text-white' : 'border-white/10 text-gray-600 hover:text-gray-400'}`}>Topic</button>
          <button onClick={() => setInputType('file')} className={`flex-1 py-4 rounded-lg border-b-2 text-sm font-bold tracking-[0.2em] transition-all uppercase ${inputType === 'file' ? 'border-pink-500 text-white' : 'border-white/10 text-gray-600 hover:text-gray-400'}`}>Upload PDF</button>
      </div>

      <div className="mb-16">
          {inputType === 'topic' ? (
            <input type="text" placeholder="e.g. Dark Arts, ReactJS..." className="w-full bg-transparent border-b border-white/20 p-4 text-2xl font-thin text-white focus:border-pink-500 outline-none placeholder-gray-700 transition-colors" value={topic} onChange={(e) => setTopic(e.target.value)} />
          ) : (
            <div onClick={handleFileClick} className="border border-dashed border-white/20 hover:border-pink-500/50 rounded-xl p-12 text-center cursor-pointer transition-all group">
              <div className="flex justify-center mb-4 text-gray-600 group-hover:text-pink-500 transition-colors"><IconUpload /></div>
              <p className="text-sm font-bold tracking-widest uppercase text-gray-500 group-hover:text-white transition-colors">{selectedFile ? selectedFile.name : "Click to Upload Document"}</p>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept=".pdf,.doc,.docx" />
            </div>
          )}
      </div>
      
      <button onClick={createRoom} className="w-full py-5 bg-white text-black font-bold tracking-[0.3em] rounded-full hover:bg-pink-200 transition-colors uppercase">Create Room</button>
    </div>
  );
};

export default SquadHost;