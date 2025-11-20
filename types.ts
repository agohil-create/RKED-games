export interface Player {
  id: string;
  address: string;
  x: number; // 0-100 percentage relative to arena
  y: number; // 0-100 percentage relative to arena
  size: number; // Radius in percentage
  color: string;
  score: number; // Mass
  status: 'active' | 'eliminated';
  isCurrentUser?: boolean;
  velocity?: { x: number; y: number };
}

export interface GameLobby {
  id: string;
  name: string;
  betAmount: string; // In PVPToken
  currentPlayers: number;
  maxPlayers: number;
  status: 'open' | 'starting' | 'active' | 'ended';
}

export interface GameState {
  gameId: string;
  players: Player[];
  timeLeft: number;
  status: 'waiting' | 'playing' | 'settling' | 'finished';
  food: GameDot[];
}

export interface GameDot {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  value: number;
}

export enum TransactionStatus {
  IDLE = 'IDLE',
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}