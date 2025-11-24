
// Actual SRO Race Data Export (Simulated structure for COTA Race 2)
// Format: meta_source,meta_time,meta_event,meta_session,timestamp,vehicle_id,outing,lap,value,expire_at

const RACE_START_ISO = "2024-05-19T19:05:00.000Z";
const CARS = [
    { id: "GR86-004-78", number: 78, basePace: 149500, variability: 400 }, // You (2:29.5)
    { id: "GR86-001-46", number: 46, basePace: 149000, variability: 300 }, // Rival (2:29.0)
    { id: "GR86-002-1",  number: 1,  basePace: 149800, variability: 500 }, // Ace
    { id: "GR86-003-99", number: 99, basePace: 150200, variability: 400 }, // Vet
    { id: "GR86-005-23", number: 23, basePace: 151000, variability: 800 }, // Rookie
    { id: "GR86-006-42", number: 42, basePace: 150500, variability: 400 }, // Chaser
];

const TOTAL_LAPS = 17;

const generateCSV = () => {
    let csv = `"meta_source","meta_time","meta_event","meta_session","timestamp","vehicle_id","outing","lap","value","expire_at"\n`;
    
    CARS.forEach(car => {
        let currentTime = new Date(RACE_START_ISO).getTime();
        
        // Add Lap 0 (Grid/Formation - invalid for race logic but present in data)
        csv += `"kafka","${new Date(currentTime).toISOString()}","Race","R2","${new Date(currentTime).toISOString()}","${car.id}",0,0,0,0\n`;

        for (let lap = 1; lap <= TOTAL_LAPS; lap++) {
            // Simulate lap time
            let lapTime = car.basePace + (Math.random() * car.variability * 2 - car.variability);
            
            // Add fuel burn effect (faster as race goes on)
            lapTime -= (lap * 100); 
            
            // Add tire wear effect (slower at end)
            if (lap > 12) lapTime += ((lap - 12) * 300);

            // Pit stop logic simulation (Car 42 pits lap 10)
            if (car.number === 42 && lap === 10) {
                lapTime += 36000; // Pit loss
            }

            // Update current time to be the END of the lap
            currentTime += lapTime;
            const timestamp = new Date(currentTime).toISOString();

            csv += `"kafka","${timestamp}","Race","R2","${timestamp}","${car.id}",0,${lap},${Math.floor(lapTime)},0\n`;
        }
    });

    return csv;
};

export const CSV_LAP_TIMES = generateCSV();
