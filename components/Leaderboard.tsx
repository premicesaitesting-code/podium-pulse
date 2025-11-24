
import React from 'react';
import Card from './Card';
import { CarData } from '../types';

interface LeaderboardProps {
  cars: CarData[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ cars }) => {
    const sortedCars = [...cars].sort((a, b) => a.position - b.position);

  return (
    <Card title="Standings" className='overflow-y-auto'>
      <div className="space-y-1">
        {/* Compact Header */}
        <div className="flex text-[9px] text-medium-gray uppercase px-2 mb-1 tracking-tighter">
            <div className="w-6 text-center">Pos</div>
            <div className="flex-grow pl-2">Driver</div>
            <div className="w-12 text-right">Gap</div>
        </div>

        {sortedCars.map((car, index) => {
            const isPlayer = car.carNumber === 78;
            return (
              <div 
                key={car.carNumber} 
                className={`
                    flex items-center p-1.5 rounded text-sm transition-all
                    ${isPlayer ? 'bg-success-cyan/10 border-l-2 border-success-cyan' : 'bg-medium-gray/5 border-l-2 border-transparent'}
                `}
              >
                <div className="w-6 text-center font-bold font-orbitron text-white">{car.position}</div>
                
                <div className="flex-grow pl-2 min-w-0">
                    <div className={`font-bold leading-none truncate text-sm ${isPlayer ? 'text-success-cyan' : 'text-light-gray'}`}>
                        {car.driverName}
                    </div>
                    <div className="text-[9px] text-medium-gray flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono">#{car.carNumber}</span>
                        {car.status === 'PITTING' && <span className="text-black bg-warning-yellow px-1 rounded-[2px] font-bold animate-pulse">PIT</span>}
                        <span className={`px-1 rounded-[2px] ${car.tireCompound === 'SOFT' ? 'bg-danger-red text-white' : 'bg-white text-black'}`}>
                            {car.tireCompound[0]}
                        </span>
                    </div>
                </div>

                <div className="w-12 text-right flex flex-col justify-center">
                    <span className={`font-mono text-xs font-bold ${index === 0 ? 'text-warning-yellow' : 'text-white'}`}>
                        {index === 0 ? 'LDR' : `+${car.gapToLeader.toFixed(1)}`}
                    </span>
                    <span className="text-[8px] text-medium-gray font-mono hidden lg:block">
                        {car.tireAge}L
                    </span>
                </div>
              </div>
            );
        })}
      </div>
    </Card>
  );
};

export default Leaderboard;
