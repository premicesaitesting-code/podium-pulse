
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from './Card';
import { LapData } from '../types';

interface PerformanceGraphProps {
  historicalData: LapData[];
  currentLap: number;
}

const PerformanceGraph: React.FC<PerformanceGraphProps> = ({ historicalData }) => {
  const chartData = historicalData.map(lapData => {
    const playerCar = lapData.cars.find(c => c.carNumber === 78);
    const rivalCar = lapData.cars.find(c => c.carNumber === 42);
    return {
      lap: lapData.lap,
      'You': playerCar?.lapTime,
      'Rival': rivalCar?.lapTime,
    };
  });

  const domain = [91, 95];

  return (
    <Card title="Performance Pulse">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#6b7280" strokeOpacity={0.3} />
          <XAxis dataKey="lap" stroke="#d1d5db" label={{ value: 'Lap', position: 'insideBottom', offset: -5, fill: '#d1d5db' }} />
          <YAxis stroke="#d1d5db" domain={domain} label={{ value: 'Time (s)', angle: -90, position: 'insideLeft', fill: '#d1d5db' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #6b7280' }} 
            labelStyle={{ color: '#d1d5db' }}
          />
          <Legend wrapperStyle={{color: '#d1d5db'}}/>
          <Line type="monotone" dataKey="You" stroke="#00D9FF" strokeWidth={2} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="Rival" stroke="#E10600" strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default PerformanceGraph;
