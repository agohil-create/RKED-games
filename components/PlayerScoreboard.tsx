import React from 'react';
import { Player } from '../types';
import { Crown, Skull } from 'lucide-react';
import { formatAddress } from '../utils/viemConfig';

interface Props {
  players: Player[];
}

const PlayerScoreboard: React.FC<Props> = ({ players }) => {
  // Sort by score descending
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="w-full lg:w-80 bg-secondary/50 backdrop-blur border-l border-white/5 p-6 flex flex-col gap-4">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Live Standings</h3>
      
      <div className="space-y-3">
        {sortedPlayers.map((player, index) => (
          <div 
            key={player.address}
            className={`relative p-4 rounded-lg border transition-all ${
                player.isCurrentUser 
                    ? 'bg-accentCyan/10 border-accentCyan/50' 
                    : 'bg-primary border-white/5'
            } ${player.status === 'eliminated' ? 'opacity-50 grayscale' : ''}`}
          >
            {index === 0 && player.status !== 'eliminated' && (
                <Crown className="absolute -top-3 -right-2 w-6 h-6 text-yellow-400 fill-yellow-400/20 rotate-12" />
            )}
            {player.status === 'eliminated' && (
                <Skull className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-danger opacity-20" />
            )}

            <div className="flex justify-between items-center mb-1">
                <span className={`font-mono text-sm font-bold ${player.isCurrentUser ? 'text-accentCyan' : 'text-white'}`}>
                    {player.isCurrentUser ? 'YOU' : formatAddress(player.address)}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                    player.status === 'active' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                }`}>
                    {player.status}
                </span>
            </div>
            <div className="text-2xl font-black text-white">
                {Math.floor(player.score)} <span className="text-xs font-normal text-gray-500">MASS</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerScoreboard;