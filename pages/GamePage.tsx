import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { useSessionKey } from '../hooks/useSessionKey';
import { useGameData } from '../hooks/useGameData';
import GameArena from '../components/GameArena';
import PlayerScoreboard from '../components/PlayerScoreboard';

const GamePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { address, connect } = useWallet();
  const gameId = id || '0';
  
  const { hasSession, isCreatingSession, createSession } = useSessionKey(gameId);
  const { gameState, handleMouseMove } = useGameData(gameId, hasSession, address);

  // Redirect if no wallet
  useEffect(() => {
      if(!address && !localStorage.getItem('wallet_connected')) {
          // Optional: auto connect logic or wait for user
      }
  }, [address]);

  if (!address) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
        <div className="p-4 bg-secondary rounded-full border border-white/10">
            <AlertTriangle className="w-12 h-12 text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold text-white">Wallet Connection Required</h2>
        <p className="text-gray-400 max-w-md">You must connect your wallet to view ongoing games and verify your identity on Base.</p>
        <button 
            onClick={connect}
            className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
        >
            Connect Wallet
        </button>
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
         <div className="p-4 bg-secondary rounded-full border border-white/10 shadow-[0_0_30px_rgba(0,170,170,0.2)]">
            <ShieldCheck className="w-12 h-12 text-accentCyan" />
        </div>
        <h2 className="text-3xl font-bold text-white">Initialize Session Key</h2>
        <p className="text-gray-400 max-w-lg">
            To enable real-time physics and movement without signing a transaction for every frame, 
            please authorize a temporary session key.
        </p>
        <button 
            onClick={() => createSession(address)}
            disabled={isCreatingSession}
            className="relative group px-8 py-4 bg-accentCyan text-black font-bold rounded-lg overflow-hidden"
        >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative flex items-center gap-2">
                {isCreatingSession ? 'SIGNING...' : 'AUTHORIZE SESSION'}
            </span>
        </button>
        <button onClick={() => navigate('/')} className="text-sm text-gray-500 hover:text-white underline">
            Cancel & Return to Lobby
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <h1 className="text-xl font-bold text-white">Match #{gameId.substring(0,4)}</h1>
          <span className="px-2 py-0.5 bg-green-900/50 border border-green-500/30 text-green-400 text-xs rounded font-mono">
              LIVE
          </span>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row border border-white/10 rounded-2xl overflow-hidden bg-secondary shadow-2xl">
        <GameArena 
            players={gameState.players} 
            food={gameState.food}
            onMouseMove={handleMouseMove} 
            timeLeft={gameState.timeLeft}
        />
        <PlayerScoreboard players={gameState.players} />
      </div>
    </div>
  );
};

export default GamePage;