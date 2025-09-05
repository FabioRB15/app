import React from 'react';

const MysticBackground = ({ className = "" }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Floating mystical orbs */}
      <div className="absolute top-1/4 left-1/6 w-2 h-2 bg-purple-400/60 rounded-full animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-indigo-400/60 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-2/3 left-1/3 w-1.5 h-1.5 bg-purple-300/60 rounded-full animate-pulse delay-2000"></div>
      <div className="absolute bottom-1/4 right-1/6 w-2 h-2 bg-indigo-300/60 rounded-full animate-pulse delay-3000"></div>
      <div className="absolute top-1/2 left-1/12 w-1 h-1 bg-purple-500/60 rounded-full animate-pulse delay-4000"></div>
      <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-indigo-500/60 rounded-full animate-pulse delay-500"></div>
      
      {/* Subtle gradient overlays */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 dark:from-purple-500/10 dark:to-indigo-500/10"></div>
    </div>
  );
};

export default MysticBackground;