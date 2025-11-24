
import React, { useState } from 'react';
import { useRaceSimulation } from './hooks/useRaceSimulation';
import Header from './components/Header';
import PlaybackControls from './components/PlaybackControls';
import Leaderboard from './components/Leaderboard';
import TrackMap from './components/TrackMap';
import RaceEngineer from './components/RaceEngineer';
import PitStrategy from './components/PitStrategy';
import TireMonitor from './components/TireMonitor';
import FuelCalculator from './components/FuelCalculator';
import CautionAlert from './components/CautionAlert';
import TelemetryPanel from './components/TelemetryPanel';
import LoginScreen from './components/LoginScreen';
import { TRACKS } from './data/tracks';
import { ReplayData } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'LOGIN' | 'DASHBOARD'>('LOGIN');
  const [selectedTrackId, setSelectedTrackId] = useState('COTA');
  const [replayData, setReplayData] = useState<ReplayData | undefined>(undefined);

  const {
    currentLap,
    totalLaps,
    cars,
    raceState,
    playerCar,
    isPlaying,
    playbackSpeed,
    elapsedTime,
    recommendations,
    score,
    play,
    pause,
    restart,
    setPlaybackSpeed,
    jumpToLap,
    triggerPitBox,
    triggerYellowFlag,
    cancelPitBox,
    track
  } = useRaceSimulation(20, selectedTrackId, replayData);

  const handleLogin = (mode: 'LIVE' | 'PREDICT', data?: ReplayData) => {
      if (data) {
          setReplayData(data);
      }
      setView('DASHBOARD');
      if (mode === 'LIVE') {
          play();
      } else {
          pause();
      }
  };

  const handleBack = () => {
      pause();
      setView('LOGIN');
      setReplayData(undefined); 
  };

  if (view === 'LOGIN') {
      return <LoginScreen onStart={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-dark-bg p-2 sm:p-4 font-orbitron text-light-gray flex flex-col overflow-x-hidden">
      <CautionAlert visible={raceState.flag === 'YELLOW'} onDismiss={() => {}} />

      {/* Header Section */}
      <div className="flex flex-col gap-4 mb-4 shrink-0">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <Header
                currentLap={currentLap}
                totalLaps={totalLaps}
                elapsedTime={elapsedTime}
                isPlaying={isPlaying}
                onBack={handleBack}
              />
              
              {/* Controls Row (Track & Score) */}
              <div className="flex items-center justify-between lg:justify-end gap-4">
                <div className="flex-grow lg:flex-grow-0 bg-dark-panel border border-medium-gray/30 rounded-lg p-2 flex items-center justify-between lg:justify-start gap-2">
                    <span className="text-xs text-medium-gray uppercase">TRACK</span>
                    <select 
                      value={selectedTrackId} 
                      onChange={(e) => setSelectedTrackId(e.target.value)}
                      className="bg-black text-white text-sm font-bold rounded px-2 py-1 border border-medium-gray/50 focus:border-race-red outline-none w-32 lg:w-auto"
                    >
                        {Object.values(TRACKS).map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                </div>

                <div className="bg-dark-panel border border-race-red rounded px-4 py-2 shadow-lg shadow-race-red/10 flex flex-col items-center min-w-[80px]">
                    <span className="text-[10px] text-medium-gray block uppercase tracking-wider">Rating</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl lg:text-2xl font-black text-race-red">{score}</span>
                      <span className="text-[10px] text-medium-gray">PTS</span>
                    </div>
                </div>
              </div>
          </div>
      </div>

      <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-4 pb-32 lg:pb-24">
        
        {/* Left Column - Leaderboard */}
        {/* Desktop: Left (col-span-2). Mobile: Bottom (order-3) */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-4 order-3 lg:order-1 lg:h-[calc(100vh-220px)]">
          <Leaderboard cars={cars} />
        </div>

        {/* Center Column - Map & Telemetry */}
        {/* Desktop: Center (col-span-7). Mobile: Top (order-1) */}
        <div className="col-span-1 lg:col-span-7 flex flex-col gap-4 min-h-[450px] lg:h-[calc(100vh-220px)] order-1 lg:order-2">
           <div className="flex-grow relative min-h-[300px] rounded-lg overflow-hidden border border-medium-gray/20">
              <div className="absolute inset-0 bg-dark-panel">
                <TrackMap cars={cars} flagStatus={raceState.flag} track={track} />
              </div>
           </div>
           <div className="h-auto shrink-0">
              <TelemetryPanel car={playerCar} />
           </div>
        </div>
        
        {/* Right Column - Strategy */}
        {/* Desktop: Right (col-span-3). Mobile: Middle (order-2) */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-4 order-2 lg:order-3 lg:h-[calc(100vh-220px)]">
             <div className="shrink-0 h-auto">
                <PitStrategy 
                    car={playerCar} 
                    raceState={raceState} 
                    onPitRequest={triggerPitBox} 
                    onAbortPit={cancelPitBox} 
                />
             </div>
             <div className="h-48 lg:flex-grow min-h-[200px]">
                <RaceEngineer recommendations={recommendations} />
             </div>
             <div className="grid grid-cols-2 gap-2 h-auto shrink-0">
                 <TireMonitor car={playerCar} />
                 <FuelCalculator car={playerCar} currentLap={currentLap} totalLaps={totalLaps} />
             </div>
        </div>
      </main>

      <PlaybackControls
        isPlaying={isPlaying}
        onPlay={play}
        onPause={pause}
        onRestart={restart}
        speed={playbackSpeed}
        onSpeedChange={setPlaybackSpeed}
        currentLap={currentLap}
        totalLaps={totalLaps}
        onJumpToLap={jumpToLap}
      />
      
      {/* Dev Trigger */}
      {raceState.flag === 'GREEN' && (
        <div className="fixed bottom-32 lg:bottom-24 right-4 opacity-30 hover:opacity-100 transition-opacity z-50">
            <button onClick={triggerYellowFlag} className="bg-yellow-500/50 hover:bg-yellow-500 text-black text-[10px] px-2 py-1 rounded font-bold uppercase">
                Simulate Crash
            </button>
        </div>
      )}
    </div>
  );
};

export default App;
