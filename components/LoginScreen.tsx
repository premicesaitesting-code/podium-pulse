
import React from 'react';
import { parseSROData } from '../utils/sroParser';
import { ReplayData } from '../types';

interface LoginScreenProps {
  onStart: (mode: 'LIVE' | 'PREDICT', replayData?: ReplayData) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onStart }) => {
  
  const handleStart = (mode: 'LIVE' | 'PREDICT') => {
      // Load SRO Data for both modes
      const data = parseSROData();
      onStart(mode, data);
  };

  return (
    <div className="fixed inset-0 bg-dark-bg z-50 flex flex-col items-center justify-center p-4 font-orbitron text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-race-red/20 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-race-red/10 rounded-full blur-3xl"></div>

      {/* Logo Section */}
      <div className="relative z-10 flex flex-col items-center mb-8 sm:mb-12 animate-fade-in-up">
        <div className="mb-4 relative">
           {/* Road Style Pulse Logo */}
           <svg viewBox="0 0 100 40" className="w-32 h-16 sm:w-48 sm:h-24 drop-shadow-[0_0_15px_rgba(225,6,0,0.8)] animate-heartbeat" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Base Road Path */}
              <path d="M0 20 H20 L25 10 L30 30 L35 15 L40 25 L45 20 H50 L55 25 L60 10 L65 30 L70 5 L75 20 H100" stroke="#333" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Dashed Line */}
              <path d="M0 20 H20 L25 10 L30 30 L35 15 L40 25 L45 20 H50 L55 25 L60 10 L65 30 L70 5 L75 20 H100" stroke="#E10600" strokeWidth="2" strokeDasharray="4 2" strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-wider uppercase text-center">
          <span className="text-white">PODIUM</span> <span className="text-race-red">PULSE</span>
        </h1>
        <p className="text-medium-gray tracking-[0.5em] text-xs sm:text-sm mt-2 uppercase text-center">Real-Time Race Strategy Engine</p>
      </div>

      {/* Event Details Card */}
      <div className="relative z-10 bg-dark-panel/80 backdrop-blur-md border border-medium-gray/30 p-6 sm:p-8 rounded-xl max-w-2xl w-full mb-8 shadow-2xl animate-scale-in">
         <div className="flex justify-between items-start border-b border-medium-gray/20 pb-4 mb-4">
            <div>
                <h3 className="text-[10px] text-medium-gray uppercase tracking-widest mb-1">Event Data Source</h3>
                <div className="text-xl sm:text-2xl font-bold text-white">TOYOTA GR CUP NORTH AMERICA</div>
            </div>
            <div className="text-right">
                <div className="bg-race-red text-white text-[10px] font-bold px-2 py-1 rounded uppercase animate-pulse">Live Feed</div>
            </div>
         </div>
         
         <div className="grid grid-cols-2 gap-4 sm:gap-8">
             <div>
                 <p className="text-[10px] text-medium-gray uppercase mb-1">Circuit</p>
                 <p className="text-base sm:text-lg font-bold">Circuit of the Americas</p>
                 <p className="text-[10px] text-medium-gray">Austin, TX • 3.426 Miles</p>
             </div>
             <div>
                 <p className="text-[10px] text-medium-gray uppercase mb-1">Session</p>
                 <p className="text-base sm:text-lg font-bold">Race 2 - Round 3</p>
                 <p className="text-[10px] text-medium-gray">Official Timing Data Available</p>
             </div>
         </div>
         
         <div className="mt-4 pt-4 border-t border-medium-gray/20 flex justify-between items-center">
             <span className="text-xs text-medium-gray">Select Track Layout:</span>
             <select className="bg-black text-white text-sm font-bold rounded px-3 py-1 border border-medium-gray/50 focus:border-race-red outline-none">
                 <option value="COTA">COTA (Grand Prix)</option>
             </select>
         </div>
      </div>

      {/* Action Buttons - 2 Tabs Only */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
          
          <button 
            onClick={() => handleStart('LIVE')}
            className="group relative bg-dark-panel hover:bg-accent-green/20 border-2 border-accent-green rounded-lg p-6 transition-all duration-300 hover:scale-105"
          >
              <div className="flex flex-col items-center text-center">
                  <div className="mb-2 text-accent-green">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">REAL-TIME MONITOR</h3>
                  <p className="text-[10px] text-medium-gray">Live Telemetry & Race Replay</p>
              </div>
          </button>

          <button 
            onClick={() => handleStart('PREDICT')}
            className="group relative bg-dark-panel hover:bg-warning-yellow/20 border-2 border-warning-yellow rounded-lg p-6 transition-all duration-300 hover:scale-105"
          >
              <div className="flex flex-col items-center text-center">
                  <div className="mb-2 text-warning-yellow">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">STRATEGY PREDICTOR</h3>
                  <p className="text-[10px] text-medium-gray">Simulation & What-If Scenarios</p>
              </div>
          </button>
      </div>
      
      <div className="absolute bottom-4 text-[10px] text-medium-gray uppercase tracking-widest opacity-50">
          Official Timing Partner • SRO Motorsports Group
      </div>
    </div>
  );
};

export default LoginScreen;
