import React, { useRef, useEffect } from 'react';
import { GameDot, Player } from '../types';
import { Target, Skull } from 'lucide-react';

interface Props {
  players: Player[];
  food: GameDot[];
  onMouseMove: (x: number, y: number) => void;
  timeLeft: number;
}

const GameArena: React.FC<Props> = ({ players, food, onMouseMove, timeLeft }) => {
  const arenaRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!arenaRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();
    
    // Calculate percentage position (0-100)
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    onMouseMove(Math.min(100, Math.max(0, x)), Math.min(100, Math.max(0, y)));
  };

  return (
    <div 
        ref={arenaRef}
        onMouseMove={handleMouseMove}
        className="relative flex-1 bg-[#050505] overflow-hidden border-r border-white/5 cursor-crosshair select-none"
    >
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-20" 
             style={{ 
                 backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', 
                 backgroundSize: '40px 40px' 
             }} 
        />

        {/* HUD */}
        <div className="absolute top-6 right-6 z-20 pointer-events-none">
             <div className="bg-secondary/80 backdrop-blur border border-white/10 px-6 py-3 rounded-lg">
                <span className="block text-[10px] text-gray-500 uppercase font-bold">Time Remaining</span>
                <span className={`text-2xl font-mono font-bold ${timeLeft < 10 ? 'text-danger' : 'text-white'}`}>
                    {timeLeft.toFixed(0)}s
                </span>
             </div>
        </div>

        {/* Food Layer */}
        {food.map(dot => (
            <div
                key={dot.id}
                style={{
                    left: `${dot.x}%`,
                    top: `${dot.y}%`,
                    width: `${dot.size}vw`, // Relative to viewport for scaling
                    height: `${dot.size}vw`,
                    backgroundColor: dot.color,
                    boxShadow: `0 0 10px ${dot.color}`
                }}
                className="absolute rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out animate-pulse"
            />
        ))}

        {/* Players Layer */}
        {players.map(player => {
            if (player.status === 'eliminated') return null;

            return (
                <div
                    key={player.id}
                    style={{
                        left: `${player.x}%`,
                        top: `${player.y}%`,
                        width: `${player.size * 2}vw`, // Diameter
                        height: `${player.size * 2}vw`,
                        backgroundColor: player.isCurrentUser ? 'rgba(0, 255, 0, 0.2)' : `${player.color}33`, // Low opacity fill
                        borderColor: player.color,
                        zIndex: Math.floor(player.size) // Larger on top? Or smaller on top? usually larger covers.
                    }}
                    className={`absolute rounded-full border-2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-transform duration-75 ease-linear
                        ${player.isCurrentUser ? 'shadow-[0_0_30px_rgba(0,255,0,0.3)]' : ''}
                    `}
                >
                    {/* Inner Core */}
                    <div 
                        className="w-full h-full rounded-full opacity-50 absolute inset-0"
                        style={{ backgroundColor: player.color }}
                    />
                    
                    {/* Name/Score Label */}
                    <div className="relative z-10 text-center pointer-events-none mix-blend-difference text-white">
                        <div className="text-[10px] md:text-xs font-bold whitespace-nowrap">
                            {player.isCurrentUser ? 'YOU' : player.address.slice(0, 6)}
                        </div>
                        <div className="text-[8px] font-mono">{Math.floor(player.score)}</div>
                    </div>
                </div>
            );
        })}
    </div>
  );
};

export default GameArena;