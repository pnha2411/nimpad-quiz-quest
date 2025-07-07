
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
      content: 'Hello! I\'m your Nim AI assistant. Ask me anything about CoreDao, DeFi, BtcFi, or Bitcoin Layer 2 technology!',
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
    
    // Knowledge base for Citrea-related questions
    if (lowerMessage.includes('citrea') && lowerMessage.includes('what')) {
      return "Citrea is Bitcoin's first ZK rollup that brings scalability and programmability to Bitcoin. It uses zero-knowledge proofs to enable faster, cheaper transactions while maintaining Bitcoin's security guarantees. Citrea is EVM-compatible, meaning developers can build full-featured DApps using familiar Ethereum tools.";
    }
    
    if (lowerMessage.includes('zk') || lowerMessage.includes('zero-knowledge')) {
      return "Zero-knowledge proofs allow Citrea to process transactions off-chain and then submit cryptographic proofs to Bitcoin that verify the validity of all transactions without revealing their details. This enables scalability while maintaining Bitcoin's security and decentralization.";
    }
    
    if (lowerMessage.includes('btcfi') || lowerMessage.includes('bitcoin defi')) {
      return "BtcFi (Bitcoin DeFi) refers to decentralized financial applications built on Bitcoin or Bitcoin-compatible networks like Citrea. This includes lending protocols, DEXs, yield farming, and other DeFi primitives that were previously only available on other blockchains. Citrea enables BtcFi by providing smart contract functionality to Bitcoin.";
    }
    
    if (lowerMessage.includes('defi')) {
      return "DeFi (Decentralized Finance) on Citrea includes protocols for trading, lending, borrowing, yield farming, and more. Since Citrea is EVM-compatible, many Ethereum DeFi protocols can be deployed with minimal changes. This brings the entire DeFi ecosystem to Bitcoin users.";
    }
    
    if (lowerMessage.includes('evm') || lowerMessage.includes('ethereum')) {
      return "Citrea uses the Ethereum Virtual Machine (EVM), making it compatible with Ethereum smart contracts, tools, and infrastructure. Developers can use Solidity, MetaMask, Remix, and other familiar tools to build on Citrea. This compatibility enables easy porting of existing Ethereum DApps to Bitcoin.";
    }
    
    if (lowerMessage.includes('token') || lowerMessage.includes('cBTC')) {
      return "Citrea uses cBTC as its native token, which represents Bitcoin locked in the system. Users can bridge Bitcoin to Citrea to get cBTC, which can then be used in DeFi applications, smart contracts, and other on-chain activities. The bridging process is secured by Bitcoin's consensus.";
    }
    
    if (lowerMessage.includes('bridge') || lowerMessage.includes('deposit')) {
      return "To use Citrea, you need to bridge Bitcoin from the main Bitcoin network to Citrea. This involves locking your Bitcoin in a bridge contract and receiving cBTC on Citrea. The bridge is secured by Bitcoin's consensus mechanism and zero-knowledge proofs.";
    }
    
    if (lowerMessage.includes('gas') || lowerMessage.includes('fee')) {
      return "Gas fees on Citrea are paid in cBTC and are significantly lower than Bitcoin main chain fees. Since transactions are processed off-chain and batched into proofs, users enjoy faster confirmation times and lower costs while maintaining Bitcoin-level security.";
    }
    
    if (lowerMessage.includes('security') || lowerMessage.includes('safe')) {
      return "Citrea inherits Bitcoin's security through its ZK rollup design. All transactions are verified by zero-knowledge proofs that are posted to Bitcoin. This means Citrea is as secure as Bitcoin itself, while providing additional functionality through smart contracts.";
    }
    
    if (lowerMessage.includes('developer') || lowerMessage.includes('build')) {
      return "Developers can build on CoreDao using familiar Ethereum tools like Solidity, Hardhat, and Remix. The development experience is nearly identical to Ethereum, but with the added benefit of Bitcoin's security. You can deploy DeFi protocols, NFT marketplaces, games, and any other smart contract application.";
    }
    
    // Default responses for common question patterns
    if (lowerMessage.includes('how') && lowerMessage.includes('work')) {
      return "Citrea works by processing transactions off-chain in a ZK rollup, then posting cryptographic proofs to Bitcoin. This allows for fast, cheap transactions while maintaining Bitcoin's security. Smart contracts run on the EVM, enabling complex DeFi applications.";
    }
    
    if (lowerMessage.includes('why') && lowerMessage.includes('bitcoin')) {
      return "Bitcoin is the most secure and decentralized blockchain, but it lacks programmability. Citrea solves this by adding smart contract functionality while preserving Bitcoin's security guarantees. This unlocks DeFi, NFTs, and other applications for Bitcoin users.";
    }
    
    // General helpful response
    return "That's a great question! For detailed technical information, I recommend checking the official Citrea documentation at https://docs.citrea.xyz/. You can also ask me more specific questions about Citrea's ZK rollup technology, DeFi applications, or how to get started building on the platform.";
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
              <h4 className="font-medium text-blue-900 mb-1">Citrea AI Assistant</h4>
              <p className="text-sm text-blue-700">
                Get instant answers about CoreDao, DeFi, BtcFi, and Bitcoin Layer 2
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
            Chat with Nim Agent
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
              placeholder="Ask me about CoreDao, DeFi, BtcFi..."
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
              "What is Citrea?",
              "How does ZK rollup work?",
              "What is BtcFi?",
              "How to build on CoreDao?"
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
