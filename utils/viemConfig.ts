import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { baseSepolia } from 'viem/chains';

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export const getWalletClient = () => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    return createWalletClient({
      chain: baseSepolia,
      transport: custom((window as any).ethereum),
    });
  }
  return null;
};

export const formatAddress = (addr: string) => {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};