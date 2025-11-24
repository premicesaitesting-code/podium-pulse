
import { RaceData, CarData } from '../types';

const generateCarData = (lap: number, carNumber: number, driverName: string, initialPosition: number): CarData => {
  const posFluctuation = Math.floor(Math.random() * 3) - 1;
  const position = Math.max(1, initialPosition + (lap > 10 ? posFluctuation : 0));
  
  const baseLapTime = 92.5;
  const tireDegradation = lap * 0.03;
  const fuelEffect = (30 - lap) * 0.01;
  const randomFactor = (Math.random() - 0.5) * 0.5;
  const lapTime = parseFloat((baseLapTime + tireDegradation + fuelEffect + randomFactor).toFixed(3));
  
  const hasPitted = lap > 18 && carNumber === 78;
  const tireWear = Math.min(100, (lap * 3.5) - (hasPitted ? 60 : 0) + Math.random() * 5);
  const fuelRemaining = 32 - lap * 1.05;

  return {
    carNumber,
    driverName,
    position,
    lapTime,
    lap,
    
    // Defaults for required CarData fields
    distance: 0,
    lapDistance: 0,
    lastLapTime: 0,
    currentSectorTime: 0,
    tireTemp: 90,
    tireCompound: 'SOFT',
    tireAge: 0,
    fuelConsPerLap: 1.5,
    damage: 0,
    status: 'RUNNING',
    pitStopTimer: 0,
    pitStrategy: "1 Stop (L12)",

    gapToLeader: 0, // Calculated later
    gapToNext: 0, // Calculated later
    tireWear,
    fuelRemaining,
    drsAvailable: lap > 2,
    lastPitLap: hasPitted ? 18 : 0,
    gForce: parseFloat((2.5 + (Math.random() - 0.5) * 0.5).toFixed(2)),
    brakeTemp: Math.floor(600 + (Math.random() - 0.5) * 100),
    aggression: parseFloat((0.5 + Math.random() * 0.4).toFixed(2)),

    // Missing required properties
    bestLapTime: 0,
    tireStressIndex: 0,
    driverSmoothness: 90,
    telemetry: {
        rpm: 0,
        gear: 1,
        speed: 0,
        throttle: 0,
        brake: 0,
        steering: 0,
        gLat: 0,
        gLong: 0,
        gpsLat: 0,
        gpsLong: 0
    }
  };
};

export const sampleRaceData: RaceData = Array.from({ length: 30 }, (_, i) => {
  const lap = i + 1;
  const cars: CarData[] = [
    generateCarData(lap, 78, "YOU", 2),
    generateCarData(lap, 42, "RIVAL", 1),
    generateCarData(lap, 15, "CHASER", 3),
    generateCarData(lap, 99, "VET", 4),
    generateCarData(lap, 23, "ROOKIE", 5),
    generateCarData(lap, 8, "DEFENDER", 6),
    generateCarData(lap, 55, "ACE", 7),
  ];

  // Sort by lap time to determine positions, then re-assign
  cars.sort((a, b) => Math.random() - 0.5); // Add some randomness to position changes
  cars.forEach((c, index) => c.position = index + 1);
  cars.sort((a, b) => a.position - b.position);

  // Calculate gaps
  let leaderTime = 0;
  let prevCarTime = 0;
  cars.forEach((car, index) => {
    if (index === 0) {
      leaderTime = lap * 92.5; // Simplified total time
      car.gapToLeader = 0;
      prevCarTime = leaderTime;
    } else {
        const totalTime = prevCarTime + (Math.random() * 2 + 0.5);
        car.gapToLeader = parseFloat((totalTime - leaderTime).toFixed(1));
        car.gapToNext = parseFloat((totalTime - prevCarTime).toFixed(1));
        prevCarTime = totalTime;
    }
  });


  return { lap, cars };
});
