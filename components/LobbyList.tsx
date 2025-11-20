import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import GameLobbyCard from './GameLobbyCard';
import CreateLobbyModal from './CreateLobbyModal';
import { MOCK_LOBBIES } from '../constants';

const LobbyList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
            <h1 className="text-4xl font-black text-white mb-2">LIVE ARENAS</h1>
            <p className="text-gray-400">Join a lobby or create your own to earn PVP tokens.</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors"
        >
            <Plus className="w-4 h-4" />
            CREATE LOBBY
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_LOBBIES.map(lobby => (
            // @ts-ignore: MOCK_LOBBIES has slightly different typing for readonly array in constants
            <GameLobbyCard key={lobby.id} lobby={lobby} />
        ))}
      </div>

      <CreateLobbyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default LobbyList;