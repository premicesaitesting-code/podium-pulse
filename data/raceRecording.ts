
// Simulated recorded data from COTA (approx 2:12 - 2:15 lap times)
export const RECORDED_LAPS = {
    // Base lap times (seconds) for key drivers
    78: [132.5, 132.1, 131.8, 131.5, 131.9, 132.2, 132.5, 132.8, 133.1, 133.5, 135.0, 131.0, 130.8, 130.5, 130.9, 131.2, 131.5, 132.0, 132.5, 133.0], // You (Pits Lap 11)
    46: [131.0, 130.8, 130.5, 130.2, 130.5, 130.8, 131.0, 133.5, 130.0, 129.8, 129.9, 130.2, 130.5, 130.8, 131.0, 131.2, 131.5, 131.8, 132.0, 132.2], // Rival (Pits Lap 8)
    1:  [131.5, 131.2, 131.0, 130.8, 131.0, 131.2, 131.5, 131.8, 132.0, 134.5, 130.5, 130.8, 131.0, 131.2, 131.5, 131.8, 132.0, 132.2, 132.5, 132.8], // Ace
    99: [132.0, 131.8, 131.5, 131.2, 131.5, 131.8, 132.0, 132.2, 132.5, 132.8, 133.0, 133.2, 133.5, 135.5, 131.0, 131.2, 131.5, 131.8, 132.0, 132.2], // Vet
    23: [133.0, 132.8, 132.5, 132.2, 132.5, 132.8, 133.0, 133.2, 133.5, 133.8, 134.0, 134.2, 134.5, 134.8, 135.0, 137.0, 132.5, 132.8, 133.0, 133.2], // Rookie
    42: [134.0, 133.8, 133.5, 133.2, 133.5, 133.8, 134.0, 134.2, 134.5, 134.8, 135.0, 135.2, 135.5, 135.8, 136.0, 136.2, 136.5, 136.8, 137.0, 137.2], // Chaser
};

// Helper to get target speed at a specific distance on a lap
// Simple interpolation: track is fast in straights, slow in corners
// We scale the "Track Segment Speed" to match the "Recorded Lap Time"
export const getTargetSpeed = (
    carNumber: number, 
    lap: number, 
    distance: number, 
    trackLength: number, 
    baseSegmentSpeed: number
): number => {
    const laps = RECORDED_LAPS[carNumber as keyof typeof RECORDED_LAPS] || RECORDED_LAPS[78];
    const targetLapTime = laps[Math.min(lap - 1, laps.length - 1)];
    
    // Average speed needed to hit lap time (m/s) -> km/h
    const avgSpeedKph = (trackLength / targetLapTime) * 3.6;
    
    // Base track avg speed is roughly 170kph for COTA simulation
    const trackAvgScale = avgSpeedKph / 150; // Scaling factor
    
    return baseSegmentSpeed * trackAvgScale;
};