
import { useState, useEffect, useCallback, useRef } from 'react';
import { CarData, Recommendation, RaceState, TelemetryData, ReplayData } from '../types';
import { TRACKS } from '../data/tracks';
import { getTargetSpeed } from '../data/raceRecording';

const FPS = 10; // Updates per second
const TOTAL_LAPS = 20;

const generateInitialCars = (trackLength: number): CarData[] => [
    { carNumber: 78, driverName: "YOU", teamName: "GR Cup Team", position: 5, distance: 0, lapDistance: 0, lap: 1, lastLapTime: 0, bestLapTime: 0, currentSectorTime: 0, gapToLeader: 0, gapToNext: 0, telemetry: { rpm: 0, gear: 1, speed: 0, throttle: 0, brake: 0, steering: 0, gLat: 0, gLong: 0, gpsLat: 0, gpsLong: 0 }, tireWear: 98, tireTemp: 90, tireCompound: 'SOFT', tireAge: 3, fuelRemaining: 28.5, fuelConsPerLap: 1.8, damage: 0, status: 'RUNNING', pitStopTimer: 0, lastPitLap: 0, pitStrategy: "1 Stop (L12)", drsAvailable: false, tireStressIndex: 0, driverSmoothness: 95 },
    { carNumber: 46, driverName: "RIVAL", position: 1, distance: 300, lapDistance: 300, lap: 1, lastLapTime: 0, bestLapTime: 0, currentSectorTime: 0, gapToLeader: 0, gapToNext: 0, telemetry: { rpm: 0, gear: 1, speed: 0, throttle: 0, brake: 0, steering: 0, gLat: 0, gLong: 0, gpsLat: 0, gpsLong: 0 }, tireWear: 96, tireTemp: 92, tireCompound: 'SOFT', tireAge: 3, fuelRemaining: 28, fuelConsPerLap: 1.8, damage: 0, status: 'RUNNING', pitStopTimer: 0, lastPitLap: 0, pitStrategy: "1 Stop (L12)", drsAvailable: false, tireStressIndex: 0, driverSmoothness: 92 },
    { carNumber: 1, driverName: "ACE", position: 2, distance: 250, lapDistance: 250, lap: 1, lastLapTime: 0, bestLapTime: 0, currentSectorTime: 0, gapToLeader: 0, gapToNext: 0, telemetry: { rpm: 0, gear: 1, speed: 0, throttle: 0, brake: 0, steering: 0, gLat: 0, gLong: 0, gpsLat: 0, gpsLong: 0 }, tireWear: 95, tireTemp: 88, tireCompound: 'SOFT', tireAge: 3, fuelRemaining: 28.2, fuelConsPerLap: 1.8, damage: 0, status: 'RUNNING', pitStopTimer: 0, lastPitLap: 0, pitStrategy: "1 Stop (L12)", drsAvailable: false, tireStressIndex: 0, driverSmoothness: 90 },
    { carNumber: 99, driverName: "VET", position: 3, distance: 150, lapDistance: 150, lap: 1, lastLapTime: 0, bestLapTime: 0, currentSectorTime: 0, gapToLeader: 0, gapToNext: 0, telemetry: { rpm: 0, gear: 1, speed: 0, throttle: 0, brake: 0, steering: 0, gLat: 0, gLong: 0, gpsLat: 0, gpsLong: 0 }, tireWear: 94, tireTemp: 91, tireCompound: 'SOFT', tireAge: 3, fuelRemaining: 28.1, fuelConsPerLap: 1.8, damage: 0, status: 'RUNNING', pitStopTimer: 0, lastPitLap: 0, pitStrategy: "1 Stop (L12)", drsAvailable: false, tireStressIndex: 0, driverSmoothness: 88 },
    { carNumber: 23, driverName: "ROOKIE", position: 4, distance: 100, lapDistance: 100, lap: 1, lastLapTime: 0, bestLapTime: 0, currentSectorTime: 0, gapToLeader: 0, gapToNext: 0, telemetry: { rpm: 0, gear: 1, speed: 0, throttle: 0, brake: 0, steering: 0, gLat: 0, gLong: 0, gpsLat: 0, gpsLong: 0 }, tireWear: 95, tireTemp: 90, tireCompound: 'SOFT', tireAge: 3, fuelRemaining: 28.3, fuelConsPerLap: 1.8, damage: 0, status: 'RUNNING', pitStopTimer: 0, lastPitLap: 0, pitStrategy: "1 Stop (L12)", drsAvailable: false, tireStressIndex: 0, driverSmoothness: 85 },
    { carNumber: 42, driverName: "CHASER", position: 6, distance: -50, lapDistance: trackLength - 50, lap: 0, lastLapTime: 0, bestLapTime: 0, currentSectorTime: 0, gapToLeader: 0, gapToNext: 0, telemetry: { rpm: 0, gear: 1, speed: 0, throttle: 0, brake: 0, steering: 0, gLat: 0, gLong: 0, gpsLat: 0, gpsLong: 0 }, tireWear: 97, tireTemp: 90, tireCompound: 'SOFT', tireAge: 3, fuelRemaining: 28.5, fuelConsPerLap: 1.8, damage: 0, status: 'RUNNING', pitStopTimer: 0, lastPitLap: 0, pitStrategy: "1 Stop (L12)", drsAvailable: false, tireStressIndex: 0, driverSmoothness: 89 },
];

