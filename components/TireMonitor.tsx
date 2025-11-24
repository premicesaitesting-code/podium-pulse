
import React from 'react';
import Card from './Card';
import { CarData } from '../types';

interface TireMonitorProps {
  car: CarData | undefined;
}

const TireMonitor: React.FC<TireMonitorProps> = ({ car }) => {
  if (!car) return <Card title="Tire Monitor">No Data</Card>;

  const { tireWear, tireAge, tireTemp, tireStressIndex } = car;
  
  // Logic
  const cliffLap = Math.floor(tireAge + (tireWear / 4)); // Rough predict
  const isCliffNear = (cliffLap - tireAge) < 3;

  return (
    <Card title="Tire Status">
      <div className="flex flex-col h-full gap-3">
          
          <div className="flex justify-between items-start">
              <div>
                  <div className="text-[10px] text-medium-gray uppercase">Wear Level</div>
                  <div className={`text-3xl font-black ${tireWear < 40 ? 'text-danger-red animate-pulse' : 'text-white'}`}>
                      {Math.round(tireWear)}%
                  </div>
              </div>
              <div className="text-right">
                   <div className="text-[10px] text-medium-gray uppercase">Cliff Prediction</div>
                   <div className="text-lg font-bold text-white">Lap {cliffLap}</div>
                   {isCliffNear && <div className="text-xs text-danger-red font-bold uppercase animate-pulse">Critical</div>}
              </div>
          </div>

          {/* Stress Bar */}
          <div>
              <div className="flex justify-between text-[10px] text-medium-gray uppercase mb-1">
                  <span>Instant Stress Load</span>
                  <span>{tireStressIndex.toFixed(1)}</span>
              </div>
              <div className="w-full h-2 bg-medium-gray/30 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-100 ${tireStressIndex > 2 ? 'bg-danger-red' : 'bg-accent-green'}`}
                    style={{ width: `${Math.min(100, tireStressIndex * 30)}%` }}
                  ></div>
              </div>
          </div>

          {/* Four Tire Visual */}
          <div className="grid grid-cols-2 gap-4 mt-auto">
               {['FL', 'FR', 'RL', 'RR'].map(pos => (
                   <div key={pos} className="bg-dark-bg/50 rounded p-2 flex items-center justify-between border border-medium-gray/20">
                       <span className="text-xs font-bold text-medium-gray">{pos}</span>
                       <div className="text-right">
                           <div className={`text-sm font-bold ${tireTemp > 100 ? 'text-danger-red' : 'text-success-cyan'}`}>
                               {tireTemp.toFixed(0)}°C
                           </div>
                           <div className="text-[10px] text-light-gray">{Math.round(tireWear)}%</div>
                       </div>
                   </div>
               ))}
          </div>
      </div>
    </Card>
  );
};

export default TireMonitor;
