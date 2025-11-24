
import { ReplayData, CarReplayData, LapReplayData } from '../types';
import { CSV_LAP_TIMES } from '../data/sro_r2_data';

interface RawLapData {
    vehicle_id: string;
    lap: number;
    value: number; // milliseconds
    timestamp: string;
}

const parseCSV = (csv: string): RawLapData[] => {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
    const vehicleIdx = headers.indexOf('vehicle_id');
    const lapIdx = headers.indexOf('lap');
    const valueIdx = headers.indexOf('value');
    const timestampIdx = headers.indexOf('timestamp');

    const data: RawLapData[] = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(',').map(p => p.replace(/"/g, ''));
        
        const vehicle_id = parts[vehicleIdx];
        const lap = parseInt(parts[lapIdx]);
        const value = parseInt(parts[valueIdx]);
        const timestamp = parts[timestampIdx];

        // Filter out invalid laps (e.g., 32768) and Lap 0 (Grid/Formation)
        // Also ensure we have a valid timestamp
        if (lap > 0 && lap < 30000 && !isNaN(value) && timestamp && timestamp.includes('T')) { 
            data.push({ vehicle_id, lap, value, timestamp });
        }
    }
    return data;
};

export const parseSROData = (): ReplayData => {
    const rawData = parseCSV(CSV_LAP_TIMES);
    
    // Group by vehicle
    const carsMap = new Map<string, RawLapData[]>();
    rawData.forEach(row => {
        if (!carsMap.has(row.vehicle_id)) {
            carsMap.set(row.vehicle_id, []);
        }
        carsMap.get(row.vehicle_id)?.push(row);
    });

    // Calculate Race Start Time
    // We look for the completion of Lap 1 for any car.
    // The race start time is: Lap 1 Finish Time - Lap 1 Duration.
    // We take the *minimum* of this value across all cars to define the simulation T=0.
    
    let earliestRaceStart = Infinity;

    carsMap.forEach((laps, vid) => {
        // We assume data is unordered, so finding Lap 1 is crucial.
        const lap1 = laps.find(l => l.lap === 1);
        if (lap1 && lap1.value > 0) {
            const lap1EndTimestamp = new Date(lap1.timestamp).getTime();
            const lap1DurationMs = lap1.value;
            const startTime = lap1EndTimestamp - lap1DurationMs;
            
            if (startTime < earliestRaceStart) {
                earliestRaceStart = startTime;
            }
        }
    });

    if (earliestRaceStart === Infinity) {
        // Fallback: if no Lap 1 found (unlikely), use the earliest timestamp in the dataset
        console.warn("No Lap 1 found for Race Start calculation. Using earliest timestamp.");
        earliestRaceStart = rawData.reduce((min, row) => {
            const t = new Date(row.timestamp).getTime();
            return t < min ? t : min;
        }, Infinity);
    }

    // Build Replay Data
    const cars: CarReplayData[] = [];
    let maxDuration = 0;

    carsMap.forEach((rows, vid) => {
        // Sort by lap to ensure sequence
        rows.sort((a, b) => a.lap - b.lap);

        const laps: LapReplayData[] = [];

        rows.forEach(row => {
            const lapEndTimeMs = new Date(row.timestamp).getTime();
            const relativeEndTime = (lapEndTimeMs - earliestRaceStart) / 1000;
            const durationSec = row.value / 1000;
            
            const relativeStartTime = relativeEndTime - durationSec;

            // Sanity check: start time shouldn't be drastically negative (allow small margin for grid stagger)
            // if (relativeStartTime < -120) return; 

            laps.push({
                lapNumber: row.lap,
                startTime: relativeStartTime,
                endTime: relativeEndTime,
                duration: durationSec
            });

            if (relativeEndTime > maxDuration) maxDuration = relativeEndTime;
        });

        if (laps.length > 0) {
            const parts = vid.split('-');
            const carNum = parseInt(parts[parts.length - 1]) || 0;

            cars.push({
                vehicleId: vid,
                carNumber: carNum,
                laps
            });
        }
    });

    return {
        cars,
        totalDuration: maxDuration
    };
};
