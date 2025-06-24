
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Coins, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { toast } from '@/hooks/use-toast';
import { ethers } from 'ethers';

interface TokenClaimingProps {
  availablePoints: number;
  onBack: () => void;
}

// Citrea contract addresses - replace with actual deployed contracts
const CITREA_CONTRACTS = {
  POINTS_TRACKER: "0x1234567890123456789012345678901234567890", // Replace with actual points contract
  TOKEN_CLAIM: "0x0987654321098765432109876543210987654321",    // Replace with actual Citrea token contract
  NETWORK_ID: "0x5ffd", // Citrea testnet chain ID - update as needed
  CITREA_RPC: "https://rpc.devnet.citrea.xyz", // Citrea RPC endpoint
};

// Example ABI for token claiming - replace with actual contract ABI
const TOKEN_CLAIM_ABI = [
  "function claimTokens(uint256 points) external",
  "function getClaimableAmount(address user) external view returns (uint256)",
  "function hasClaimedToday(address user) external view returns (bool)",
  "event TokensClaimed(address indexed user, uint256 amount)"
];

export const TokenClaiming: React.FC<TokenClaimingProps> = ({
  availablePoints,
  onBack,
}) => {
  const { isConnected, account, signer, chainId } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [claimStatus, setClaimStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string>('');
  const [gasEstimate, setGasEstimate] = useState<string>('');

  const checkNetwork = async () => {
    if (chainId !== CITREA_CONTRACTS.NETWORK_ID) {
      toast({
        title: "Wrong network",
        description: "Please switch to Citrea network to claim tokens.",
        variant: "destructive",
      });
      
      try {
        // Try to switch to Citrea network
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: CITREA_CONTRACTS.NETWORK_ID }],
        });
      } catch (switchError: any) {
        // If network is not added, try to add it
        if (switchError.code === 4902) {
          try {
            await (window as any).ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: CITREA_CONTRACTS.NETWORK_ID,
                chainName: 'Citrea Devnet',
                nativeCurrency: {
                  name: 'Citrea Bitcoin',
                  symbol: 'cBTC',
                  decimals: 18
                },
                rpcUrls: [CITREA_CONTRACTS.CITREA_RPC],
                blockExplorerUrls: ['https://explorer.devnet.citrea.xyz/']
              }]
            });
          } catch (addError) {
            console.error('Failed to add Citrea network:', addError);
          }
        }
      }
      return false;
    }
    return true;
  };

  const estimateGas = async () => {
    if (!signer || !isConnected) return;

    try {
      const contract = new ethers.Contract(
        CITREA_CONTRACTS.TOKEN_CLAIM,
        TOKEN_CLAIM_ABI,
        signer
      );

      // Estimate gas for the claim transaction
      const gasLimit = await contract.claimTokens.estimateGas(availablePoints);
      const gasPrice = await signer.provider?.getFeeData();
      
      if (gasPrice?.gasPrice) {
        const totalGas = gasLimit * gasPrice.gasPrice;
        const gasInEth = ethers.formatEther(totalGas);
        setGasEstimate(parseFloat(gasInEth).toFixed(6));
      }
    } catch (error) {
      console.error('Gas estimation failed:', error);
      setGasEstimate('~0.001'); // Fallback estimate
    }
  };

  const handleClaimTokens = async () => {
    if (!isConnected || !signer || availablePoints === 0) {
      toast({
        title: "Cannot claim tokens",
        description: "Please ensure your wallet is connected and you have points to claim.",
        variant: "destructive",
      });
      return;
    }

    // Check if we're on the correct network
    const isCorrectNetwork = await checkNetwork();
    if (!isCorrectNetwork) {
      return;
    }

    setIsLoading(true);
    setClaimStatus('pending');

    try {
      console.log('Initiating token claim...');
      console.log('Available points:', availablePoints);
      console.log('User account:', account);
      console.log('Chain ID:', chainId);

      // Create contract instance with actual ABI and address
      const contract = new ethers.Contract(
        CITREA_CONTRACTS.TOKEN_CLAIM,
        TOKEN_CLAIM_ABI,
        signer
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
      const tx = await contract.claimTokens(availablePoints, {
        gasLimit: 300000, // Set appropriate gas limit
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

        // You might want to update the user's points here
        // or trigger a refresh of the dashboard
        
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

  // Estimate gas on component mount
  React.useEffect(() => {
    if (isConnected && signer && availablePoints > 0) {
      estimateGas();
    }
  }, [isConnected, signer, availablePoints]);

  const getExplorerUrl = (txHash: string) => {
    return `https://explorer.devnet.citrea.xyz/tx/${txHash}`;
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

      {/* Network Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Citrea Network</h4>
              <p className="text-sm text-blue-700">
                Ensure you're connected to Citrea Devnet
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-600">Chain ID</div>
              <div className="font-mono text-sm">{chainId || 'Not connected'}</div>
              {chainId !== CITREA_CONTRACTS.NETWORK_ID && chainId && (
                <div className="text-xs text-red-600 mt-1">Wrong network!</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

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

          {/* Important Notes */}
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="py-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                <div>
                  <div className="font-medium text-amber-800 mb-1">Important Notes</div>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Ensure you have enough cBTC for gas fees</li>
                    <li>• Tokens will be sent to your connected wallet address</li>
                    <li>• This action cannot be undone once confirmed</li>
                    <li>• Contract is deployed on Citrea Devnet</li>
                    <li>• You may only claim once per day (if applicable)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Claim Button */}
          <Button 
            onClick={handleClaimTokens}
            disabled={availablePoints === 0 || isLoading || !isConnected || claimStatus === 'success' || chainId !== CITREA_CONTRACTS.NETWORK_ID}
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
            ) : chainId !== CITREA_CONTRACTS.NETWORK_ID ? (
              'Switch to Citrea Network'
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
              Estimated gas cost: ~{gasEstimate} cBTC
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
