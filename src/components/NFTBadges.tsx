
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Award, CheckCircle, ExternalLink, Coins } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { toast } from '@/hooks/use-toast';
import { ethers } from 'ethers';

interface NFTBadge {
  id: number;
  name: string;
  description: string;
  requirement: string;
  pointsCost: number;
  image: string;
  unlocked: boolean;
  owned: boolean;
}

interface NFTBadgesProps {
  availablePoints: number;
  completedQuizzes: number;
  onBack: () => void;
}

// Mock NFT contract address - replace with actual Citrea NFT contract
const NFT_CONTRACT_ADDRESS = "0x9876543210987654321098765432109876543210";

const BADGE_TEMPLATES: NFTBadge[] = [
  {
    id: 1,
    name: "Citrea Learner",
    description: "Complete your first quiz about Citrea",
    requirement: "Complete 1 quiz",
    pointsCost: 50,
    image: "🎓",
    unlocked: false,
    owned: false,
  },
  {
    id: 2,
    name: "ZK Explorer",
    description: "Master the basics of zero-knowledge technology",
    requirement: "Complete 3 quizzes",
    pointsCost: 100,
    image: "🔍",
    unlocked: false,
    owned: false,
  },
  {
    id: 3,
    name: "BtcFi Pioneer",
    description: "Understand Bitcoin DeFi concepts",
    requirement: "Complete 5 quizzes",
    pointsCost: 200,
    image: "🚀",
    unlocked: false,
    owned: false,
  },
  {
    id: 4,
    name: "Citrea Expert",
    description: "Complete all available quizzes",
    requirement: "Complete all quizzes",
    pointsCost: 500,
    image: "👑",
    unlocked: false,
    owned: false,
  },
];

export const NFTBadges: React.FC<NFTBadgesProps> = ({
  availablePoints,
  completedQuizzes,
  onBack,
}) => {
  const { isConnected, account, signer, chainId } = useWallet();
  const [badges, setBadges] = useState<NFTBadge[]>(BADGE_TEMPLATES);
  const [mintingBadge, setMintingBadge] = useState<number | null>(null);
  const [ownedBadges, setOwnedBadges] = useState<number[]>([]);

  useEffect(() => {
    // Update badge unlock status based on completed quizzes
    setBadges(prev => prev.map(badge => {
      let unlocked = false;
      switch (badge.id) {
        case 1:
          unlocked = completedQuizzes >= 1;
          break;
        case 2:
          unlocked = completedQuizzes >= 3;
          break;
        case 3:
          unlocked = completedQuizzes >= 5;
          break;
        case 4:
          unlocked = completedQuizzes >= 5; // Assuming 5 is all quizzes
          break;
      }
      return { ...badge, unlocked, owned: ownedBadges.includes(badge.id) };
    }));
  }, [completedQuizzes, ownedBadges]);

  useEffect(() => {
    // Load owned badges from localStorage
    const savedBadges = localStorage.getItem('nimpad_owned_badges');
    if (savedBadges) {
      try {
        setOwnedBadges(JSON.parse(savedBadges));
      } catch (error) {
        console.error('Error loading owned badges:', error);
      }
    }
  }, []);

  const handleMintBadge = async (badge: NFTBadge) => {
    if (!isConnected || !signer || !badge.unlocked || badge.owned) {
      toast({
        title: "Cannot mint badge",
        description: "Please ensure your wallet is connected and badge requirements are met.",
        variant: "destructive",
      });
      return;
    }

    if (availablePoints < badge.pointsCost) {
      toast({
        title: "Insufficient points",
        description: `You need ${badge.pointsCost} points to mint this badge.`,
        variant: "destructive",
      });
      return;
    }

    setMintingBadge(badge.id);

    try {
      console.log('Initiating NFT badge mint...');
      console.log('Badge:', badge.name);
      console.log('User account:', account);
      console.log('Chain ID:', chainId);
      console.log('Points cost:', badge.pointsCost);

      // In a real implementation, you would:
      // 1. Create NFT contract instance
      // 2. Call the mint function
      // 3. Handle the transaction response
      
      /*
      const nftContract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        nftContractABI,
        signer
      );
      
      const tx = await nftContract.mintBadge(badge.id, {
        value: ethers.parseEther("0.001") // Example minting fee
      });
      
      await tx.wait();
      */

      // Simulate contract interaction delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock success response
      const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
      
      // Update owned badges
      const newOwnedBadges = [...ownedBadges, badge.id];
      setOwnedBadges(newOwnedBadges);
      localStorage.setItem('nimpad_owned_badges', JSON.stringify(newOwnedBadges));

      toast({
        title: "Badge minted successfully!",
        description: `You have successfully minted the "${badge.name}" badge NFT.`,
      });

      console.log('NFT badge mint successful:', mockTxHash);

    } catch (error) {
      console.error('NFT badge mint failed:', error);
      
      toast({
        title: "Mint failed",
        description: "There was an error minting your badge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setMintingBadge(null);
    }
  };

  const getExplorerUrl = (txHash: string) => {
    return `https://explorer.citrea.xyz/tx/${txHash}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="text-sm text-gray-600">
          NFT Badge Collection
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="py-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{ownedBadges.length}</div>
              <div className="text-sm text-gray-600">Badges Owned</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{availablePoints}</div>
              <div className="text-sm text-gray-600">Available Points</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedQuizzes}</div>
              <div className="text-sm text-gray-600">Quizzes Completed</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contract Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900 mb-1">NFT Badge Contract</h4>
              <p className="text-sm text-blue-700 font-mono">{NFT_CONTRACT_ADDRESS}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-600">Chain ID</div>
              <div className="font-mono text-sm">{chainId || 'Not connected'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {badges.map((badge) => (
          <Card key={badge.id} className={`relative ${
            badge.owned ? 'ring-2 ring-green-500 bg-green-50' : 
            badge.unlocked ? 'border-blue-300' : 'opacity-60'
          }`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <span className="text-3xl mr-3">{badge.image}</span>
                  {badge.name}
                </CardTitle>
                {badge.owned && (
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Owned
                  </Badge>
                )}
                {badge.unlocked && !badge.owned && (
                  <Badge variant="outline" className="border-blue-500 text-blue-600">
                    Available
                  </Badge>
                )}
                {!badge.unlocked && (
                  <Badge variant="outline" className="border-gray-300 text-gray-500">
                    Locked
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-gray-700 mb-2">{badge.description}</p>
                <p className="text-sm text-gray-500">{badge.requirement}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-purple-600">
                  <Coins className="w-4 h-4 mr-1" />
                  {badge.pointsCost} points
                </div>
              </div>

              <Button
                onClick={() => handleMintBadge(badge)}
                disabled={
                  !badge.unlocked || 
                  badge.owned || 
                  availablePoints < badge.pointsCost || 
                  mintingBadge === badge.id || 
                  !isConnected
                }
                className={`w-full ${
                  badge.owned 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                }`}
              >
                {mintingBadge === badge.id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Minting...
                  </>
                ) : badge.owned ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Owned
                  </>
                ) : !badge.unlocked ? (
                  'Requirements not met'
                ) : availablePoints < badge.pointsCost ? (
                  'Insufficient points'
                ) : (
                  <>
                    <Award className="w-4 h-4 mr-2" />
                    Mint Badge NFT
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* How it works */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="py-4">
          <h4 className="font-medium text-amber-800 mb-2">How NFT Badges Work</h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Complete quizzes to unlock badge requirements</li>
            <li>• Spend points to mint badges as NFTs on Citrea</li>
            <li>• Each badge is a unique, tradeable NFT stored on-chain</li>
            <li>• Badges serve as proof of your Citrea knowledge and achievements</li>
            <li>• Gas fees are paid in ETH for the minting transaction</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
