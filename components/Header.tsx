
import React from 'react';

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const PulseIcon: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => (
    <svg viewBox="0 0 100 40" className={`w-12 h-6 sm:w-16 sm:h-8 text-race-red ${isPlaying ? 'opacity-100' : 'opacity-70'}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Base Road Path */}
        <path d="M0 20 H20 L25 10 L30 30 L35 15 L40 25 L45 20 H50 L55 25 L60 10 L65 30 L70 5 L75 20 H100" stroke="#333" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Dashed Line */}
        <path d="M0 20 H20 L25 10 L30 30 L35 15 L40 25 L45 20 H50 L55 25 L60 10 L65 30 L70 5 L75 20 H100" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


interface HeaderProps {
  currentLap: number;
  totalLaps: number;
  elapsedTime: number;
  isPlaying: boolean;
  onBack: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentLap, totalLaps, elapsedTime, isPlaying, onBack }) => {
  return (
    <header className="bg-dark-panel border border-medium-gray/30 rounded-lg p-3 flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
      <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-4 w-full sm:w-auto">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-medium-gray/20 text-medium-gray hover:text-white transition-colors group"
          title="Exit Session"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        </button>
        <PulseIcon isPlaying={isPlaying} />
        <h1 className="font-orbitron text-xl sm:text-2xl md:text-3xl font-bold tracking-wider uppercase whitespace-nowrap">
          <span className="text-white">PODIUM</span> <span className="text-race-red">PULSE</span>
        </h1>
      </div>
      <div className="flex items-center justify-between sm:justify-end space-x-4 sm:space-x-8 text-center w-full sm:w-auto">
        <div className="flex-1 sm:flex-none">
          <div className="text-[10px] sm:text-xs text-medium-gray uppercase">Lap</div>
          <div className="text-lg sm:text-2xl font-bold">
            <span className={isPlaying ? 'text-accent-green animate-pulse-strong' : 'text-light-gray'}>{currentLap}</span>
            <span className="text-medium-gray text-sm">/{totalLaps}</span>
          </div>
        </div>
        <div className="flex-1 sm:flex-none">
          <div className="text-[10px] sm:text-xs text-medium-gray uppercase">Time</div>
          <div className="text-lg sm:text-2xl font-bold font-mono">{formatTime(elapsedTime)}</div>
        </div>
        <div className="flex items-center justify-center space-x-2 flex-1 sm:flex-none">
            <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-race-red animate-pulse' : 'bg-medium-gray'}`}></div>
            <div className={`text-lg sm:text-2xl font-bold uppercase ${isPlaying ? 'text-race-red' : 'text-medium-gray'}`}>{isPlaying ? 'LIVE' : 'PAUSED'}</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
