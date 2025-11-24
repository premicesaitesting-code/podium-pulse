
import React from 'react';
import Card from './Card';
import { CarData } from '../types';

interface GapManagementProps {
  playerCar: CarData | undefined;
  carAhead: CarData | undefined;
  carBehind: CarData | undefined;
}

const GapManagement: React.FC<GapManagementProps> = ({ playerCar, carAhead, carBehind }) => {

  const gapToAhead = carAhead?.gapToNext ?? 0;
  const gapToBehind = playerCar?.gapToNext ?? 0;

  let mode = 'MAINTAIN';
  let modeColor = 'text-light-gray';

  if (gapToAhead < 1.5) {
      mode = 'ATTACK';
      modeColor = 'text-accent-green';
  } else if (gapToBehind < 1.5) {
      mode = 'DEFEND';
      modeColor = 'text-warning-yellow';
  }


  return (
    <Card title="Gap Management">
      <div className="flex flex-col h-full justify-around">
        <div className="flex justify-around items-center text-center">
            <div>
                <p className="text-xs text-medium-gray uppercase">To Car Ahead</p>
                <p className="text-3xl font-bold">{carAhead ? `+${gapToAhead.toFixed(1)}s` : 'N/A'}</p>
                <p className="text-sm text-medium-gray">{carAhead ? `#${carAhead.carNumber} P${carAhead.position}` : ''}</p>
            </div>
            <div>
                <p className="text-xs text-medium-gray uppercase">To Car Behind</p>
                <p className="text-3xl font-bold">{carBehind ? `-${gapToBehind.toFixed(1)}s` : 'N/A'}</p>
                <p className="text-sm text-medium-gray">{carBehind ? `#${carBehind.carNumber} P${carBehind.position}` : ''}</p>
            </div>
        </div>
        <div className="text-center mt-2">
            <p className="text-xs text-medium-gray uppercase">Strategic Mode</p>
            <p className={`text-2xl font-black ${modeColor}`}>{mode}</p>
        </div>
      </div>
    </Card>
  );
};

export default GapManagement;
