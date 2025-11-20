export const CONTRACT_ADDRESSES = {
  PVP_TOKEN: '0x1234...5678',
  GAME_LOBBY: '0xabcd...ef01',
  SESSION_MANAGER: '0x9876...5432',
};

export const CHAIN_ID = 84532; // Base Sepolia for dev

export const MOCK_LOBBIES = [
  { id: '1', name: 'High Rollers Only', betAmount: '1000', currentPlayers: 2, maxPlayers: 4, status: 'open' },
  { id: '2', name: 'Practice Arena', betAmount: '50', currentPlayers: 1, maxPlayers: 10, status: 'open' },
  { id: '3', name: 'Midnight Madness', betAmount: '500', currentPlayers: 4, maxPlayers: 4, status: 'active' },
] as const;

export const TOAST_DURATION = 3000;