import { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, GameDot, Player } from '../types';

const ARENA_SIZE = 100; // 100x100 units
const BASE_SPEED = 0.5; // Speed factor
const PLAYER_COLORS = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
const FOOD_COLORS = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33A8'];

const generateFood = (count: number): GameDot[] => {
  return Array.from({ length: count }).map(() => ({
    id: Math.random().toString(36).substr(2, 9),
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1.0, // Small fixed size for food
    color: FOOD_COLORS[Math.floor(Math.random() * FOOD_COLORS.length)],
    value: 5
  }));
};

export const useGameData = (gameId: string, isSessionActive: boolean, userAddress: string | null) => {
  const [gameState, setGameState] = useState<GameState>({
    gameId,
    players: [],
    timeLeft: 300,
    status: 'waiting',
    food: []
  });

  // Refs for game loop to avoid dependency stale closures
  const gameStateRef = useRef<GameState>(gameState);
  const mousePositionRef = useRef<{ x: number, y: number } | null>(null);
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>();

  // Initialize Game
  useEffect(() => {
    if (!isSessionActive || !userAddress) return;

    const initialPlayers: Player[] = [
      { 
        id: 'local', 
        address: userAddress, 
        x: 50, 
        y: 50, 
        size: 4, 
        color: '#00FF00', 
        score: 100, 
        status: 'active', 
        isCurrentUser: true 
      },
      { 
        id: 'bot1', 
        address: '0xBotAlpha', 
        x: 20, 
        y: 20, 
        size: 5, 
        color: '#FF0000', 
        score: 150, 
        status: 'active' 
      },
      { 
        id: 'bot2', 
        address: '0xBotBeta', 
        x: 80, 
        y: 80, 
        size: 3, 
        color: '#0000FF', 
        score: 80, 
        status: 'active' 
      }
    ];

    const newState: GameState = {
      gameId,
      players: initialPlayers,
      timeLeft: 300,
      status: 'playing',
      food: generateFood(20)
    };

    setGameState(newState);
    gameStateRef.current = newState;

  }, [isSessionActive, gameId, userAddress]);

  // Game Loop
  const updateGame = useCallback((time: number) => {
    if (gameStateRef.current.status !== 'playing') return;

    const deltaTime = lastTimeRef.current ? (time - lastTimeRef.current) / 16 : 1; // Normalize to ~60fps
    lastTimeRef.current = time;

    setGameState(prevState => {
      const currentPlayers = [...prevState.players];
      let currentFood = [...prevState.food];

      // 1. Move Players
      const updatedPlayers = currentPlayers.map(p => {
        if (p.status === 'eliminated') return p;

        let targetX = p.x;
        let targetY = p.y;

        // Local Player moves towards mouse
        if (p.isCurrentUser && mousePositionRef.current) {
           targetX = mousePositionRef.current.x;
           targetY = mousePositionRef.current.y;
        } else if (!p.isCurrentUser) {
           // Simple AI: Move towards nearest food
           // In a real app, this comes from server via WebSocket
           let nearest = currentFood[0];
           let minStartDist = 9999;
           for(const f of currentFood) {
             const d = Math.hypot(f.x - p.x, f.y - p.y);
             if(d < minStartDist) {
               minStartDist = d;
               nearest = f;
             }
           }
           if (nearest) {
             targetX = nearest.x;
             targetY = nearest.y;
           }
        }

        // Physics: Move vector
        const dx = targetX - p.x;
        const dy = targetY - p.y;
        const distance = Math.hypot(dx, dy);
        
        // Speed is inversely proportional to size (bigger = slower)
        const speed = (BASE_SPEED / (p.size * 0.5)) * deltaTime;

        if (distance > 0.1) {
            // Move towards target
            const moveX = (dx / distance) * speed;
            const moveY = (dy / distance) * speed;
            
            // Boundary checks (0-100)
            return {
                ...p,
                x: Math.max(0, Math.min(100, p.x + moveX)),
                y: Math.max(0, Math.min(100, p.y + moveY))
            };
        }
        return p;
      });

      // 2. Collision Detection: Player vs Food
      updatedPlayers.forEach(player => {
        if (player.status === 'eliminated') return;

        currentFood = currentFood.filter(f => {
            // Simple circle collision
            const dist = Math.hypot(player.x - f.x, player.y - f.y);
            const collisionDist = player.size + (f.size / 2); // Approximate
            
            if (dist < collisionDist) {
                // Eat food
                player.score += f.value;
                // Grow size slightly (area = pi*r^2, so r = sqrt(area))
                // Simplified growth logic
                player.size = Math.sqrt(player.score) * 0.4; 
                return false; // Remove from food array
            }
            return true;
        });
      });

      // 3. Collision Detection: Player vs Player
      // Sort by size descending so larger ones process first
      const sortedIndices = updatedPlayers.map((p, i) => ({i, size: p.size})).sort((a, b) => b.size - a.size);
      
      for (let i = 0; i < sortedIndices.length; i++) {
        const predatorIdx = sortedIndices[i].i;
        const predator = updatedPlayers[predatorIdx];
        
        if (predator.status === 'eliminated') continue;

        for (let j = i + 1; j < sortedIndices.length; j++) {
           const preyIdx = sortedIndices[j].i;
           const prey = updatedPlayers[preyIdx];

           if (prey.status === 'eliminated') continue;

           const dist = Math.hypot(predator.x - prey.x, predator.y - prey.y);
           
           // Eating rule: Must be significantly larger (20%) and overlapping center
           if (predator.size > prey.size * 1.2 && dist < predator.size) {
               // Eat player
               predator.score += prey.score;
               predator.size = Math.sqrt(predator.score) * 0.4;
               prey.status = 'eliminated';
               prey.score = 0;
               prey.size = 0;
           }
        }
      }

      // Replenish food randomly
      if (currentFood.length < 20 && Math.random() > 0.9) {
          currentFood.push(...generateFood(1));
      }

      const nextState = {
          ...prevState,
          players: updatedPlayers,
          food: currentFood,
          timeLeft: Math.max(0, prevState.timeLeft - (deltaTime / 60))
      };
      gameStateRef.current = nextState;
      return nextState;
    });

    requestRef.current = requestAnimationFrame(updateGame);
  }, []);

  useEffect(() => {
    if (isSessionActive) {
        requestRef.current = requestAnimationFrame(updateGame);
    }
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isSessionActive, updateGame]);

  // Mouse Handler
  const handleMouseMove = (x: number, y: number) => {
      mousePositionRef.current = { x, y };
  };

  return { gameState, handleMouseMove };
};