export const useRaceSimulation = (initialTotalLaps: number = TOTAL_LAPS, trackId: string = 'COTA', replayData?: ReplayData) => {
  const track = TRACKS[trackId];
  
  // If replay data exists, init cars from it
  const initCars = () => {
      if (replayData) {
          return replayData.cars.map((c, i) => ({
              carNumber: c.carNumber,
              driverName: c.carNumber === 78 ? "YOU" : `Driver ${c.carNumber}`,
              position: i + 1,
              distance: 0,
              lapDistance: 0,
              lap: 1,
              lastLapTime: 0,
              bestLapTime: 0,
              currentSectorTime: 0,
              gapToLeader: 0,
              gapToNext: 0,
              telemetry: { rpm: 0, gear: 1, speed: 0, throttle: 0, brake: 0, steering: 0, gLat: 0, gLong: 0, gpsLat: 0, gpsLong: 0 },
              tireWear: 100,
              tireTemp: 90,
              tireCompound: 'SOFT' as const,
              tireAge: 0,
              fuelRemaining: 30,
              fuelConsPerLap: 1.5,
              damage: 0,
              status: 'RUNNING' as const,
              pitStopTimer: 0,
              lastPitLap: 0,
              pitStrategy: "1 Stop",
              drsAvailable: false,
              tireStressIndex: 0,
              driverSmoothness: 90
          }));
      }
      return generateInitialCars(track.length);
  };

  const [cars, setCars] = useState<CarData[]>(initCars);
  const [raceState, setRaceState] = useState<RaceState>({ flag: 'GREEN', safetyCarDeployed: false, weather: 'DRY', trackTemp: 42, airTemp: 28, rainProbability: 5 });
  const [currentLap, setCurrentLap] = useState(1);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [score, setScore] = useState(0);
  
  const timerRef = useRef<number | null>(null);

  // Reset when track or replay data changes
  useEffect(() => {
    setCars(initCars());
    setElapsedTime(0);
    setCurrentLap(1);
    setIsPlaying(false);
    setRecommendations([]);
    setScore(0);
    setRaceState({ flag: 'GREEN', safetyCarDeployed: false, weather: 'DRY', trackTemp: 42, airTemp: 28, rainProbability: 5 });
  }, [trackId, track.length, replayData]); 

  // --- Helpers ---

  const getSegment = (distance: number) => {
      return track.segments.find(s => distance >= s.start && distance < s.end) || track.segments[track.segments.length - 1];
  };

  const calculatePhysics = (car: CarData, dt: number, raceFlag: string): { speed: number, telemetry: TelemetryData, distMoved: number } => {
      const segment = getSegment(car.lapDistance);
      
      // Use recorded data for base speed profile
      const recordedTargetSpeed = getTargetSpeed(car.carNumber, car.lap, car.lapDistance, track.length, segment.speed);

      // Apply dynamic factors (Wear, Fuel, Flag) on top of recording
      const wearFactor = Math.max(0.85, car.tireWear / 100); // Tires affect speed by up to 15%
      const fuelFactor = 1 + ((30 - car.fuelRemaining) * 0.002); // Lighter = slightly faster
      const flagFactor = raceFlag === 'YELLOW' ? 0.5 : 1.0;
      
      let targetSpeed = recordedTargetSpeed * wearFactor * fuelFactor * flagFactor;
      
      // Smooth speed transition (inertia)
      const accelRate = 100 * dt; // km/h per second
      const brakeRate = 200 * dt;
      
      let newSpeed = car.telemetry.speed;
      let gLong = 0;

      if (newSpeed < targetSpeed) {
          newSpeed = Math.min(newSpeed + accelRate, targetSpeed);
          gLong = 0.5 + Math.random() * 0.1; // Accelerating G
      } else {
          newSpeed = Math.max(newSpeed - brakeRate, targetSpeed);
          gLong = -1.2 - Math.random() * 0.2; // Braking G
      }

      // Telemetry generation
      const rpm = (newSpeed / 280) * 7500 + (Math.random() * 200);
      const gear = Math.min(6, Math.max(1, Math.floor(newSpeed / 45)));
      const throttle = gLong > 0 ? 100 : 0;
      const brake = gLong < 0 ? Math.min(100, Math.abs(gLong) * 40) : 0;
      const gLat = segment.gLat * (newSpeed / segment.speed) * (Math.random() * 0.2 + 0.9);
      
      // Simulated GPS
      const gpsLat = 30.1335278 + (Math.sin(car.lapDistance / 1000) * 0.005);
      const gpsLong = -97.6422583 + (Math.cos(car.lapDistance / 1000) * 0.005);

      const distMoved = (newSpeed / 3.6) * dt;

      return {
          speed: newSpeed,
          distMoved,
          telemetry: {
              speed: newSpeed,
              rpm,
              gear,
              throttle,
              brake,
              gLat: segment.start > 600 && segment.start < 800 ? -gLat : gLat, // Flip for left turns
              gLong,
              steering: gLat * 30,
              gpsLat,
              gpsLong
          }
      };
  };

  // --- Actions ---

  const triggerPitBox = useCallback(() => {
     setCars(prev => prev.map(c => {
         if (c.carNumber === 78 && c.status !== 'PITTING') {
             return { 
                 ...c, 
                 status: 'PITTING', 
                 pitStopTimer: track.pitLoss, 
                 telemetry: { ...c.telemetry, speed: 60 } // Pit limiter
             }; 
         }
         return c;
     }));
     setScore(s => s + 50); // "Optimal Pit" points
     setRecommendations(prev => prev.filter(r => !r.id.includes('pit')));
  }, [track.pitLoss]);

  const cancelPitBox = useCallback(() => {
      setCars(prev => prev.map(c => {
          if (c.carNumber === 78 && c.status === 'PITTING') {
              return { ...c, status: 'RUNNING', pitStopTimer: 0 };
          }
          return c;
      }));
  }, []);

  const triggerYellowFlag = useCallback(() => {
      if (raceState.flag === 'YELLOW') return;
      
      setRaceState(prev => ({ ...prev, flag: 'YELLOW', safetyCarDeployed: true }));
      setScore(s => s - 10); 
      
      const decisionId = `caution-${Date.now()}`;
      setRecommendations(prev => [{
          id: decisionId,
          type: 'CRITICAL',
          message: 'CAUTION - DECISION REQUIRED',
          subtext: 'Pit lane OPEN. Rejoin P8 vs Stay P5.',
          actionLabel: 'OPEN MATRIX',
          onAction: () => {},
          expiresAt: Date.now() + 15000
      }, ...prev]);
  }, [raceState.flag]);

  const clearYellowFlag = useCallback(() => {
      setRaceState(prev => ({ ...prev, flag: 'GREEN', safetyCarDeployed: false }));
  }, []);

  // --- Main Loop ---
  
  const tick = useCallback(() => {
    const dt = (1 / FPS) * playbackSpeed;
    setElapsedTime(prev => prev + dt);

    // Update cars
    setCars(prevCars => {
        let updatedCars = prevCars.map(car => {
            let { status, pitStopTimer, tireWear, fuelRemaining, tireAge, lastLapTime, bestLapTime, lap, lapDistance, distance, tireStressIndex, driverSmoothness, telemetry } = car;
            let newTelemetry = { ...telemetry };

            if (replayData) {
                // --- REPLAY MODE ---
                const carReplay = replayData.cars.find(c => c.carNumber === car.carNumber);
                if (carReplay && carReplay.laps.length > 0) {
                    // Find current lap data
                    const currentTime = elapsedTime;
                    const currentLapData = carReplay.laps.find(l => currentTime >= l.startTime && currentTime < l.endTime);
                    
                    if (currentLapData) {
                        // Valid lap found, move car
                        lap = currentLapData.lapNumber;
                        const lapProgress = (currentTime - currentLapData.startTime) / currentLapData.duration;
                        const p = Math.max(0, Math.min(1, lapProgress));
                        
                        lapDistance = p * track.length;
                        distance = (lap - 1) * track.length + lapDistance;
                        
                        const avgSpeedMs = track.length / currentLapData.duration;
                        newTelemetry.speed = avgSpeedMs * 3.6; // KPH
                        
                        // Basic visual telemetry simulation
                        newTelemetry.rpm = (newTelemetry.speed / 280) * 7500;
                        newTelemetry.gear = Math.min(6, Math.max(1, Math.floor(newTelemetry.speed / 45)));

                        // Check if lap changed
                        if (car.lap !== lap) {
                            lastLapTime = carReplay.laps.find(l => l.lapNumber === lap - 1)?.duration || 0;
                            if (bestLapTime === 0 || (lastLapTime < bestLapTime && lastLapTime > 0)) bestLapTime = lastLapTime;
                            tireAge++;
                        }
                        status = 'RUNNING';
                    } else if (currentTime < carReplay.laps[0].startTime) {
                        // WAITING AT START (Grid)
                        lap = 1;
                        distance = 0;
                        lapDistance = 0;
                        newTelemetry.speed = 0;
                        status = 'RUNNING'; // Ensure visible
                    } else {
                        // Race finished or gap in data
                        // Keep last known position if needed, or stop
                        newTelemetry.speed = 0;
                    }
                }
            } else {
                // --- SIMULATION MODE ---
                // Random Events
                if (raceState.flag === 'GREEN' && Math.random() < 0.0002 * playbackSpeed) {
                    triggerYellowFlag();
                }
                if (raceState.flag === 'YELLOW' && Math.random() < 0.001 * playbackSpeed) {
                    clearYellowFlag();
                }

                if (status === 'PITTING') {
                    pitStopTimer -= dt;
                    newTelemetry.speed = 0; // Stopped
                    if (pitStopTimer <= 0) {
                        status = 'RUNNING';
                        pitStopTimer = 0;
                        tireWear = 100; // Fresh
                        tireAge = 0;
                        fuelRemaining = 35; // Full
                        car.lastPitLap = lap;
                    }
                } else {
                    // Calculate Physics & Telemetry
                    const physics = calculatePhysics(car, dt, raceState.flag);
                    newTelemetry = physics.telemetry;
                    
                    const distMoved = physics.distMoved;
                    distance += distMoved;
                    lapDistance += distMoved;

                    // Tire Logic
                    const stress = (Math.abs(newTelemetry.gLat) * newTelemetry.speed) / 100 + (newTelemetry.brake / 10);
                    tireStressIndex = stress;
                    const wearRate = (stress * 0.05) * dt * (car.tireCompound === 'SOFT' ? 1.2 : 0.8);
                    tireWear = Math.max(0, tireWear - wearRate);
                    
                    // Fuel Logic
                    const fuelBurn = (newTelemetry.throttle / 100) * (newTelemetry.rpm / 7500) * dt * 0.05;
                    fuelRemaining = Math.max(0, fuelRemaining - fuelBurn);
                    
                    // Smoothness
                    const jerk = Math.abs(newTelemetry.gLong - car.telemetry.gLong);
                    driverSmoothness = driverSmoothness * 0.99 + (100 - jerk * 10) * 0.01;

                    // Lap Complete
                    if (lapDistance >= track.length) {
                        lapDistance -= track.length;
                        lastLapTime = (track.length / (newTelemetry.speed/3.6 || 10)); // Approx
                        if (bestLapTime === 0 || lastLapTime < bestLapTime) bestLapTime = lastLapTime;
                        lap += 1;
                        tireAge += 1;
                    }
                }
            }

            return {
                ...car,
                status,
                pitStopTimer,
                tireWear,
                fuelRemaining,
                tireAge,
                lastLapTime,
                bestLapTime,
                lap,
                lapDistance,
                distance,
                telemetry: newTelemetry,
                tireStressIndex,
                driverSmoothness
            };
        });

        // Sort Positions
        updatedCars.sort((a, b) => b.distance - a.distance);
        const leaderDist = updatedCars[0].distance;

        return updatedCars.map((car, index) => ({
            ...car,
            position: index + 1,
            gapToLeader: (leaderDist - car.distance) / (Math.max(10, car.telemetry.speed) / 3.6), // Time gap, prevent div by 0
            gapToNext: index === 0 ? 0 : (updatedCars[index-1].distance - car.distance) / (Math.max(10, car.telemetry.speed) / 3.6)
        }));
    });

    // Update Global Lap
    setCars(current => {
        const leader = current.find(c => c.position === 1);
        if (leader && leader.lap > currentLap) setCurrentLap(leader.lap);
        return current;
    });

  }, [playbackSpeed, currentLap, raceState, triggerYellowFlag, clearYellowFlag, track, elapsedTime, replayData]);


  // --- Strategy Engine ---
  useEffect(() => {
      const player = cars.find(c => c.carNumber === 78);
      if (!player) return;
      if (elapsedTime % 2 < 0.1) { // Run every 2s
          const newRecs: Recommendation[] = [];
          
          // Pit Window
          if (raceState.flag === 'GREEN' && player.status === 'RUNNING') {
              if (currentLap >= 12 && currentLap <= 14 && player.lastPitLap === 0) {
                 newRecs.push({
                     id: 'pit-window',
                     type: 'STRATEGY',
                     message: 'PIT WINDOW OPEN',
                     subtext: 'Undercut P4 possible. Rejoin P7 in clean air.',
                     actionLabel: 'PIT NOW',
                     onAction: triggerPitBox
                 });
              }
          }

          // Fuel
          if (player.fuelRemaining < (initialTotalLaps - currentLap) * 1.8) {
               newRecs.push({
                   id: 'fuel-save',
                   type: 'WARNING',
                   message: 'FUEL TARGET -0.2L',
                   subtext: 'Lift & coast T11. Short shift 3rd.',
               });
          }

          // Tire
          if (player.tireWear < 40) {
               newRecs.push({
                   id: 'tire-crit',
                   type: 'CRITICAL',
                   message: 'TIRE CLIFF IMMINENT',
                   subtext: 'Pace loss > 1.5s next lap.',
                   actionLabel: 'BOX BOX',
                   onAction: triggerPitBox
               });
          }

          setRecommendations(prev => {
              const existingIds = new Set(prev.map(r => r.id));
              const uniqueNew = newRecs.filter(r => !existingIds.has(r.id));
              return [...prev.filter(r => !r.expiresAt || r.expiresAt > Date.now()), ...uniqueNew];
          });
      }
  }, [elapsedTime, cars, currentLap, raceState, triggerPitBox, initialTotalLaps]);


  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(tick, 1000 / FPS);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, tick]);

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const restart = () => {
      setIsPlaying(false);
      setCars(initCars()); 
      setElapsedTime(0);
      setCurrentLap(1);
      setRaceState({ flag: 'GREEN', safetyCarDeployed: false, weather: 'DRY', trackTemp: 42, airTemp: 28, rainProbability: 5 });
      setScore(0);
      setRecommendations([]);
  };
  const jumpToLap = (lap: number) => setCurrentLap(lap);

  const playerCar = cars.find(c => c.carNumber === 78);

  return {
    cars,
    playerCar,
    currentLap,
    totalLaps: initialTotalLaps,
    raceState,
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
    cancelPitBox,
    triggerYellowFlag,
    track
  };
};
