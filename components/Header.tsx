import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import WalletConnectButton from './WalletConnectButton';
import { useWallet } from '../hooks/useWallet';

const Header: React.FC = () => {
  const { balance } = useWallet();

  return (
    <header className="sticky top-0 z-50 w-full bg-primary/90 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-accentGreen/10 rounded-lg border border-accentGreen/20 group-hover:border-accentGreen transition-colors">
                 <Zap className="w-6 h-6 text-accentGreen" />
            </div>
          <span className="text-xl font-black tracking-tighter text-white">
            DOT<span className="text-accentGreen">PVP</span>.FUN
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Balance</span>
            <span className="font-mono text-accentCyan">{parseFloat(balance).toFixed(4)} ETH</span>
          </div>
          <WalletConnectButton />
        </div>
      </div>
    </header>
  );
};

export default Header;