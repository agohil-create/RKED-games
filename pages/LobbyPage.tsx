import React from 'react';
import LobbyList from '../components/LobbyList';

const LobbyPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-12 p-8 rounded-2xl bg-gradient-to-r from-secondary to-transparent border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accentGreen/10 blur-[100px] rounded-full pointer-events-none" />
        <h2 className="text-3xl font-bold text-white mb-4">Welcome to the Arena</h2>
        <p className="text-gray-400 max-w-2xl text-lg">
            DotPVP is a high-frequency reaction game built on Base. Stake tokens, generate a session key, and compete in real-time. 
            Transactions are batched for gas efficiency.
        </p>
      </div>
      <LobbyList />
    </div>
  );
};

export default LobbyPage;