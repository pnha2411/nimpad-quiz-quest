import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Coins, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { infoWallet } from '@/hooks/useWallet';
import { useWallet } from '@/hooks/WalletContext';
import { toast } from '@/hooks/use-toast';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

interface TokenClaimingProps {
  availablePoints: number;
  onBack: () => void;
}

// Citrea contract addresses - replace with actual deployed contracts
const CITREA_CONTRACTS = {
  POINTS_TRACKER: "0x1234567890123456789012345678901234567890", // Replace with actual points contract
  TOKEN_CLAIM: "0xA1F002bf7cAD148a639418D77b93912871901875",    // Replace with actual Citrea token contract
};

// Example ABI for token claiming - replace with actual contract ABI
const TOKEN_CLAIM_ABI = [
  "function mint(address to, uint256 amount) external",
  "function getClaimableAmount(address user) external view returns (uint256)",
  "function hasClaimedToday(address user) external view returns (bool)",
  "event TokensClaimed(address indexed user, uint256 amount)"
];

export const TokenClaiming: React.FC<TokenClaimingProps> = ({
  availablePoints,
  onBack,
}) => {
  const { isConnected, account, chainId, isOnCitreaNetwork, CITREA_TESTNET } = infoWallet();
  const { signer } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [claimStatus, setClaimStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string>('');
  const [gasEstimate, setGasEstimate] = useState<string>('');
  availablePoints = 30;

  const handleClaimTokens = async () => {
    console.log("signer to claim:", signer);
    if (availablePoints === 0) {
      toast({
        title: "Cannot claim tokens",
        description: "Please ensure your wallet is connected and you have points to claim.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setClaimStatus('pending');

    try {
      // Create contract instance with actual ABI and address
      const provider = await detectEthereumProvider();
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer_wallet = await ethersProvider.getSigner();
      const contract = new ethers.Contract(
        CITREA_CONTRACTS.TOKEN_CLAIM,
        TOKEN_CLAIM_ABI,
        signer_wallet
      );

      // Check if user has already claimed today (if contract has this restriction)
      try {
        const hasClaimedToday = await contract.hasClaimedToday(account);
        if (hasClaimedToday) {
          toast({
            title: "Already claimed today",
            description: "You can only claim tokens once per day.",
            variant: "destructive",
          });
          setClaimStatus('error');
          return;
        }
      } catch (error) {
        // Contract might not have this function, continue
        console.log('Daily claim check not available:', error);
      }

      // Execute the claim transaction
      console.log('Calling claimTokens function...');
      const accounts = await (provider as any).request({ 
        method: 'eth_requestAccounts' 
      });
      const tx = await contract.mint(accounts[0], availablePoints, {
        gasLimit: 300000,
      });

      setTxHash(tx.hash);
      
      toast({
        title: "Transaction submitted",
        description: "Your claim transaction has been submitted. Waiting for confirmation...",
      });

      console.log('Transaction submitted:', tx.hash);

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        setClaimStatus('success');
        
        toast({
          title: "Tokens claimed successfully!",
          description: `You have successfully claimed ${availablePoints} tokens.`,
        });

        console.log('Token claim successful:', receipt);
        
      } else {
        throw new Error('Transaction failed');
      }

    } catch (error: any) {
      console.error('Token claim failed:', error);
      setClaimStatus('error');
      
      let errorMessage = "There was an error claiming your tokens. Please try again.";
      
      // Handle specific error types
      if (error.code === 4001) {
        errorMessage = "Transaction was rejected by user.";
      } else if (error.code === -32603) {
        errorMessage = "Internal JSON-RPC error. Please check your network connection.";
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = "Insufficient funds for gas fee.";
      } else if (error.message?.includes('execution reverted')) {
        errorMessage = "Transaction reverted. You may not be eligible to claim.";
      }
      
      toast({
        title: "Claim failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getExplorerUrl = (txHash: string) => {
    // Use current network's explorer if available, otherwise fallback to Citrea
    if (chainId && chainId !== CITREA_TESTNET.CHAIN_ID) {
      return `https://etherscan.io/tx/${txHash}`; // Generic fallback
    }
    return `${CITREA_TESTNET.BLOCK_EXPLORER_URLS[0]}/tx/${txHash}`;
  };

  const getCurrentNetworkName = () => {
    if (isOnCitreaNetwork()) {
      return 'Citrea Testnet';
    }
    
    // Map common chain IDs to network names
    const networkNames: { [key: string]: string } = {
      '0x1': 'Ethereum Mainnet',
      '0x3': 'Ropsten Testnet',
      '0x4': 'Rinkeby Testnet',
      '0x5': 'Goerli Testnet',
      '0x89': 'Polygon Mainnet',
      '0x13881': 'Polygon Mumbai',
      '0xa': 'Optimism',
      '0xa4b1': 'Arbitrum One',
      '0x1a16': 'Custom Network',
      '0x13fb': 'Citrea Testnet',
    };
    
    return networkNames[chainId || ''] || `Chain ${chainId}`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="text-sm text-gray-600">
          Token Claiming Portal
        </div>
      </div>         

      {/* Claim Interface */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Coins className="w-6 h-6 mr-2 text-purple-600" />
            Claim Your Tokens
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Points Summary */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Available Points</div>
              <div className="text-4xl font-bold text-purple-600 mb-2">{availablePoints}</div>
              <div className="text-sm text-gray-600">= {availablePoints} Claimable Tokens</div>
            </div>
          </div>

          {/* Contract Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="font-medium text-gray-700 mb-1">Points Contract</div>
              <div className="font-mono text-xs text-gray-600 break-all">
                {CITREA_CONTRACTS.POINTS_TRACKER}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="font-medium text-gray-700 mb-1">Token Contract</div>
              <div className="font-mono text-xs text-gray-600 break-all">
                {CITREA_CONTRACTS.TOKEN_CLAIM}
              </div>
            </div>
          </div>

          {/* Claim Status */}
          {claimStatus === 'pending' && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="py-4">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-3"></div>
                  <div>
                    <div className="font-medium text-yellow-800">Transaction Pending</div>
                    <div className="text-sm text-yellow-700">Please confirm the transaction in MetaMask...</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {claimStatus === 'success' && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="py-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-green-800 mb-1">Tokens Claimed Successfully!</div>
                    <div className="text-sm text-green-700 mb-2">
                      Your {availablePoints} tokens have been transferred to your wallet.
                    </div>
                    {txHash && (
                      <a 
                        href={getExplorerUrl(txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-green-600 hover:text-green-800"
                      >
                        View on Explorer
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {claimStatus === 'error' && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="py-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium text-red-800 mb-1">Claim Failed</div>
                    <div className="text-sm text-red-700">
                      There was an error processing your claim. Please check your wallet connection and try again.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Important Notes - Updated to reflect multi-network support */}
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="py-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                <div>
                  <div className="font-medium text-amber-800 mb-1">Important Notes</div>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Ensure you have enough native tokens for gas fees</li>
                    <li>• Tokens will be sent to your connected wallet address</li>
                    <li>• This action cannot be undone once confirmed</li>
                    <li>• Available on all supported networks</li>
                    <li>• You may only claim once per day (if applicable)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Claim Button - Removed network restriction */}
          <Button 
            onClick={handleClaimTokens}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-3"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : claimStatus === 'success' ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Tokens Claimed
              </>
            ) : availablePoints === 0 ? (
              'No Tokens to Claim'
            ) : (
              <>
                <Coins className="w-5 h-5 mr-2" />
                Claim {availablePoints} Tokens
              </>
            )}
          </Button>

          {/* Gas Estimation */}
          {availablePoints > 0 && claimStatus === 'idle' && gasEstimate && (
            <div className="text-center text-sm text-gray-600">
              Estimated gas cost: ~{gasEstimate} native tokens
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
