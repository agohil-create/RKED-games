import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateLobbyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [bet, setBet] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement contract CreateGame call here
    alert("Creating game logic would trigger wallet transaction here.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-secondary w-full max-w-md rounded-2xl border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-white/5">
            <h2 className="text-xl font-bold text-white">Create Arena</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
            </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Lobby Name</label>
                <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-primary border border-white/10 rounded-lg p-3 text-white focus:border-accentGreen focus:ring-1 focus:ring-accentGreen outline-none transition-all"
                    placeholder="e.g., Sunday Showdown"
                    required
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bet Amount (PVP)</label>
                    <input 
                        type="number" 
                        value={bet}
                        onChange={e => setBet(e.target.value)}
                        className="w-full bg-primary border border-white/10 rounded-lg p-3 text-white font-mono focus:border-accentGreen focus:ring-1 focus:ring-accentGreen outline-none transition-all"
                        placeholder="100"
                        required
                    />
                </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Max Players</label>
                    <select className="w-full bg-primary border border-white/10 rounded-lg p-3 text-white outline-none">
                        <option value="2">2 Players</option>
                        <option value="4">4 Players</option>
                        <option value="8">8 Players</option>
                    </select>
                </div>
            </div>

            <button 
                type="submit"
                className="w-full bg-accentGreen hover:bg-accentGreen/90 text-black font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
                <Plus className="w-5 h-5" />
                CREATE AND STAKE
            </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLobbyModal;