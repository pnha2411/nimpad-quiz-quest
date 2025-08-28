
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, User, ExternalLink, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface AIChatbotProps {
  onBack: () => void;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your Core DAO Builder Assistant. Ask me anything about Core DAO development, Bitcoin staking, Satoshi Plus consensus, or building BTCfi dApps!',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Core DAO Overview and Basics
    if (lowerMessage.includes('what') && (lowerMessage.includes('core dao') || lowerMessage.includes('coredao'))) {
      return "Core DAO is a revolutionary Bitcoin-powered, EVM-compatible Layer 1 blockchain launched on January 14, 2023. It's the first blockchain designed to be Bitcoin's complementary and hyper-scalable smart contract platform, uniquely combining Bitcoin's proven security with modern smart contract capabilities through its innovative Satoshi Plus consensus mechanism.";
    }
    
    if (lowerMessage.includes('satoshi plus') || lowerMessage.includes('consensus')) {
      return "Satoshi Plus is Core's unique consensus mechanism that integrates three components: Delegated Proof of Work (DPoW) where Bitcoin miners delegate hash power, Self-Custodial Bitcoin Staking using Bitcoin's native CLTV timelock, and Delegated Proof of Stake (DPoS) with CORE tokens. Currently ~75% of Bitcoin mining hash power contributes to Core's security.";
    }
    
    if (lowerMessage.includes('bitcoin staking') || lowerMessage.includes('stake bitcoin')) {
      return "Core enables self-custodial Bitcoin staking where you maintain complete custody of your Bitcoin while earning CORE token rewards. Use Bitcoin's native CLTV timelock functionality - your Bitcoin never leaves your wallet! Over 8,200 BTC is currently staked. Connect Bitcoin wallet (Xverse, Unisat, OKX) and Core wallet (MetaMask) to start earning daily rewards.";
    }
    
    // Development Setup and Configuration
    if (lowerMessage.includes('setup') || lowerMessage.includes('development environment')) {
      return "For Core development: Use Node.js v20.11.1+, Solidity 0.8.24+ with Shanghai EVM version. Mainnet RPC: https://rpc.coredao.org/ (Chain ID: 1116). Testnet RPC: https://rpc.test2.btcs.network (Chain ID: 1114). Configure Hardhat with Shanghai EVM and 200 optimization runs for best compatibility.";
    }
    
    if (lowerMessage.includes('hardhat') || lowerMessage.includes('configuration')) {
      return "Core Hardhat config: Set evmVersion to 'shanghai', use Solidity 0.8.24+, enable optimizer with 200 runs. Mainnet URL: https://rpc.coredao.org/ (Chain ID: 1116), Testnet: https://rpc.test2.btcs.network (Chain ID: 1114). Supports all standard tools: Remix IDE, Foundry, Ethers.js, Web3.js.";
    }
    
    if (lowerMessage.includes('solidity') || lowerMessage.includes('smart contract')) {
      return "Core uses Solidity 0.8.24+ with Shanghai EVM version. Enable optimization with 200 runs. All Ethereum smart contracts work on Core with minimal changes. Deploy to Core Testnet first, then verify contracts using Core Scan. Core supports the full Ethereum developer ecosystem including OpenZeppelin libraries.";
    }
    
    // Network Information and Tokenomics
    if (lowerMessage.includes('core token') || lowerMessage.includes('tokenomics')) {
      return "CORE token has a fixed supply of 2.1 billion tokens (like Bitcoin) with an 81-year emission schedule. Distribution: 39.995% Node Mining, 25.029% Users, 15% Contributors, 10% Reserves, 9.5% Treasury. Used for transaction fees, staking, and governance. The network achieves 3-second block times with 27 validators.";
    }
    
    if (lowerMessage.includes('validator') || lowerMessage.includes('mining')) {
      return "Core operates with top 27 validators based on hybrid scores from delegated hash power, staked Bitcoin, and staked CORE tokens. Bitcoin miners can delegate hash power to earn supplemental CORE rewards with zero additional cost. Validator elections occur every 200 blocks (~1 day).";
    }
    
    // Ecosystem and dApps
    if (lowerMessage.includes('ecosystem') || lowerMessage.includes('dapps')) {
      return "Core ecosystem has 125+ dApps with $634M+ TVL, 27M+ addresses, 308M+ transactions. Major DeFi: Colend (lending), BitFLUX (BTC liquidity), Glyph Exchange (cross-chain DEX), SushiSwap, Curve Finance. Plus gaming, NFTs, and social dApps. 180+ projects launched in 2024 alone!";
    }
    
    if (lowerMessage.includes('defi') || lowerMessage.includes('btcfi')) {
      return "BTCfi on Core includes lending (Colend), DEXs (Glyph, SushiSwap), stablecoin trading (Curve), and yield farming. Core enables Bitcoin holders to earn yield while maintaining custody. Upcoming: lstBTC for institutional liquid staking and Bitcoin-backed stablecoins as the next BTCfi frontier.";
    }
    
    // Bridge and Cross-Chain
    if (lowerMessage.includes('bridge') || lowerMessage.includes('cross-chain')) {
      return "Core Bridge (bridge.coredao.org) is powered by LayerZero, connecting Core with Ethereum, BSC, Polygon, Arbitrum, Optimism, Avalanche. Supports major tokens: USDC, USDT, WBTC, WETH. Bi-directional transfers with security audits. Essential for moving assets to Core ecosystem.";
    }
    
    // Building and Development
    if (lowerMessage.includes('build') || lowerMessage.includes('developer') || lowerMessage.includes('dapp')) {
      return "Build on Core using familiar Ethereum tools! Steps: 1) Setup Hardhat with Shanghai EVM, 2) Deploy to Core Testnet (get tCORE2 from faucet), 3) Test thoroughly, 4) Deploy to mainnet, 5) Verify contracts. Use MetaMask, Remix IDE, or Foundry. Join Core Academy for structured learning and developer courses.";
    }
    
    if (lowerMessage.includes('tutorial') || lowerMessage.includes('learn')) {
      return "Core Academy offers structured learning: blockchain fundamentals, Web3 concepts, Core-specific development. Five developer courses cover DeFi development, NFT collections, blockchain gaming, and social media dApps. Resources: docs.coredao.org, GitHub, Discord community, and Core Developer Program.";
    }
    
    // Advanced Features
    if (lowerMessage.includes('dual staking') || lowerMessage.includes('yield')) {
      return "Dual Staking lets you stake both Bitcoin and CORE simultaneously for enhanced yields. Higher CORE:BTC ratios unlock higher yield tiers. Satoshi Tier offers maximum rewards. Also available: stCORE (liquid staking for CORE) and upcoming lstBTC for institutional Bitcoin liquid staking.";
    }
    
    if (lowerMessage.includes('governance') || lowerMessage.includes('voting')) {
      return "Core uses progressive decentralization. Current: on-chain parameter adjustment, community controls 'm Parameter' and fee burn percentage. Future: full on-chain governance with CORE token voting, collateral requirements for proposals, time delays to prevent manipulation. Participate through Core Improvement Proposals (CIPs).";
    }
    
    // Getting Started
    if (lowerMessage.includes('start') || lowerMessage.includes('begin')) {
      return "Getting started: 1) Add Core network to MetaMask (Chain ID: 1116, RPC: https://rpc.coredao.org/), 2) Bridge assets using bridge.coredao.org, 3) Stake CORE or Bitcoin at stake.coredao.org, 4) Build your first dApp following tutorials, 5) Join Discord community for support!";
    }
    
    // Network Statistics and Performance
    if (lowerMessage.includes('stats') || lowerMessage.includes('performance')) {
      return "Core Network Stats: 3-second block times, $634M+ TVL, 27M+ unique addresses, 308M+ transactions, 125+ dApps, ~75% of Bitcoin hash power securing the network. Top 10 blockchain for AI dApps. Growing partnerships with BitGo, Copper, Hex Trust for institutional adoption.";
    }
    
    // Common How/Why Questions
    if (lowerMessage.includes('how') && lowerMessage.includes('work')) {
      return "Core works through Satoshi Plus consensus: Bitcoin miners delegate hash power, Bitcoin holders stake natively, CORE holders participate in DPoS. This creates a hybrid system that's secured by Bitcoin's hash power while enabling fast, cheap smart contracts with 3-second blocks and EVM compatibility.";
    }
    
    if (lowerMessage.includes('why') && (lowerMessage.includes('bitcoin') || lowerMessage.includes('core'))) {
      return "Core solves Bitcoin's idle problem - 99% of Bitcoin sits unused. Core enables Bitcoin to earn yield while maintaining self-custody, transforming it from static store of value to productive asset. Combines Bitcoin's security with Ethereum's programmability for the best of both worlds.";
    }
    
    // Default helpful response
    return "I'm here to help you build on Core DAO! Ask me about Bitcoin staking, smart contract development, the Satoshi Plus consensus, ecosystem dApps, or getting started. For detailed docs visit docs.coredao.org, join our Discord, or check out Core Academy for structured learning!";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateBotResponse(inputValue),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="text-sm text-gray-600">
          AI Assistant
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Core DAO Builder Assistant</h4>
              <p className="text-sm text-blue-700">
                Get instant answers about Core DAO, Bitcoin staking, Satoshi Plus, and BTCfi development
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a 
                href="https://docs.coredao.org/docs/intro" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Docs
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="w-6 h-6 mr-2 text-blue-600" />
            Chat with Core DAO Builder Agent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Messages */}
          <ScrollArea className="h-96 w-full pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === 'bot' && (
                        <Bot className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      )}
                      {message.type === 'user' && (
                        <User className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-blue-600" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about Core DAO, Bitcoin staking, Satoshi Plus..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Suggested Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
            {[
              "What is Core DAO?",
              "How does Satoshi Plus work?",
              "How to stake Bitcoin?",
              "How to build on Core DAO?"
            ].map((question) => (
              <Button
                key={question}
                variant="outline"
                size="sm"
                onClick={() => setInputValue(question)}
                disabled={isLoading}
                className="text-left justify-start text-xs"
              >
                {question}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
