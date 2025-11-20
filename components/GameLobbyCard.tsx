import React from 'react';
import { Users, DollarSign, ArrowRight } from 'lucide-react';
import { GameLobby } from '../types';
import { useNavigate } from 'react-router-dom';

interface Props {
  lobby: GameLobby;
}

const GameLobbyCard: React.FC<Props> = ({ lobby }) => {
  const navigate = useNavigate();
  const isFull = lobby.currentPlayers >= lobby.maxPlayers;

  const handleJoin = () => {
      // In a real app, this would trigger the 'Join Game' transaction first
      navigate(`/game/${lobby.id}`);
  };

  return (
    <div className="group relative bg-secondary rounded-xl border border-white/5 p-6 hover:border-accentCyan/50 transition-all duration-300 overflow-hidden">
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-accentCyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-white truncate pr-4">{lobby.name}</h3>
                <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded border ${
                    lobby.status === 'active' ? 'bg-accentGreen/10 border-accentGreen text-accentGreen' : 'bg-gray-800 border-gray-700 text-gray-400'
                }`}>
                    {lobby.status}
                </span>
            </div>
            
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
                <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>{lobby.currentPlayers}/{lobby.maxPlayers}</span>
                </div>
                <div className="flex items-center gap-1.5 text-accentCyan">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-mono font-bold">{lobby.betAmount} PVP</span>
                </div>
            </div>
        </div>

        <button
          onClick={handleJoin}
          disabled={isFull && lobby.status !== 'active'}
          className={`mt-6 w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-sm transition-all ${
            isFull && lobby.status !== 'active'
              ? 'bg-secondary border border-white/10 text-gray-500 cursor-not-allowed'
              : 'bg-white/5 hover:bg-accentCyan hover:text-primary border border-white/10 hover:border-accentCyan'
          }`}
        >
          {lobby.status === 'active' ? 'WATCH GAME' : isFull ? 'LOBBY FULL' : 'JOIN LOBBY'}
          {lobby.status !== 'active' && !isFull && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default GameLobbyCard;