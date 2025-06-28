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
  CHAIN_ID: '0x13fb',
  CHAIN_NAME: 'Citrea Testnet',
  RPC_URLS: ['https://rpc.testnet.citrea.xyz'],
  NATIVE_CURRENCY: {
    name: 'Citrea Bitcoin',
    symbol: 'cBTC',
    decimals: 18
  },
  BLOCK_EXPLORER_URLS: ['https://explorer.testnet.citrea.xyz']
};

export const infoWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    account: null,
    provider: null,
    signer: null,
    chainId: null,
  });

  const getCurrentChainId = async () => {
    if (window.ethereum) {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        console.log('Current chain ID from wallet:', chainId);
        return chainId;
      } catch (error) {
        console.error('Error getting chain ID:', error);
        return null;
      }
    }
    return null;
  };

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
      console.log("signer from connect:", signer);
      
      // Get current chain ID directly from wallet
      const chainId = await getCurrentChainId();

      if (!chainId) {
        toast({
          title: "Failed to detect network",
          description: "Could not determine the connected network. Please try again.",
          variant: "destructive",
        });
        setWalletState({
          isConnected: false,
          account: null,
          provider: null,
          signer: null,
          chainId: null,
        });
        return;
      }

      console.log('Connected to chain:', chainId);

      setWalletState({
        isConnected: true,
        account: accounts[0],
        provider: ethersProvider,
        signer,
        chainId,
      });

      toast({
        title: "Wallet connected successfully",
        description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)} on chain ${chainId}`,
      });

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
    // No longer remove 'walletConnected' from localStorage
    
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
    console.log('Checking if on Citrea network:', walletState.chainId);
    return walletState.chainId === CITREA_TESTNET.CHAIN_ID;
  };

  const refreshNetworkInfo = async () => {
    if (walletState.isConnected && window.ethereum) {
      const chainId = await getCurrentChainId();
      if (chainId !== walletState.chainId) {
        setWalletState(prev => ({
          ...prev,
          chainId,
        }));
      }
    }
  };

  // Auto-connect if previously connected
  useEffect(() => {
    // No longer auto-connect based on localStorage
    // Optionally, you can remove this effect entirely if not needed
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

      const handleChainChanged = async (chainId: string) => {
        console.log('Chain changed to:', chainId);
        setWalletState(prev => ({
          ...prev,
          chainId,
        }));
        toast({
          title: "Network switched",
          description: `Connected to chain ${chainId}`,
        });
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

  // Refresh network info periodically when connected
  useEffect(() => {
    if (walletState.isConnected) {
      const interval = setInterval(refreshNetworkInfo, 5000); // Check every 5 seconds
      return () => clearInterval(interval);
    }
  }, [walletState.isConnected]);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    addCitreaNetwork,
    switchToCitreaNetwork,
    isOnCitreaNetwork,
    refreshNetworkInfo,
    CITREA_TESTNET,
  };
};
