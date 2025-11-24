
import React, { useEffect, useState } from 'react';

interface CautionAlertProps {
    visible: boolean;
    onDismiss: () => void;
}

const CautionAlert: React.FC<CautionAlertProps> = ({ visible }) => {
    const [countdown, setCountdown] = useState(15);

    useEffect(() => {
        if (visible) {
            setCountdown(15);
            const interval = setInterval(() => {
                setCountdown(prev => prev > 0 ? prev - 1 : 0);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
            
            {/* Top Banner */}
            <div className="fixed top-0 left-0 right-0 bg-warning-yellow text-black py-2 overflow-hidden">
                <div className="flex animate-marquee whitespace-nowrap font-black text-xl uppercase tracking-widest">
                    <span className="mx-4">⚠️ FULL COURSE CAUTION</span>
                    <span className="mx-4">SAFETY CAR DEPLOYED</span>
                    <span className="mx-4">PIT LANE OPEN</span>
                    <span className="mx-4">NO OVERTAKING</span>
                    <span className="mx-4">⚠️ FULL COURSE CAUTION</span>
                    <span className="mx-4">SAFETY CAR DEPLOYED</span>
                </div>
            </div>

            {/* Main Decision Matrix */}
            <div className="bg-dark-panel border-4 border-warning-yellow shadow-[0_0_100px_rgba(255,215,0,0.3)] max-w-4xl w-full rounded-xl p-1 animate-scale-in">
                <div className="bg-black/50 rounded-lg p-6 sm:p-8">
                    
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-4xl sm:text-6xl font-black text-white font-orbitron tracking-tighter">DECISION<span className="text-warning-yellow">MATRIX</span></h1>
                            <p className="text-medium-gray text-sm uppercase tracking-widest mt-2">Critical Strategy Event Detected</p>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-medium-gray uppercase">Decision Timer</div>
                            <div className={`text-5xl font-black font-mono ${countdown < 5 ? 'text-danger-red animate-pulse' : 'text-white'}`}>
                                00:{countdown.toString().padStart(2, '0')}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Option A */}
                        <button className="group relative bg-dark-bg border-2 border-accent-green/30 hover:border-accent-green rounded-xl p-6 text-left transition-all hover:bg-accent-green/5">
                            <div className="absolute top-0 right-0 bg-accent-green text-black text-xs font-bold px-3 py-1 rounded-bl-xl uppercase">Recommended</div>
                            <h3 className="text-2xl font-black text-white mb-4 group-hover:text-accent-green">PIT NOW</h3>
                            <ul className="space-y-2 text-sm text-light-gray">
                                <li className="flex justify-between"><span>Restart Position</span> <span className="font-bold text-white">P8</span></li>
                                <li className="flex justify-between"><span>Tire Age</span> <span className="font-bold text-accent-green">0 Laps (New)</span></li>
                                <li className="flex justify-between"><span>Time Loss</span> <span className="font-bold text-accent-green">24s (Cheap)</span></li>
                                <li className="flex justify-between"><span>Risk</span> <span className="font-bold text-warning-yellow">Medium</span></li>
                            </ul>
                        </button>

                        {/* Option B */}
                        <button className="group relative bg-dark-bg border-2 border-medium-gray/30 hover:border-white rounded-xl p-6 text-left transition-all hover:bg-white/5">
                             <h3 className="text-2xl font-black text-white mb-4 group-hover:text-light-gray">STAY OUT</h3>
                            <ul className="space-y-2 text-sm text-light-gray">
                                <li className="flex justify-between"><span>Restart Position</span> <span className="font-bold text-accent-green">P3</span></li>
                                <li className="flex justify-between"><span>Tire Age</span> <span className="font-bold text-danger-red">14 Laps (Old)</span></li>
                                <li className="flex justify-between"><span>Fuel</span> <span className="font-bold text-warning-yellow">Marginal</span></li>
                                <li className="flex justify-between"><span>Risk</span> <span className="font-bold text-danger-red">High</span></li>
                            </ul>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CautionAlert;
