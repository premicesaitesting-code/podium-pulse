
import React, { useState, useCallback, useRef } from 'react';
import Card from './Card';
import { CarData, FlagStatus, TrackData } from '../types';

interface TrackMapProps {
  cars: CarData[];
  flagStatus: FlagStatus;
  track: TrackData;
}

const TrackMap: React.FC<TrackMapProps> = ({ cars, flagStatus, track }) => {
  const totalLength = track.length;
  
  // Transform State
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [pathEl, setPathEl] = useState<SVGPathElement | null>(null);
  const pathRef = useCallback((node: SVGPathElement | null) => {
      if (node) setPathEl(node);
  }, [track]); 

  // --- Zoom/Pan Handlers ---

  const handleZoom = (delta: number) => {
      setTransform(prev => ({
          ...prev,
          k: Math.max(0.5, Math.min(5, prev.k + delta))
      }));
  };

  const handleZoomLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTransform(prev => ({
          ...prev,
          k: parseFloat(e.target.value)
      }));
  };

  const handleReset = () => setTransform({ x: 0, y: 0, k: 1 });

  const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging) return;
      setTransform(prev => ({
          ...prev,
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
      }));
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
      // e.preventDefault(); // React synthetic events don't support preventDefault on passive listeners easily, relying on CSS touch-action if needed
      const scaleAmount = -e.deltaY * 0.001;
      setTransform(prev => ({
          ...prev,
          k: Math.max(0.5, Math.min(5, prev.k * (1 + scaleAmount)))
      }));
  };

  // --- Track Geometry ---

  const getPointAtDistance = (distance: number) => {
      if (!pathEl) return { x: 0, y: 0 };
      try {
        const len = pathEl.getTotalLength();
        if (len === 0) return { x: 0, y: 0 };
        
        const normalizedDist = distance % totalLength;
        const safeDist = normalizedDist < 0 ? normalizedDist + totalLength : normalizedDist;
        const svgDist = (safeDist / totalLength) * len;
        return pathEl.getPointAtLength(svgDist);
      } catch (e) {
        return { x: 0, y: 0 };
      }
  };

  return (
    <Card title={track.name} className="relative h-full flex flex-col overflow-hidden">
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-center gap-2 bg-dark-panel/90 backdrop-blur-md p-2 rounded-lg border border-medium-gray/30 shadow-xl">
          <button 
            onClick={() => handleZoom(0.2)} 
            className="w-8 h-8 bg-dark-bg border border-medium-gray/30 rounded text-white hover:bg-white/10 flex items-center justify-center font-bold transition-colors active:bg-race-red"
            title="Zoom In"
          >
            +
          </button>
          
          {/* Zoom Slider */}
          <div className="h-24 w-8 flex items-center justify-center relative">
               <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.1"
                  value={transform.k}
                  onChange={handleZoomLevelChange}
                  className="absolute w-24 h-2 bg-medium-gray/30 rounded-lg appearance-none cursor-pointer accent-race-red"
                  style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-90deg)' }}
               />
          </div>

          <button 
            onClick={() => handleZoom(-0.2)} 
            className="w-8 h-8 bg-dark-bg border border-medium-gray/30 rounded text-white hover:bg-white/10 flex items-center justify-center font-bold transition-colors active:bg-race-red"
            title="Zoom Out"
          >
            -
          </button>
          
          <div className="h-px w-full bg-medium-gray/30 my-1"></div>

          <button 
            onClick={handleReset} 
            className="w-8 h-8 bg-dark-bg border border-medium-gray/30 rounded text-white hover:bg-white/10 flex items-center justify-center text-[10px] font-bold transition-colors"
            title="Reset View"
          >
            RST
          </button>
          
          <div className="text-[10px] font-mono text-medium-gray font-bold">{transform.k.toFixed(1)}x</div>
      </div>

      {flagStatus === 'YELLOW' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-warning-yellow text-black font-black px-4 py-1 rounded animate-pulse z-10 shadow-[0_0_15px_rgba(255,215,0,0.8)]">
              SC DEPLOYED
          </div>
      )}
      
      <div 
        className="flex-grow relative overflow-hidden bg-dark-bg/30 rounded-lg cursor-move touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <svg 
          viewBox={track.mapViewBox} 
          className="w-full h-full p-4 transition-transform duration-75 ease-out origin-center" 
          preserveAspectRatio="xMidYMid meet"
          style={{
              transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`
          }}
        >
          <defs>
             <filter id="glow-track">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
             </filter>
          </defs>
          
          {/* Base Track (Asphalt) */}
          <path 
            ref={pathRef} 
            d={track.svgPath} 
            stroke="#4b5563" 
            strokeWidth="20" 
            fill="none" 
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-50"
          />
          
          {/* Racing Line / Center Line */}
          <path 
            d={track.svgPath} 
            stroke={flagStatus === 'YELLOW' ? '#FFD700' : '#9ca3af'} 
            strokeWidth="3" 
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={flagStatus === 'YELLOW' ? "url(#glow-track)" : ""}
            className="transition-colors duration-500"
          />

          {/* Sector Markers & POIs */}
          {pathEl && (
            <>
               {track.sectors.map(sector => {
                   const p = getPointAtDistance(sector.meter);
                   return (
                       <g key={sector.id} transform={`translate(${p.x}, ${p.y})`}>
                          <circle r="4" fill="#1f2937" stroke="#6b7280" strokeWidth="1" />
                          <text x="8" y="3" fill="#9ca3af" fontSize="12" fontWeight="bold" fontFamily="Orbitron">{sector.name}</text>
                       </g>
                   );
               })}

               {/* Pit Entry */}
               <circle cx={getPointAtDistance(track.pitEntry).x} cy={getPointAtDistance(track.pitEntry).y} r="4" fill="#E10600" stroke="white" strokeWidth="1" />
               
               {/* Start/Finish Line */}
               {(() => {
                 const p = getPointAtDistance(0);
                 return (
                   <line 
                     x1={p.x - 10} y1={p.y}
                     x2={p.x + 10} y2={p.y}
                     stroke="white" strokeWidth="4"
                   />
                 );
               })()}
            </>
          )}

          {/* Cars */}
          {pathEl && cars.map((car) => {
            const { x, y } = getPointAtDistance(car.lapDistance);
            const isPlayer = car.carNumber === 78;
            
            if (car.status === 'PITTING') return null; 

            return (
              <g key={car.carNumber} transform={`translate(${x}, ${y})`} className="transition-transform duration-100 ease-linear">
                {/* Prediction Ghost for Player */}
                {isPlayer && (
                     <circle r="20" fill="none" stroke="#00D9FF" strokeWidth="1" opacity="0.3">
                        <animate attributeName="r" from="8" to="30" dur="1.5s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite"/>
                     </circle>
                )}
                
                {/* Car Marker */}
                <circle
                  r={isPlayer ? "8" : "5"}
                  fill={isPlayer ? '#00D9FF' : (car.position === 1 ? '#FFD700' : '#E10600')}
                  stroke="white"
                  strokeWidth={isPlayer ? "2" : "1"}
                />
                
                {/* Car Label */}
                <text
                  y={-12}
                  textAnchor="middle"
                  fontSize={isPlayer ? "16" : "12"}
                  fill="white"
                  fontWeight="bold"
                  style={{ textShadow: '0 2px 4px black', fontFamily: 'Orbitron' }}
                >
                  {car.carNumber}
                </text>
              </g>
            );
          })}
        </svg>
        
        {/* Legend */}
        <div className="absolute bottom-2 left-2 flex flex-col gap-1 bg-black/60 backdrop-blur-sm p-2 rounded border border-white/10 text-[10px] font-bold text-light-gray pointer-events-none z-10">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00D9FF] border border-white"></div> YOU</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#FFD700] border border-white"></div> LEADER</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#E10600] border border-white"></div> OPPONENT</div>
        </div>
      </div>
    </Card>
  );
};

export default TrackMap;
