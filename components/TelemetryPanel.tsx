
import React from 'react';
import Card from './Card';
import { CarData } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell } from 'recharts';

interface TelemetryPanelProps {
  car: CarData | undefined;
}

const TelemetryPanel: React.FC<TelemetryPanelProps> = ({ car }) => {
  if (!car) return null;
  
  const { telemetry, driverSmoothness } = car;

  // Mock telemetry history for smoothness viz (simplified)
  const inputData = [
      { name: 'Throttle', value: telemetry.throttle, color: '#00ff41' },
      { name: 'Brake', value: telemetry.brake, color: '#ff0000' },
  ];

  return (
    <Card title="Driver Telemetry">
      <div className="flex flex-col h-full gap-4">
        
        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-dark-bg/50 p-2 rounded">
                <div className="flex justify-between text-[10px] text-medium-gray uppercase mb-1">
                    <span>Throttle</span>
                    <span>{telemetry.throttle.toFixed(0)}%</span>
                </div>
                <div className="w-full h-12 bg-black rounded flex items-end overflow-hidden">
                    <div 
                        className="w-full bg-accent-green transition-all duration-75 ease-linear"
                        style={{ height: `${telemetry.throttle}%` }}
                    ></div>
                </div>
            </div>
            <div className="bg-dark-bg/50 p-2 rounded">
                <div className="flex justify-between text-[10px] text-medium-gray uppercase mb-1">
                    <span>Brake</span>
                    <span>{telemetry.brake.toFixed(0)}%</span>
                </div>
                <div className="w-full h-12 bg-black rounded flex items-end overflow-hidden">
                    <div 
                        className="w-full bg-danger-red transition-all duration-75 ease-linear"
                        style={{ height: `${telemetry.brake}%` }}
                    ></div>
                </div>
            </div>
        </div>

        {/* G-Force Circle */}
        <div className="flex items-center justify-center py-2">
            <div className="relative w-24 h-24 rounded-full border border-medium-gray/30 bg-black/50">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-px bg-medium-gray/20"></div>
                    <div className="h-full w-px bg-medium-gray/20 absolute"></div>
                </div>
                {/* The Dot */}
                <div 
                    className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-75 ease-linear"
                    style={{ 
                        left: `calc(50% + ${telemetry.gLat * 8}px)`, 
                        top: `calc(50% - ${telemetry.gLong * 8}px)` // - because +gLong is accel (up)
                    }}
                ></div>
                <span className="absolute top-1 right-3 text-[8px] text-medium-gray">LAT: {telemetry.gLat.toFixed(1)}G</span>
                <span className="absolute bottom-1 right-3 text-[8px] text-medium-gray">LON: {telemetry.gLong.toFixed(1)}G</span>
            </div>
            
            <div className="ml-4 flex flex-col justify-between h-24 py-1">
                 <div>
                     <div className="text-[10px] text-medium-gray uppercase">Speed</div>
                     <div className="text-2xl font-bold font-mono">{telemetry.speed.toFixed(0)} <span className="text-xs text-medium-gray">KPH</span></div>
                 </div>
                 <div>
                     <div className="text-[10px] text-medium-gray uppercase">Gear</div>
                     <div className="text-2xl font-bold text-race-red font-mono">{telemetry.gear}</div>
                 </div>
                 <div>
                     <div className="text-[10px] text-medium-gray uppercase">RPM</div>
                     <div className="text-sm font-bold font-mono text-accent-green">{telemetry.rpm.toFixed(0)}</div>
                 </div>
            </div>
        </div>

        {/* Driver Score */}
        <div className="mt-auto border-t border-medium-gray/20 pt-2">
            <div className="flex justify-between items-center">
                <span className="text-xs text-medium-gray uppercase">Smoothness Score</span>
                <span className={`text-lg font-bold ${driverSmoothness > 90 ? 'text-accent-green' : 'text-warning-yellow'}`}>
                    {driverSmoothness.toFixed(0)}/100
                </span>
            </div>
            <div className="w-full h-1 bg-medium-gray/30 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-white transition-all duration-500" style={{ width: `${driverSmoothness}%` }}></div>
            </div>
            <div className="text-[10px] text-medium-gray mt-1 italic">
                {driverSmoothness > 90 ? "Excellent inputs. Keep it up." : "Inputs too aggressive. Smooth out steering."}
            </div>
        </div>
      </div>
    </Card>
  );
};

export default TelemetryPanel;
