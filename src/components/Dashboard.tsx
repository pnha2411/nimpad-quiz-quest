import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Target,
  Star,
  BookOpen,
  ExternalLink,
  Clock,
  PartyPopper,
  CheckCircle2,
} from 'lucide-react';
import nimpadLogo from '/nimpad_logo.jpg';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'; // Make sure you have a Dialog component

interface DashboardProps {
  points: number;
  completedQuizzes: number;
  totalQuizzes: number;
  onStartQuiz: () => void;
  onClaimTokens: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  points,
  completedQuizzes,
  totalQuizzes,
  onStartQuiz,
  onClaimTokens,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [dailyHabits, setDailyHabits] = useState([
    { id: 1, title: "Morning Market Analysis", completed: false, streak: 3 },
    { id: 2, title: "Protocol Research", completed: true, streak: 7 },
    { id: 3, title: "Portfolio Review", completed: false, streak: 2 },
    { id: 4, title: "Risk Assessment", completed: true, streak: 5 }
  ]);
  const [showCongrats, setShowCongrats] = useState(false);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedSteps = localStorage.getItem('nimpad_completed_steps');
    if (savedSteps) {
      try {
        setCompletedSteps(JSON.parse(savedSteps));
      } catch {}
    }
    const savedHabits = localStorage.getItem('nimpad_daily_habits');
    if (savedHabits) {
      try {
        setDailyHabits(JSON.parse(savedHabits));
      } catch {}
    }
  }, []);

  // Save completed steps to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('nimpad_completed_steps', JSON.stringify(completedSteps));
    // Show congratulation popup if all steps are completed and not shown before
    if (completedSteps.length === 4 && !localStorage.getItem('nimpad_congrats_shown')) {
      setShowCongrats(true);
      localStorage.setItem('nimpad_congrats_shown', 'true');
    }
  }, [completedSteps]);

  // Save daily habits to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('nimpad_daily_habits', JSON.stringify(dailyHabits));
  }, [dailyHabits]);

  const completeStep = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const toggleHabit = (habitId: number) => {
    setDailyHabits(prev =>
      prev.map(habit =>
        habit.id === habitId
          ? { ...habit, completed: !habit.completed }
          : habit
      )
    );
  };

  const investmentSteps = [
    {
      id: 1,
      title: "🔍 Market Analysis",
      subtitle: "Fundamental, Technical & On-Chain Analysis",
      description: "Master the art of reading the BTCfi market like a skilled strategist",
      emoji: "🎯",
      color: "from-pink-400 to-purple-500",
      resources: [
        { title: "DeFiLlama Yield Analytics", url: "https://defillama.com/yields", type: "Analytics" },
        { title: "CoinGecko BTCfi Sector", url: "https://www.coingecko.com/en/categories/bitcoin-layer-2", type: "Data" },
        { title: "Dune Analytics BTCfi Dashboard", url: "https://dune.com/browse/dashboards", type: "On-Chain" },
        { title: "BitcoinLayers.org", url: "https://bitcoinlayers.org/", type: "Infrastructure" }
      ],
      tasks: [
        "Check total TVL across all BTCfi protocols",
        "Analyze Bitcoin price correlation with BTCfi tokens",
        "Review on-chain metrics: active addresses, transaction volume",
        "Study institutional Bitcoin adoption trends"
      ]
    },
    {
      id: 2,
      title: "⚡ Protocol Deep Dive",
      subtitle: "Yield Analysis & Chain Performance",
      description: "Discover the most promising protocols across different chains",
      emoji: "🚀",
      color: "from-blue-400 to-cyan-500",
      resources: [
        { title: "Core Chain Explorer", url: "https://scan.coredao.org/", type: "Explorer" },
        { title: "Rootstock (RSK) DeFi", url: "https://rootstock.io/", type: "Platform" },
        { title: "BOB Network", url: "https://gobob.xyz/", type: "L2" },
        { title: "Babylon Protocol", url: "https://babylonchain.io/", type: "Staking" },
        { title: "Stacks Ecosystem", url: "https://www.stacks.co/", type: "Smart Contracts" }
      ],
      tasks: [
        "Compare APY rates across major BTCfi protocols",
        "Analyze liquidity depth and trading volume",
        "Check protocol security audits and track record",
        "Review governance token tokenomics"
      ]
    },
    {
      id: 3,
      title: "💰 Asset Acquisition",
      subtitle: "Step-by-Step Investment Process",
      description: "Your complete guide to acquiring BTCfi assets safely",
      emoji: "⭐",
      color: "from-green-400 to-emerald-500",
      resources: [
        { title: "Binance BTCfi Trading", url: "https://www.binance.com/", type: "CEX" },
        { title: "Uniswap V3", url: "https://app.uniswap.org/", type: "DEX" },
        { title: "1inch Aggregator", url: "https://1inch.io/", type: "DEX Aggregator" },
        { title: "MetaMask Wallet", url: "https://metamask.io/", type: "Wallet" },
        { title: "Rabby Wallet", url: "https://rabby.io/", type: "Multi-Chain Wallet" }
      ],
      tasks: [
        "Set up secure wallet (MetaMask/Rabby)",
        "Add BTCfi network configurations",
        "Acquire base assets (BTC, ETH, USDT)",
        "Bridge assets to chosen BTCfi chains",
        "Start with small test transactions"
      ]
    },
    {
      id: 4,
      title: "📊 Portfolio Monitoring",
      subtitle: "Track & Optimize Your Positions",
      description: "Keep your investments performing at their best",
      emoji: "🎭",
      color: "from-orange-400 to-red-500",
      resources: [
        { title: "DeBank Portfolio Tracker", url: "https://debank.com/", type: "Portfolio" },
        { title: "Zapper.fi", url: "https://zapper.fi/", type: "DeFi Portfolio" },
        { title: "Apeboard", url: "https://apeboard.finance/", type: "Multi-Chain" },
        { title: "CoinTracker", url: "https://www.cointracker.io/", type: "Tax Tracking" }
      ],
      tasks: [
        "Set up portfolio tracking dashboard",
        "Monitor yield farming rewards daily",
        "Track impermanent loss on LP positions",
        "Review and rebalance monthly",
        "Set up price alerts for major moves"
      ]
    }
  ];

  const topProtocols = [
    { name: "Babylon", apy: 12.4, risk: "Medium", chain: "Bitcoin", tvl: "$1.2B" },
    { name: "Core Chain", apy: 8.7, risk: "Low", chain: "Core", tvl: "$431M" },
    { name: "BOB Network", apy: 15.2, risk: "High", chain: "BOB", tvl: "$245M" },
    { name: "Stacks DeFi", apy: 9.8, risk: "Medium", chain: "Stacks", tvl: "$185M" }
  ];

  return (
    <div className="container mx-auto px-4 pb-8 space-y-6 bg-gradient-to-br from-[#f7f6fa] via-[#e9e6f3] to-[#e3eafc] min-h-screen">
      {/* Congratulation Popup */}
      <Dialog open={showCongrats} onOpenChange={setShowCongrats}>
        <DialogContent className="max-w-md mx-auto text-center">
          <DialogHeader>
            <DialogTitle>
              <div className="flex flex-col items-center space-y-2">
                <PartyPopper className="w-12 h-12 text-yellow-400 animate-bounce" />
                <span className="text-2xl font-bold text-green-700">Congratulations!</span>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="my-4">
            <p className="text-lg text-gray-700 mb-2">You've completed all BTCfi Investment Journey steps!</p>
            <p className="text-md text-gray-600">You're now a BTCfi Master. Keep learning and exploring new protocols!</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowCongrats(false)} className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Awesome!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Daily Habits Tracker */}
      <Card className="bg-gradient-to-r from-[#e3eafc] to-[#f7f6fa] border-[#b6b6e3] shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-[#2e2e5e]">
            <img src={nimpadLogo} alt="Nimpad Logo" className="w-8 h-8 rounded mr-2 border-2 border-white shadow" />
            Daily BTCfi Habits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dailyHabits.map((habit) => (
              <div key={habit.id} className="bg-white rounded-lg p-4 border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-purple-800">{habit.title}</h4>
                  {habit.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="text-sm text-purple-600">
                  🔥 {habit.streak} day streak
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Investment Steps */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-[#2e2e5e] to-[#2e7cf6] bg-clip-text text-transparent">
          🎌 Your BTCfi Investment Journey 🎌
        </h2>
        
        {investmentSteps.map((step, index) => (
          <Card key={step.id} className={`bg-gradient-to-r ${step.color} text-white overflow-hidden`}>
            <CardHeader className="relative">
              <div className="absolute top-0 right-0 text-6xl opacity-20">
                {step.emoji}
              </div>
              <CardTitle className="flex items-center text-white">
                <span className="bg-white text-purple-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold">
                  {step.id}
                </span>
                {step.title}
              </CardTitle>
              <p className="text-white/90 font-medium">{step.subtitle}</p>
              <p className="text-white/80">{step.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tasks */}
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Daily Tasks
                </h4>
                <ul className="space-y-2">
                  {step.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-green-300" />
                      <span className="text-sm">{task}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-semibold mb-3 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Essential Resources
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {step.resources.map((resource, resourceIndex) => (
                    <div key={resourceIndex} className="bg-white/20 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-sm">{resource.title}</h5>
                        <span className="text-xs text-white/70">{resource.type}</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        onClick={() => window.open(resource.url, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Button 
                onClick={() => completeStep(step.id)}
                className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
                disabled={completedSteps.includes(step.id)}
              >
                {completedSteps.includes(step.id) ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Step Completed! ✨
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4 mr-2" />
                    Start This Step
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Protocol Showcase */}
      <Card className="bg-gradient-to-br from-[#e3eafc] to-[#f7f6fa] border-[#b6b6e3] shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-[#2e7cf6]">
            <img src={nimpadLogo} alt="Nimpad Logo" className="w-6 h-6 rounded mr-2 border-2 border-white shadow" />
            🌟 Trending BTCfi Protocols 🌟
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topProtocols.map((protocol, index) => (
              <div key={protocol.name} className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-blue-800">{protocol.name}</h4>
                  <span className="text-2xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '⭐'}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>APY:</span>
                    <span className="font-bold text-green-600">{protocol.apy}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Chain:</span>
                    <span className="font-medium">{protocol.chain}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>TVL:</span>
                    <span className="font-medium">{protocol.tvl}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Risk:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      protocol.risk === 'Low' ? 'bg-green-100 text-green-700' :
                      protocol.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {protocol.risk}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Summary */}
      <Card className="bg-gradient-to-r from-[#e3eafc] to-[#f7f6fa] border-[#b6b6e3] shadow-md">
        <CardContent className="py-8 text-center">
          <h3 className="text-2xl font-bold mb-4 text-green-800">
            🎯 Your BTCfi Mastery Progress 🎯
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="text-3xl font-bold text-green-600">
                {completedSteps.length}/4
              </div>
              <div className="text-sm text-green-700">Steps Completed</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="text-3xl font-bold text-blue-600">
                {dailyHabits.filter(h => h.completed).length}/4
              </div>
              <div className="text-sm text-blue-700">Daily Habits</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="text-3xl font-bold text-purple-600">
                {Math.round((completedSteps.length / 4) * 100)}%
              </div>
              <div className="text-sm text-purple-700">Journey Complete</div>
            </div>
          </div>
          <div className="mt-6">
            <Progress value={(completedSteps.length / 4) * 100} className="h-3" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};