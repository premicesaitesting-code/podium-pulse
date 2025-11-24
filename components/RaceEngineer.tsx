
import React from 'react';
import Card from './Card';
import { Recommendation } from '../types';

interface RaceEngineerProps {
  recommendations: Recommendation[];
}

const RaceEngineer: React.FC<RaceEngineerProps> = ({ recommendations }) => {
  return (
    <Card title="Engineer Radio" titleClassName="text-light-gray" className="flex flex-col">
      <div className="flex-grow overflow-y-auto pr-1 custom-scrollbar space-y-3 max-h-[300px]">
        {recommendations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-medium-gray/30">
              <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center mb-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              </div>
              <span className="text-xs font-mono tracking-widest">CHANNEL CLEAR</span>
          </div>
        ) : (
          recommendations.map((rec) => {
            const isCritical = rec.type === 'CRITICAL';
            return (
              <div 
                key={rec.id} 
                className={`
                    relative p-3 rounded-r border-l-4 animate-slide-in shadow-lg
                    ${isCritical 
                        ? 'bg-danger-red/10 border-danger-red shadow-danger-red/10' 
                        : 'bg-dark-bg border-accent-green shadow-accent-green/5'}
                `}
              >
                <div className="flex justify-between items-start gap-3">
                    <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-medium-gray">{new Date().toLocaleTimeString([], {hour12: false, hour:'2-digit', minute:'2-digit', second:'2-digit'})}</span>
                            <span className={`text-[10px] font-bold px-1.5 rounded ${isCritical ? 'bg-danger-red text-black' : 'bg-accent-green/20 text-accent-green'}`}>
                                {rec.type}
                            </span>
                        </div>
                        <p className={`font-bold font-orbitron text-sm ${isCritical ? 'text-white' : 'text-light-gray'}`}>
                            "{rec.message}"
                        </p>
                        {rec.subtext && <p className="text-xs text-medium-gray mt-1 italic">{rec.subtext}</p>}
                    </div>
                    
                    {rec.action && (
                        <button 
                            onClick={rec.onAction}
                            className={`
                                shrink-0 px-3 py-2 rounded text-xs font-bold uppercase transition-all hover:scale-105 active:scale-95
                                ${isCritical 
                                    ? 'bg-danger-red text-white hover:bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]' 
                                    : 'bg-accent-green text-black hover:bg-green-400'}
                            `}
                        >
                            {rec.actionLabel || 'COPY'}
                        </button>
                    )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};

export default RaceEngineer;
