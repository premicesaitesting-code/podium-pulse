
import { TrackData } from '../types';

export const TRACKS: Record<string, TrackData> = {
  COTA: {
    id: 'COTA',
    name: 'Circuit of the Americas',
    length: 5498,
    pitLoss: 36,
    mapViewBox: "0 0 800 500",
    // COTA Path
    svgPath: `
      M 160,360
      L 240,450
      Q 260,470 280,440
      L 300,410
      Q 320,390 340,380
      C 360,360 400,380 440,340
      S 500,300 540,320
      L 600,290
      Q 680,240 740,100
      Q 760,60 720,70
      L 360,120
      L 360,150
      L 380,160
      L 400,160
      L 380,190
      C 380,240 320,300 240,270
      L 200,260
      L 180,250
      L 130,310
      Z
    `,
    sectors: [
      { id: 'S1', name: 'S1', meter: 1308 },
      { id: 'S2', name: 'S2', meter: 3548 },
    ],
    pitEntry: 5280,
    segments: [
        { start: 0, end: 600, type: 'STRAIGHT', speed: 265, gLat: 0 },
        { start: 600, end: 800, type: 'CORNER', speed: 90, gLat: 1.2 }, // T1
        { start: 800, end: 1600, type: 'ESSES', speed: 190, gLat: 2.5 }, // Esses
        { start: 1600, end: 2800, type: 'STRAIGHT', speed: 275, gLat: 0 }, // Back Straight
        { start: 2800, end: 3000, type: 'CORNER', speed: 75, gLat: 1.5 }, // T12
        { start: 3000, end: 4000, type: 'TECHNICAL', speed: 140, gLat: 1.8 }, // Stadium
        { start: 4000, end: 4800, type: 'FAST_CORNER', speed: 230, gLat: 2.8 }, // T16-18
        { start: 4800, end: 5000, type: 'CORNER', speed: 110, gLat: 1.4 }, // T19
        { start: 5000, end: 5200, type: 'CORNER', speed: 120, gLat: 1.3 }, // T20
        { start: 5200, end: 5498, type: 'STRAIGHT', speed: 240, gLat: 0 }, // Pit Straight
    ]
  },
  IMS: {
    id: 'IMS',
    name: 'Indianapolis Motor Speedway',
    length: 3925,
    pitLoss: 63,
    mapViewBox: "0 0 800 500",
    // Stylized IMS Road Course Shape (North Up-ish)
    // Start Bottom (S/F), Clockwise
    svgPath: `
      M 450,450 
      L 200,450
      Q 150,450 150,400
      L 150,350
      C 100,350 100,300 150,300
      S 200,250 150,250
      L 100,250
      Q 50,250 50,200
      Q 50,150 100,150
      L 600,150
      Q 650,150 650,200
      L 650,250
      Q 650,300 700,300
      L 750,300
      Q 800,300 780,350
      C 760,400 700,450 450,450
      Z
    `,
    sectors: [
      { id: 'S1', name: 'S1', meter: 1364 },
      { id: 'S2', name: 'S2', meter: 2751 },
    ],
    pitEntry: 3415,
    segments: [
        { start: 0, end: 600, type: 'STRAIGHT', speed: 280, gLat: 0 }, // Main straight
        { start: 600, end: 1300, type: 'TECHNICAL', speed: 100, gLat: 1.5 }, // T1-T6 Infield
        { start: 1300, end: 2200, type: 'STRAIGHT', speed: 270, gLat: 0 }, // Back straight
        { start: 2200, end: 2800, type: 'CORNER', speed: 120, gLat: 2.0 }, // T7-T10
        { start: 2800, end: 3400, type: 'STRAIGHT', speed: 260, gLat: 0 }, // Short chute / oval T1
        { start: 3400, end: 3925, type: 'CORNER', speed: 150, gLat: 1.5 }, // T12-14
    ]
  }
};
