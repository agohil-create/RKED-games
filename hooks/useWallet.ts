import { useState, useEffect, useCallback } from 'react';
import { getWalletClient, publicClient } from '../utils/viemConfig';
import { formatEther } from 'viem';

export const useWallet = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [isConnecting, setIsConnecting] = useState(false);

  const fetchBalance = useCallback(async (addr: string) => {
    try {
      if (addr.startsWith('0xMock')) {
          setBalance('10.000');
          return;
      }
      const bal = await publicClient.getBalance({ address: addr as `0x${string}` });
      setBalance(formatEther(bal));
    } catch (e) {
      console.error("Error fetching balance", e);
      // Fallback balance for demo if RPC fails
      if (addr.startsWith('0xMock')) setBalance('10.000');
    }
  }, []);

  const connect = async () => {
    setIsConnecting(true);
    try {
      const client = getWalletClient();
      if (!client) {
        console.warn("No wallet found. Falling back to Mock Wallet.");
        const mockAddress = '0xMock71C5A23';
        setAddress(mockAddress);
        await fetchBalance(mockAddress);
        return;
      }
      const [account] = await client.requestAddresses();
      setAddress(account);
      await fetchBalance(account);
    } catch (error) {
      console.error("Connection failed", error);
      // Fallback for smoother UX if user rejects or error occurs in demo environment
      console.warn("Falling back to Mock Wallet after error.");
      const mockAddress = '0xMock71C5A23';
      setAddress(mockAddress);
      await fetchBalance(mockAddress);
    } finally {
      setIsConnecting(false);
    }
  };

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const client = getWalletClient();
      if(client) {
         try {
             const accounts = await client.getAddresses();
             if(accounts.length > 0) {
                 setAddress(accounts[0]);
                 fetchBalance(accounts[0]);
             }
         } catch(e) { console.warn("Not connected"); }
      }
    }
    checkConnection();
  }, [fetchBalance]);

  return { address, balance, connect, isConnecting };
};