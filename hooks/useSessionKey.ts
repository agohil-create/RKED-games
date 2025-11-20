import { useState, useCallback } from 'react';
import { getWalletClient } from '../utils/viemConfig';

export const useSessionKey = (gameId: string) => {
  const [hasSession, setHasSession] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const createSession = useCallback(async (walletAddress: string) => {
    setIsCreatingSession(true);
    try {
      const client = getWalletClient();
      
      // If client exists and it's not a mock address, try real signing
      if (client && !walletAddress.startsWith('0xMock')) {
        const message = `Authorize Session Key for Game ${gameId}`;
        await client.signMessage({
            account: walletAddress as `0x${string}`,
            message: message
        });
      } else {
         // Simulate signing for mock wallet or missing client
         console.log("Simulating session signature for:", walletAddress);
      }

      // Simulate network delay for transaction
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setHasSession(true);
      return true;
    } catch (error) {
      console.error("Failed to create session", error);
      return false;
    } finally {
      setIsCreatingSession(false);
    }
  }, [gameId]);

  // Mock: In-game action signing using the session key
  const signAction = (actionType: string, payload: any) => {
     if(!hasSession) return null;
     return {
         payload,
         signature: "0x_mock_session_signature", 
         timestamp: Date.now()
     };
  };

  return { hasSession, isCreatingSession, createSession, signAction };
};