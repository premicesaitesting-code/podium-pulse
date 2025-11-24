
export type TireCompound = 'SOFT' | 'HARD' | 'WET';
export type CarStatus = 'RUNNING' | 'PITTING' | 'OUT';
export type FlagStatus = 'GREEN' | 'YELLOW' | 'SC' | 'RED';

export interface TelemetryData {
    rpm: number;
    gear: number;
    speed: number;
    throttle: number; // 0-100
    brake: number; // 0-100
    steering: number; // -180 to 180
    gLat: number;
    gLong: number;
    gpsLat: number;
    gpsLong: number;
}

export interface CarData {
  carNumber: number;
  driverName: string;
  teamName?: string;
  position: number;
  distance: number; // Total meters traveled
  lapDistance: number; // Meters traveled in current lap
  lap: number;
  lastLapTime: number;
  bestLapTime: number;
  currentSectorTime: number;
  lapTime?: number;
  gapToLeader: number;
  gapToNext: number;
  
  // Telemetry
  telemetry: TelemetryData;
  
  // Vehicle State
  tireWear: number; // 0-100% (100 is new)
  tireTemp: number;
  tireCompound: TireCompound;
  tireAge: number; // Laps
  fuelRemaining: number; // Liters
  fuelConsPerLap: number;
  damage: number; // 0-100%
  
  // Strategy
  status: CarStatus;
  pitStopTimer: number; // Countdown if in pit
  lastPitLap: number;
  pitStrategy: string; // e.g., "1 Stop (L12)"
  
  // Computed/Analysis
  drsAvailable: boolean;
  tireStressIndex: number;
  driverSmoothness: number;
  predictedFinishPosition?: number;

  // Additional Simulation Data
  gForce?: number;
  brakeTemp?: number;
  aggression?: number;
}

export interface Recommendation {
    id: string;
    type: 'STRATEGY' | 'WARNING' | 'CRITICAL' | 'INFO';
    message: string;
    subtext?: string;
    action?: string;
    actionLabel?: string;
    onAction?: () => void;
    expiresAt?: number;
}

export interface RaceState {
    flag: FlagStatus;
    safetyCarDeployed: boolean;
    weather: 'DRY' | 'WET';
    trackTemp: number;
    airTemp: number;
    rainProbability: number;
}

export interface TrackSegment {
    start: number;
    end: number;
    type: 'STRAIGHT' | 'CORNER' | 'ESSES' | 'TECHNICAL' | 'FAST_CORNER';
    speed: number;
    gLat: number;
}

export interface TrackData {
    id: string;
    name: string;
    length: number; // meters
    pitLoss: number; // seconds
    mapViewBox: string;
    svgPath: string;
    sectors: {
        id: string;
        name: string;
        meter: number;
    }[];
    pitEntry: number; // meter
    segments: TrackSegment[];
}

export interface LapData {
    lap: number;
    cars: CarData[];
}

export type RaceData = LapData[];

// Replay Data Types
export interface LapReplayData {
    lapNumber: number;
    startTime: number; // Seconds from race start
    endTime: number;   // Seconds from race start
    duration: number;  // Seconds
}

export interface CarReplayData {
    carNumber: number;
    vehicleId: string;
    laps: LapReplayData[];
}

export interface ReplayData {
    cars: CarReplayData[];
    totalDuration: number;
}
