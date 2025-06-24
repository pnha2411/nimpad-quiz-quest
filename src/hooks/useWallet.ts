
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import { toast } from '@/hooks/use-toast';

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletState {
  isConnected: boolean;
  account: string | null;
  provider: any;
  signer: any;
  chainId: string | null;
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    account: null,
    provider: null,
    signer: null,
    chainId: null,
  });

  const connectWallet = async () => {
    try {
      const provider = await detectEthereumProvider();
      
      if (!provider) {
        toast({
          title: "MetaMask not found",
          description: "Please install MetaMask to continue",
          variant: "destructive",
        });
        return;
      }

      // Request account access
      const accounts = await (provider as any).request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts.length === 0) {
        toast({
          title: "No accounts found",
          description: "Please unlock MetaMask and try again",
          variant: "destructive",
        });
        return;
      }

      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      const chainId = await (provider as any).request({ method: 'eth_chainId' });

      setWalletState({
        isConnected: true,
        account: accounts[0],
        provider: ethersProvider,
        signer,
        chainId,
      });

      // Store connection state
      localStorage.setItem('walletConnected', 'true');

      toast({
        title: "Wallet connected successfully",
        description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
      });

      console.log('Wallet connected:', accounts[0]);
      console.log('Chain ID:', chainId);

    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection failed",
        description: "Failed to connect to MetaMask",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = () => {
    setWalletState({
      isConnected: false,
      account: null,
      provider: null,
      signer: null,
      chainId: null,
    });
    localStorage.removeItem('walletConnected');
    
    toast({
      title: "Wallet disconnected",
      description: "You have been disconnected from MetaMask",
    });
  };

  const switchNetwork = async (targetChainId: string) => {
    try {
      await walletState.provider?.send('wallet_switchEthereumChain', [
        { chainId: targetChainId },
      ]);
    } catch (error: any) {
      if (error.code === 4902) {
        toast({
          title: "Network not found",
          description: "Please add the Citrea network to MetaMask manually",
          variant: "destructive",
        });
      }
    }
  };

  // Auto-connect if previously connected
  useEffect(() => {
    const wasConnected = localStorage.getItem('walletConnected');
    if (wasConnected === 'true') {
      connectWallet();
    }
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setWalletState(prev => ({
            ...prev,
            account: accounts[0],
          }));
        }
      };

      const handleChainChanged = (chainId: string) => {
        setWalletState(prev => ({
          ...prev,
          chainId,
        }));
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  };
};
