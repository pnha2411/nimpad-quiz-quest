
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, Plus, RefreshCw } from 'lucide-react';
import { infoWallet } from '@/hooks/useWallet';

interface WalletConnectionProps {
  isConnected: boolean;
  account: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({
  isConnected,
  account,
  onConnect,
  onDisconnect,
}) => {
  const { isOnCitreaNetwork, addCitreaNetwork, switchToCitreaNetwork, refreshNetworkInfo, chainId, CITREA_TESTNET } = infoWallet();

  const handleRefreshNetwork = async () => {
    await refreshNetworkInfo();
  };

  if (!isConnected) {
    return (
      <Button onClick={onConnect} size="sm">
        <Wallet className="w-4 h-4 mr-2" />
        Connect
      </Button>
    );
  }

  const isCorrectNetwork = isOnCitreaNetwork();

  return (
    <div className="flex items-center gap-2">
      {/* Status indicator */}
      <div className={`flex items-center gap-2 px-2 py-1 rounded text-xs ${
        isCorrectNetwork 
          ? 'bg-green-100 text-green-700' 
          : 'bg-orange-100 text-orange-700'
      }`}>
        <div className={`w-1.5 h-1.5 rounded-full ${isCorrectNetwork ? 'bg-green-500' : 'bg-orange-500'}`}></div>
        <span className="hidden sm:inline">
          {account?.slice(0, 6)}...{account?.slice(-4)}
        </span>
      </div>
      
      {/* Network actions for wrong network */}
      {!isCorrectNetwork && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={switchToCitreaNetwork}
          className="text-xs"
        >
          Switch Network
        </Button>
      )}
      
      {/* Disconnect */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onDisconnect}
        className="p-1"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );
};
