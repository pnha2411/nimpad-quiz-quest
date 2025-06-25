
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

// Citrea testnet configuration - from https://docs.citrea.xyz/developer-documentation/chain-information
const CITREA_TESTNET = {
  CHAIN_ID: '0x5ffd4c', // 6289484 in decimal
  CHAIN_NAME: 'Citrea Testnet',
  RPC_URLS: ['https://rpc.testnet.citrea.xyz'],
  NATIVE_CURRENCY: {
    name: 'Citrea Bitcoin',
    symbol: 'cBTC',
    decimals: 18
  },
  BLOCK_EXPLORER_URLS: ['https://explorer.testnet.citrea.xyz']
};

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

      console.log('Connected to chain:', chainId);
      console.log('Citrea testnet chain ID:', CITREA_TESTNET.CHAIN_ID);

      setWalletState({
        isConnected: true,
        account: accounts[0],
        provider: ethersProvider,
        signer,
        chainId,
      });

      // Store connection state
      localStorage.setItem('walletConnected', 'true');

      // Check if we're on the correct network and inform user
      if (chainId !== CITREA_TESTNET.CHAIN_ID) {
        toast({
          title: "Wrong network detected",
          description: "Please switch to Citrea Testnet manually in MetaMask to access all features",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Wallet connected successfully",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)} on Citrea Testnet`,
        });
      }

      console.log('Wallet connected:', accounts[0]);

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

  const addCitreaNetwork = async () => {
    try {
      if (!window.ethereum) {
        toast({
          title: "MetaMask not found",
          description: "Please install MetaMask to add Citrea network",
          variant: "destructive",
        });
        return;
      }

      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: CITREA_TESTNET.CHAIN_ID,
          chainName: CITREA_TESTNET.CHAIN_NAME,
          nativeCurrency: CITREA_TESTNET.NATIVE_CURRENCY,
          rpcUrls: CITREA_TESTNET.RPC_URLS,
          blockExplorerUrls: CITREA_TESTNET.BLOCK_EXPLORER_URLS
        }]
      });

      toast({
        title: "Network added successfully",
        description: "Citrea Testnet has been added to MetaMask",
      });
    } catch (error: any) {
      console.error('Failed to add Citrea network:', error);
      toast({
        title: "Failed to add network",
        description: "Could not add Citrea network to MetaMask",
        variant: "destructive",
      });
    }
  };

  const switchToCitreaNetwork = async () => {
    try {
      if (!window.ethereum) {
        toast({
          title: "MetaMask not found",
          description: "Please install MetaMask to switch networks",
          variant: "destructive",
        });
        return;
      }

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CITREA_TESTNET.CHAIN_ID }],
      });
    } catch (error: any) {
      // If network is not added, try to add it
      if (error.code === 4902) {
        await addCitreaNetwork();
      } else {
        console.error('Failed to switch to Citrea network:', error);
        toast({
          title: "Failed to switch network",
          description: "Could not switch to Citrea network",
          variant: "destructive",
        });
      }
    }
  };

  const isOnCitreaNetwork = () => {
    return walletState.chainId === CITREA_TESTNET.CHAIN_ID;
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
        console.log('Chain changed to:', chainId);
        setWalletState(prev => ({
          ...prev,
          chainId,
        }));
        
        // Show notification about network change
        if (chainId === CITREA_TESTNET.CHAIN_ID) {
          toast({
            title: "Network switched",
            description: "Successfully connected to Citrea Testnet",
          });
        } else {
          toast({
            title: "Wrong network",
            description: "Please switch to Citrea Testnet to access all features",
            variant: "destructive",
          });
        }
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
    addCitreaNetwork,
    switchToCitreaNetwork,
    isOnCitreaNetwork,
    CITREA_TESTNET,
  };
};
