import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  DollarSign, 
  Activity, 
  BarChart3, 
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Bitcoin,
  Target
} from 'lucide-react';

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
  // Mock data for BTCfi metrics (in production, this would come from APIs)
  const btcfiMetrics = {
    totalTVL: 6290000000, // $6.29B
    tvlGrowth: 2700, // 2700% growth
    bitcoinParticipation: 0.79, // 0.79%
    activeProtocols: 138,
    dailyVolume: 45000000, // $45M
    btcPrice: 97842
  };

  const topChains = [
    { name: 'Core Blockchain', tvl: 430900000, projects: 25.2, growth: 15.4 },
    { name: 'Bitlayer', tvl: 406000000, projects: 13.0, growth: 22.1 },
    { name: 'BSquared', tvl: 369000000, projects: 6.9, growth: 18.7 },
    { name: 'Rootstock (RSK)', tvl: 260000000, projects: 13.0, growth: 12.3 },
    { name: 'BOB Network', tvl: 245000000, projects: 8.4, growth: 28.9 }
  ];

  const yieldOpportunities = [
    { protocol: 'Babylon', apy: 12.4, tvl: 1200000000, risk: 'Medium' },
    { protocol: 'Core Staking', apy: 8.7, tvl: 430000000, risk: 'Low' },
    { protocol: 'Bitlayer Yield', apy: 15.2, tvl: 180000000, risk: 'High' },
    { protocol: 'RSK DeFi', apy: 9.8, tvl: 95000000, risk: 'Medium' }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPercentage = (num: number) => `${num.toFixed(1)}%`;

  return (
    <div className="container mx-auto px-4 pb-8 space-y-6">
      {/* Header Section */}
      <div className="text-center py-8">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          BTCfi Market Overview
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Track the explosive growth of Bitcoin DeFi across Layer 2 networks and discover yield opportunities
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total BTCfi TVL</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(btcfiMetrics.totalTVL)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-600" />
              +{btcfiMetrics.tvlGrowth}% growth
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bitcoin Price</CardTitle>
            <Bitcoin className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${btcfiMetrics.btcPrice.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-600" />
              +2.4% today
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BTC Participation</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(btcfiMetrics.bitcoinParticipation)}</div>
            <p className="text-xs text-muted-foreground">
              Of total Bitcoin supply
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Protocols</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{btcfiMetrics.activeProtocols}</div>
            <p className="text-xs text-muted-foreground">
              Across all chains
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Chains */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-primary" />
              Top BTCfi Chains
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topChains.map((chain, index) => (
              <div key={chain.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{chain.name}</h4>
                    <p className="text-sm text-muted-foreground">{chain.projects}% of projects</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{formatNumber(chain.tvl)}</div>
                  <div className="text-sm text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +{formatPercentage(chain.growth)}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Yield Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Top Yield Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {yieldOpportunities.map((opportunity, index) => (
              <div key={opportunity.protocol} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <h4 className="font-medium">{opportunity.protocol}</h4>
                  <p className="text-sm text-muted-foreground">{formatNumber(opportunity.tvl)} TVL</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">{formatPercentage(opportunity.apy)} APY</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    opportunity.risk === 'Low' ? 'bg-green-100 text-green-700' :
                    opportunity.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {opportunity.risk} Risk
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-primary" />
              Start Portfolio Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Connect your wallet or explore demo portfolios to start tracking your BTCfi investments.
            </p>
            <div className="space-y-2">
              <Button 
                onClick={onStartQuiz}
                className="w-full bg-gradient-to-r from-primary to-secondary"
              >
                <PieChart className="w-4 h-4 mr-2" />
                Build Portfolio
              </Button>
              <Button variant="outline" className="w-full">
                View Demo Portfolio
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-600" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Complete our risk assessment to get personalized BTCfi investment recommendations.
            </p>
            <div className="bg-green-100 border border-green-200 rounded-lg p-3">
              <h4 className="font-medium text-green-900 mb-2">Assessment Benefits:</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Personalized yield strategies</li>
                <li>• Risk-adjusted recommendations</li>
                <li>• Portfolio optimization tips</li>
              </ul>
            </div>
            <Button 
              onClick={onClaimTokens}
              variant="outline"
              className="w-full border-green-200 hover:bg-green-50"
            >
              <Target className="w-4 h-4 mr-2" />
              Start Assessment
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Market Summary */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="py-8 text-center">
          <h3 className="text-2xl font-bold mb-4">BTCfi Ecosystem Growing Fast</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-primary">138+</div>
              <div className="text-sm text-muted-foreground">Active Projects</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary">$6.29B</div>
              <div className="text-sm text-muted-foreground">Total Value Locked</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">2,700%</div>
              <div className="text-sm text-muted-foreground">Growth Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};