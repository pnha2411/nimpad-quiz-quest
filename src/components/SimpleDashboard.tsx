import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, ArrowRight, ChevronDown, ChevronUp, ExternalLink, Target, BookOpen } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';

interface SimpleDashboardProps {
  points: number;
  completedQuizzes: number;
  totalQuizzes: number;
  onStartQuiz: () => void;
  onClaimTokens: () => void;
}

export const SimpleDashboard: React.FC<SimpleDashboardProps> = ({
  onStartQuiz,
}) => {
  // PRESERVE ALL DAILY HABITS FUNCTIONALITY WITH DETAILED STEPS
  const [dailyHabits, setDailyHabits] = useState([
    { 
      id: 1, 
      title: "🔍 Market Analysis", 
      subtitle: "Fundamental, Technical & On-Chain Analysis",
      completed: false, 
      streak: 3,
      description: "Master the art of reading the BTCfi market like a skilled strategist",
      tasks: [
        "Check total TVL across all BTCfi protocols",
        "Analyze Bitcoin price correlation with BTCfi tokens",
        "Review on-chain metrics: active addresses, transaction volume",
        "Study institutional Bitcoin adoption trends"
      ],
      resources: [
        { title: "DeFiLlama Yield Analytics", url: "https://defillama.com/yields", type: "Analytics" },
        { title: "CoinGecko BTCfi Sector", url: "https://www.coingecko.com/en/categories/bitcoin-layer-2", type: "Data" },
        { title: "Dune Analytics BTCfi Dashboard", url: "https://dune.com/browse/dashboards", type: "On-Chain" },
        { title: "BitcoinLayers.org", url: "https://bitcoinlayers.org/", type: "Infrastructure" }
      ]
    },
    { 
      id: 2, 
      title: "⚡ Protocol Deep Dive", 
      subtitle: "Yield Analysis & Chain Performance",
      completed: true, 
      streak: 7,
      description: "Discover the most promising protocols across different chains",
      tasks: [
        "Compare APY rates across major BTCfi protocols",
        "Analyze liquidity depth and trading volume",
        "Check protocol security audits and track record",
        "Review governance token tokenomics"
      ],
      resources: [
        { title: "Core Chain Explorer", url: "https://scan.coredao.org/", type: "Explorer" },
        { title: "Rootstock (RSK) DeFi", url: "https://rootstock.io/", type: "Platform" },
        { title: "BOB Network", url: "https://gobob.xyz/", type: "L2" },
        { title: "Babylon Protocol", url: "https://babylonchain.io/", type: "Staking" },
        { title: "Stacks Ecosystem", url: "https://www.stacks.co/", type: "Smart Contracts" }
      ]
    },
    { 
      id: 3, 
      title: "💰 Asset Acquisition", 
      subtitle: "Step-by-Step Investment Process",
      completed: false, 
      streak: 2,
      description: "Your complete guide to acquiring BTCfi assets safely",
      tasks: [
        "Set up secure wallet (MetaMask/Rabby)",
        "Add BTCfi network configurations",
        "Acquire base assets (BTC, ETH, USDT)",
        "Bridge assets to chosen BTCfi chains",
        "Start with small test transactions"
      ],
      resources: [
        { title: "Binance BTCfi Trading", url: "https://www.binance.com/", type: "CEX" },
        { title: "Uniswap V3", url: "https://app.uniswap.org/", type: "DEX" },
        { title: "1inch Aggregator", url: "https://1inch.io/", type: "DEX Aggregator" },
        { title: "MetaMask Wallet", url: "https://metamask.io/", type: "Wallet" },
        { title: "Rabby Wallet", url: "https://rabby.io/", type: "Multi-Chain Wallet" }
      ]
    },
    { 
      id: 4, 
      title: "📊 Portfolio Monitoring", 
      subtitle: "Track & Optimize Your Positions",
      completed: true, 
      streak: 5,
      description: "Keep your investments performing at their best",
      tasks: [
        "Set up portfolio tracking dashboard",
        "Monitor yield farming rewards daily",
        "Track impermanent loss on LP positions",
        "Review and rebalance monthly",
        "Set up price alerts for major moves"
      ],
      resources: [
        { title: "DeBank Portfolio Tracker", url: "https://debank.com/", type: "Portfolio" },
        { title: "Zapper.fi", url: "https://zapper.fi/", type: "DeFi Portfolio" },
        { title: "Apeboard", url: "https://apeboard.finance/", type: "Multi-Chain" },
        { title: "CoinTracker", url: "https://www.cointracker.io/", type: "Tax Tracking" }
      ]
    }
  ]);

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [expandedHabits, setExpandedHabits] = useState<Record<number, boolean>>({});

  // Load progress from localStorage on mount - PRESERVE FUNCTIONALITY
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

  // Save to localStorage when habits change - PRESERVE FUNCTIONALITY
  useEffect(() => {
    localStorage.setItem('nimpad_daily_habits', JSON.stringify(dailyHabits));
  }, [dailyHabits]);

  useEffect(() => {
    localStorage.setItem('nimpad_completed_steps', JSON.stringify(completedSteps));
  }, [completedSteps]);

  // PRESERVE HABIT TOGGLE FUNCTIONALITY
  const toggleHabit = (habitId: number) => {
    setDailyHabits(prev =>
      prev.map(habit =>
        habit.id === habitId
          ? { ...habit, completed: !habit.completed }
          : habit
      )
    );
  };

  const toggleExpanded = (habitId: number) => {
    setExpandedHabits(prev => ({
      ...prev,
      [habitId]: !prev[habitId]
    }));
  };

  const completedHabitsCount = dailyHabits.filter(h => h.completed).length;
  const totalProgress = (completedSteps.length + completedHabitsCount) / 8 * 100;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center py-6">
        <h1 className="text-2xl font-bold mb-2">Welcome to your BTCfi Journey</h1>
        <p className="text-muted-foreground">Track habits, build portfolio, get AI insights</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-primary">{completedSteps.length}/4</div>
            <div className="text-sm text-muted-foreground">Steps Done</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600">{completedHabitsCount}/4</div>
            <div className="text-sm text-muted-foreground">Daily Habits</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{Math.round(totalProgress)}%</div>
            <div className="text-sm text-muted-foreground">Progress</div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Habits - PRESERVED ORIGINAL FUNCTIONALITY WITH DETAILED CONTENT */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            🎌 Your BTCfi Investment Journey 🎌
            <span className="text-sm font-normal text-muted-foreground">{completedHabitsCount}/4 completed</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dailyHabits.map((habit) => (
              <div key={habit.id} className="border rounded-lg">
                {/* Habit Header - Always Visible */}
                <div className="flex items-center justify-between p-4">
                  <div 
                    className="flex items-center gap-3 flex-1 cursor-pointer hover:opacity-80"
                    onClick={() => toggleHabit(habit.id)}
                  >
                    {habit.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-muted-foreground" />
                    )}
                    <div>
                      <div className="font-medium">{habit.title}</div>
                      <div className="text-sm text-muted-foreground">{habit.subtitle}</div>
                      <div className="text-xs text-muted-foreground">🔥 {habit.streak} day streak</div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleExpanded(habit.id)}
                    className="ml-2"
                  >
                    {expandedHabits[habit.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </div>
                
                {/* Expanded Content - Only show when expanded */}
                {expandedHabits[habit.id] && (
                  <div className="px-4 pb-4 space-y-4 border-t bg-muted/20">
                    <p className="text-sm text-muted-foreground pt-4">{habit.description}</p>
                    
                    {/* Daily Tasks Section */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center text-sm">
                        <Target className="w-4 h-4 mr-2 text-primary" />
                        Daily Tasks
                      </h4>
                      <div className="space-y-2">
                        {habit.tasks.map((task, taskIndex) => (
                          <div key={taskIndex} className="flex items-start text-sm p-2 bg-background rounded border">
                            <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                            <span>{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Essential Resources Section */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center text-sm">
                        <BookOpen className="w-4 h-4 mr-2 text-primary" />
                        Essential Resources
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {habit.resources.map((resource, resourceIndex) => (
                          <div key={resourceIndex} className="flex items-center justify-between p-3 bg-background rounded border hover:bg-muted/50 transition-colors">
                            <div className="flex-1">
                              <div className="text-sm font-medium">{resource.title}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {resource.type}
                                </Badge>
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="ml-2"
                              onClick={() => window.open(resource.url, '_blank', 'noopener,noreferrer')}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Build Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Create your personalized BTCfi investment strategy
            </p>
            <Button onClick={onStartQuiz} className="w-full">
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Assistant</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Get expert insights on CoreDAO and BTCfi protocols
            </p>
            <Button variant="outline" className="w-full">
              Ask AI <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(totalProgress)}%</span>
            </div>
            <Progress value={totalProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Complete daily habits and investment steps to unlock features
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};