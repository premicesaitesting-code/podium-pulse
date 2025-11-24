
import React from 'react';
import Card from './Card';
import { CarData } from '../types';

interface IncidentRiskProps {
  car: CarData | undefined;
}

const IncidentRisk: React.FC<IncidentRiskProps> = ({ car }) => {
    const aggression = (car?.aggression ?? 0.5) * 100;
    const gForce = car?.gForce ?? 2.5;
    const brakeTemp = car?.brakeTemp ?? 600;

    const riskScore = (aggression * 0.5) + (gForce * 10) + ((brakeTemp - 600) * 0.1);
    const riskLevel = Math.min(100, Math.max(0, riskScore));
    
    let color = 'text-accent-green';
    let label = 'LOW';
    if (riskLevel > 40) { color = 'text-warning-yellow'; label = 'MEDIUM'; }
    if (riskLevel > 70) { color = 'text-danger-red'; label = 'HIGH'; }

  return (
    <Card title="Incident Risk Detector">
      <div className="flex flex-col justify-around h-full text-center">
          <div>
            <p className="text-xs text-medium-gray uppercase">Overall Risk Level</p>
            <p className={`text-4xl font-black ${color} ${label === 'HIGH' ? 'animate-pulse-strong' : ''}`}>{label}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                  <p className="text-medium-gray">Aggression</p>
                  <p className="font-bold text-lg">{aggression.toFixed(0)}%</p>
              </div>
              <div>
                  <p className="text-medium-gray">Peak G-Force</p>
                  <p className="font-bold text-lg">{gForce.toFixed(2)}G</p>
              </div>
              <div>
                  <p className="text-medium-gray">Brake Temp</p>
                  <p className="font-bold text-lg">{brakeTemp}°C</p>
              </div>
          </div>
      </div>
    </Card>
  );
};

export default IncidentRisk;
