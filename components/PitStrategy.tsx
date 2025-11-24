
import React from 'react';
import Card from './Card';
import { CarData, FlagStatus } from '../types';

interface PitStrategyProps {
  car: CarData | undefined;
  raceState: { flag: FlagStatus };
  onPitRequest: () => void;
  onAbortPit: () => void;
}

const PitStrategy: React.FC<PitStrategyProps> = ({ car, raceState, onPitRequest, onAbortPit }) => {
  if (!car) return <Card title="Pit Strategy"><div>No Data</div></Card>;

  const isPitStatus = car.status === 'PITTING';
  const pitWindowOpen = car.lap >= 12 && car.lap <= 14;
  const isYellow = raceState.flag === 'YELLOW';
  
  // Detailed Strategy Logic
  const pitLoss = isYellow ? 24 : 36;
  const estimatedRejoinPos = Math.min(20, car.position + (isYellow ? 2 : 4)); // Simplified logic
  const tireAdvantage = 0.8; // Seconds per lap
  
  return (
    <Card title="Pit Decision Matrix" className="relative overflow-hidden">
      {/* Active Pit Stop Overlay */}
      {isPitStatus && (
          <div className="absolute inset-0 z-30 bg-black/95 flex flex-col items-center justify-center animate-fade-in">
              <div className="text-7xl font-black text-success-cyan font-orbitron tabular-nums tracking-tighter">
                  {car.pitStopTimer.toFixed(1)}
              </div>
              <div className="text-2xl font-bold text-white mt-2 tracking-[0.5em] animate-pulse">
                  PIT ACTIVE
              </div>
              <div className="mt-8 grid grid-cols-2 gap-12 text-center">
                  <div>
                      <div className="text-xs text-medium-gray mb-1">TIRES</div>
                      <div className="text-accent-green font-bold text-xl border-2 border-accent-green px-4 py-1 rounded">SOFT</div>
                  </div>
                  <div>
                      <div className="text-xs text-medium-gray mb-1">FUEL</div>
                      <div className="text-accent-green font-bold text-xl border-2 border-accent-green px-4 py-1 rounded">+15L</div>
                  </div>
              </div>
              <button 
                  onClick={onAbortPit}
                  className="mt-6 px-4 py-1 text-[10px] uppercase font-bold text-medium-gray border border-medium-gray/30 rounded hover:bg-white/10 hover:text-white transition-colors"
              >
                  Abort Service
              </button>
          </div>
      )}

      <div className="grid grid-cols-12 gap-4 h-full">
        {/* Left Panel: Window & Status */}
        <div className="col-span-7 flex flex-col gap-2">
            <div className="bg-dark-bg/50 p-2 rounded border border-medium-gray/20">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-medium-gray uppercase tracking-wider">Window Status</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${pitWindowOpen ? 'bg-accent-green text-black animate-pulse' : 'bg-medium-gray/20 text-medium-gray'}`}>
                        {pitWindowOpen ? 'Optimal' : 'Closed'}
                    </span>
                </div>
                <div className="text-lg font-bold text-white flex items-baseline gap-2">
                    Lap 12-14 <span className="text-xs font-normal text-medium-gray">Target</span>
                </div>
            </div>

            {/* Rejoin Predictor */}
            <div className="bg-dark-bg/50 p-2 rounded border border-medium-gray/20 flex-grow">
                 <div className="text-[10px] text-medium-gray uppercase tracking-wider mb-2">Rejoin Prediction</div>
                 <div className="flex items-center justify-between">
                    <div className="text-center">
                        <div className="text-xs text-medium-gray">Current</div>
                        <div className="text-xl font-bold text-white">P{car.position}</div>
                    </div>
                    <div className="h-px w-8 bg-medium-gray/50 relative">
                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[10px] bg-dark-bg px-1 text-medium-gray">
                            {pitLoss}s
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-medium-gray">Predicted</div>
                        <div className={`text-xl font-bold ${estimatedRejoinPos <= car.position + 2 ? 'text-accent-green' : 'text-warning-yellow'}`}>
                            P{estimatedRejoinPos}
                        </div>
                    </div>
                 </div>
                 <div className="mt-2 text-[10px] text-light-gray bg-white/5 p-1 rounded">
                     <span className="text-accent-green">●</span> Fresh Tire Delta: -{tireAdvantage}s/lap
                 </div>
            </div>
        </div>

        {/* Right Panel: Action Buttons */}
        <div className="col-span-5 flex flex-col gap-2">
             <button 
                onClick={onPitRequest}
                disabled={isPitStatus || car.lap < 1}
                className={`
                    h-full flex flex-col items-center justify-center rounded-lg border-2 transition-all duration-200 relative overflow-hidden group
                    ${isYellow 
                        ? 'bg-warning-yellow border-warning-yellow text-black hover:bg-warning-yellow/80 shadow-[0_0_15px_rgba(255,215,0,0.4)]' 
                        : 'bg-accent-green/10 border-accent-green text-accent-green hover:bg-accent-green hover:text-black'}
                `}
             >
                {isYellow && <span className="absolute top-1 right-1 text-[8px] font-black bg-black text-warning-yellow px-1 rounded uppercase">Cheap Stop</span>}
                
                <span className="relative z-10 font-black text-2xl font-orbitron">BOX</span>
                <span className="relative z-10 text-[10px] font-bold uppercase tracking-widest">
                    {isYellow ? 'CONFIRM PIT' : 'THIS LAP'}
                </span>
                
                {/* Hover Swipe */}
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
             </button>
        </div>
      </div>
    </Card>
  );
};

export default PitStrategy;
