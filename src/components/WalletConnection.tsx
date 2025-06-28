
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
      <Button onClick={onConnect} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
        <Wallet className="w-4 h-4 mr-2" />
        Connect MetaMask
      </Button>
    );
  }

  const isCorrectNetwork = isOnCitreaNetwork();

  return (
    <div className="flex items-center space-x-3">
      <div className={`hidden sm:flex items-center space-x-2 rounded-lg px-3 py-2 ${
        isCorrectNetwork 
          ? 'bg-green-50 border border-green-200' 
          : 'bg-red-50 border border-red-200'
      }`}>
        <div className={`w-2 h-2 rounded-full ${isCorrectNetwork ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <div>
          <span className={`text-sm font-medium ${isCorrectNetwork ? 'text-green-800' : 'text-red-800'}`}>
            {account?.slice(0, 6)}...{account?.slice(-4)}
          </span>
          <div className={`text-xs ${isCorrectNetwork ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrectNetwork ? 'Citrea Testnet' : `Chain: ${chainId || 'Unknown'}`}
          </div>
        </div>
      </div>
      
      {!isCorrectNetwork && (
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshNetwork}
            className="hover:bg-gray-50 hover:border-gray-300"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={switchToCitreaNetwork}
            className="hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Switch Network
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addCitreaNetwork}
            className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Network
          </Button>
        </div>
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onDisconnect}
        className="hover:bg-red-50 hover:border-red-200 hover:text-red-700"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline ml-2">Disconnect</span>
      </Button>
    </div>
  );
};
