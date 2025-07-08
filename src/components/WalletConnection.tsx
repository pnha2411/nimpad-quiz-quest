
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

  return (
    <div className="flex items-center">
      {isConnected && account ? (
        <div className="flex items-center space-x-3">
          <div className="text-sm">
            <div className="font-medium">{account.slice(0, 6)}...{account.slice(-4)}</div>
          </div>
          <Button
            onClick={onDisconnect}
            variant="outline"
            size="sm"
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button onClick={onConnect} size="sm">
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </Button>
      )}
    </div>
  );
};
