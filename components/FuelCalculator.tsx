
import React from 'react';
import Card from './Card';
import { CarData } from '../types';

interface FuelCalculatorProps {
  car: CarData | undefined;
  currentLap: number;
  totalLaps: number;
}

const FuelCalculator: React.FC<FuelCalculatorProps> = ({ car, currentLap, totalLaps }) => {
  if (!car) return null;
  
  const { fuelRemaining, fuelConsPerLap } = car;
  const lapsRemainingInRace = totalLaps - currentLap;
  const lapsFuel = fuelRemaining / fuelConsPerLap;
  const delta = lapsFuel - lapsRemainingInRace;
  const isTight = delta < 1.0;

  return (
    <Card title="Fuel Strategy">
      <div className="flex flex-col h-full justify-between">
        
        <div className="grid grid-cols-2 gap-4">
            <div>
                <div className="text-[10px] text-medium-gray uppercase">Remaining</div>
                <div className="text-2xl font-bold text-white">{lapsFuel.toFixed(1)} <span className="text-xs text-medium-gray">LAPS</span></div>
            </div>
            <div>
                 <div className="text-[10px] text-medium-gray uppercase">Target</div>
                 <div className={`text-2xl font-bold ${delta >= 0 ? 'text-accent-green' : 'text-danger-red'}`}>
                     {delta > 0 ? '+' : ''}{delta.toFixed(1)} <span className="text-xs text-medium-gray">LAPS</span>
                 </div>
            </div>
        </div>

        {/* Visualization */}
        <div className="bg-dark-bg/50 p-2 rounded border border-medium-gray/20 mt-2">
            <div className="text-[10px] text-medium-gray uppercase mb-2">Consumption Rate</div>
            <div className="w-full h-2 bg-medium-gray/30 rounded-full overflow-hidden">
                 <div className="h-full bg-white w-[70%]"></div>
            </div>
            <div className="flex justify-between text-[10px] mt-1">
                 <span>Economy</span>
                 <span className="font-bold text-white">{fuelConsPerLap.toFixed(2)} L/Lap</span>
                 <span>Push</span>
            </div>
        </div>

        {/* Active Tips */}
        {isTight && (
             <div className="bg-warning-yellow/10 border-l-2 border-warning-yellow p-2 mt-2 rounded-r">
                 <div className="text-[10px] font-bold text-warning-yellow uppercase mb-1">Saving Mode Active</div>
                 <ul className="text-[10px] text-light-gray space-y-1">
                     <li>• Lift 50m early into Turn 11</li>
                     <li>• Short shift to 4th gear in Esses</li>
                 </ul>
             </div>
        )}
      </div>
    </Card>
  );
};

export default FuelCalculator;
