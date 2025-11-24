
import React, { useState, ChangeEvent } from 'react';

const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PauseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const RestartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>;


interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  currentLap: number;
  totalLaps: number;
  onJumpToLap: (lap: number) => void;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({ isPlaying, onPlay, onPause, onRestart, speed, onSpeedChange, currentLap, totalLaps, onJumpToLap }) => {
  const handleLapChange = (e: ChangeEvent<HTMLInputElement>) => {
    onJumpToLap(Number(e.target.value));
  };
    
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-panel/95 backdrop-blur-md border-t border-race-red/50 p-2 sm:p-4 z-40 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        
        {/* Top Row on Mobile: Play/Pause & Speed */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <div className="flex items-center space-x-2">
                <button onClick={onRestart} className="p-2 rounded-full hover:bg-medium-gray/50 transition-colors text-light-gray">
                    <RestartIcon />
                </button>
                <button onClick={isPlaying ? onPause : onPlay} className="p-2 rounded-full bg-race-red text-white hover:opacity-80 transition-opacity shadow-lg shadow-race-red/30">
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>
            </div>
            
            <div className="flex items-center bg-black/30 rounded-lg p-1 sm:hidden">
                {[1, 5, 10].map((s) => (
                    <button
                        key={s}
                        onClick={() => onSpeedChange(s)}
                        className={`px-3 py-1 text-xs font-bold rounded ${speed === s ? 'bg-medium-gray text-white' : 'text-medium-gray'}`}
                    >
                        {s}x
                    </button>
                ))}
            </div>
        </div>
        
        {/* Scrubber */}
        <div className="w-full flex items-center space-x-3 px-2">
          <span className="text-[10px] sm:text-xs text-medium-gray whitespace-nowrap w-12 text-right">Lap {currentLap}</span>
          <input
            type="range"
            min="1"
            max={totalLaps}
            value={currentLap}
            onChange={handleLapChange}
            className="flex-grow h-1.5 bg-medium-gray/30 rounded-lg appearance-none cursor-pointer accent-race-red"
          />
          <span className="text-[10px] sm:text-xs text-medium-gray whitespace-nowrap w-8">/{totalLaps}</span>
        </div>

        {/* Desktop Speed Controls */}
        <div className="hidden sm:flex items-center space-x-1">
            <span className="text-xs text-medium-gray mr-2">Speed:</span>
            {[1, 2, 5, 10].map((s) => (
                <button
                    key={s}
                    onClick={() => onSpeedChange(s)}
                    className={`px-2 py-1 text-xs rounded ${speed === s ? 'bg-race-red text-white' : 'bg-medium-gray/20 hover:bg-medium-gray/40 text-light-gray'} transition-colors`}
                >
                    {s}x
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PlaybackControls;
