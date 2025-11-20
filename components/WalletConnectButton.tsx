import React from 'react';
import { Wallet, Loader2 } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { formatAddress } from '../utils/viemConfig';

const WalletConnectButton: React.FC = () => {
  const { address, connect, isConnecting } = useWallet();

  if (address) {
    return (
      <div className="flex items-center gap-2 bg-secondary border border-accentGreen/30 rounded-full px-4 py-2 text-accentGreen shadow-[0_0_10px_rgba(0,255,0,0.2)]">
        <div className="w-2 h-2 bg-accentGreen rounded-full animate-pulse" />
        <span className="font-mono text-sm font-bold">{formatAddress(address)}</span>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={isConnecting}
      className="flex items-center gap-2 bg-primary border border-accentCyan hover:bg-accentCyan/10 text-accentCyan px-4 py-2 rounded-lg transition-all duration-300 font-mono text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isConnecting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Wallet className="w-4 h-4" />
      )}
      {isConnecting ? 'CONNECTING...' : 'CONNECT WALLET'}
    </button>
  );
};

export default WalletConnectButton;