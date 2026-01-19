import React from 'react';

const Background = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0518] via-black to-[#1a0b2e]"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-900/20 blur-[120px] rounded-full mix-blend-screen"></div>
      <div className="absolute inset-0 opacity-50 mix-blend-screen animate-pulse">
           <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg_at_50%_50%,_transparent_0deg,_#ff0055_20deg,_transparent_60deg)] animate-[spin_8s_linear_infinite] blur-[100px]"></div>
      </div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
    </div>
  );
};

export default Background;