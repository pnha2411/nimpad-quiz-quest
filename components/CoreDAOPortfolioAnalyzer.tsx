import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  TrendingUp, 
  Shield, 
  AlertTriangle, 
  Vote, 
  Coins,
  Bitcoin,
  Loader2,
  ExternalLink,
  Clock
} from 'lucide-react';
import { useCoreDAOPortfolio, CoreDAOPosition, YieldOptimizationProposal, PortfolioAlert } from '@/hooks/useCoreDAOPortfolio';

interface CoreDAOPortfolioAnalyzerProps {
  onBack: () => void;
}

export const CoreDAOPortfolioAnalyzer: React.FC<CoreDAOPortfolioAnalyzerProps> = ({ onBack }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [proposalIdea, setProposalIdea] = useState('');
  const { 
    portfolio, 
    proposals, 
    alerts, 
    loading, 
    analyzePortfolio, 
    draftGovernanceProposal 
  } = useCoreDAOPortfolio();

  const handleAnalyze = async () => {
    if (!walletAddress.trim()) return;
    await analyzePortfolio(walletAddress);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const PositionCard: React.FC<{ position: CoreDAOPosition }> = ({ position }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold">{position.protocol}</h4>
            <p className="text-sm text-muted-foreground">{position.asset}</p>
          </div>
          <Badge variant="outline">{position.apy} APY</Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Amount:</span>
            <span className="font-medium">{position.amount} {position.asset}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Value:</span>
            <span className="font-medium">{formatCurrency(position.value_usd)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Unclaimed Rewards:</span>
            <span className="font-medium text-green-600">{position.rewards_unclaimed} CORE</span>
          </div>
          {position.tier && (
            <div className="flex justify-between text-sm">
              <span>Tier:</span>
              <Badge variant="secondary">{position.tier}</Badge>
            </div>
          )}
          {position.lock_period && (
            <div className="flex justify-between text-sm">
              <span>Lock Period:</span>
              <span className="text-amber-600">{position.lock_period}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const ProposalCard: React.FC<{ proposal: YieldOptimizationProposal }> = ({ proposal }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-semibold">{proposal.proposal}</h4>
          <Badge variant={
            proposal.priority === 'high' ? 'destructive' : 
            proposal.priority === 'medium' ? 'default' : 'secondary'
          }>
            {proposal.priority}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-800">Expected Yield Increase</p>
            <p className="text-sm text-green-700">{proposal.expected_apy_increase}</p>
          </div>
          
          <div className="p-3 bg-amber-50 rounded-lg">
            <p className="text-sm font-medium text-amber-800">Risks</p>
            <p className="text-sm text-amber-700">{proposal.risks}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Required Actions:</p>
            <ul className="text-sm space-y-1">
              {proposal.actions.map((action, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const AlertCard: React.FC<{ alert: PortfolioAlert }> = ({ alert }) => (
    <Alert className={`${
      alert.type === 'expiration' ? 'border-amber-200 bg-amber-50' :
      alert.type === 'opportunity' ? 'border-green-200 bg-green-50' :
      alert.type === 'governance' ? 'border-blue-200 bg-blue-50' :
      'border-red-200 bg-red-50'
    }`}>
      <div className="flex items-start gap-3">
        {alert.type === 'expiration' && <Clock className="h-4 w-4 text-amber-600 mt-0.5" />}
        {alert.type === 'opportunity' && <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />}
        {alert.type === 'governance' && <Vote className="h-4 w-4 text-blue-600 mt-0.5" />}
        {alert.type === 'risk' && <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />}
        
        <div className="flex-1">
          <AlertDescription className="mb-2">{alert.message}</AlertDescription>
          <div className="flex items-center gap-2">
            {alert.deadline && (
              <Badge variant="outline" className="text-xs">
                Due: {alert.deadline}
              </Badge>
            )}
            {alert.link && (
              <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                <ExternalLink className="h-3 w-3 mr-1" />
                View Details
              </Button>
            )}
          </div>
        </div>
      </div>
    </Alert>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={onBack}>
          ← Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            CoreDAO Portfolio Analyzer
          </h1>
          <p className="text-muted-foreground">AI-powered DeFi portfolio analysis and optimization</p>
        </div>
      </div>

      {/* Wallet Input */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Portfolio Analysis
          </CardTitle>
          <CardDescription>
            Enter your CoreDAO wallet address to analyze your DeFi positions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="0x... (CoreDAO wallet address)"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleAnalyze}
              disabled={loading || !walletAddress.trim()}
              className="px-8"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Portfolio'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {portfolio && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Coins className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Total Value</span>
                  </div>
                  <p className="text-2xl font-bold">{formatCurrency(portfolio.total_value_usd)}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Avg APY</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{portfolio.average_apy}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Staking Tier</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{portfolio.staking_tier}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Bitcoin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Positions</span>
                  </div>
                  <p className="text-2xl font-bold">{portfolio.positions.length}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Portfolio Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2">CORE Staked</p>
                    <p className="text-lg">{portfolio.core_staked.toLocaleString()} CORE</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">BTC Staked</p>
                    <p className="text-lg">{portfolio.btc_staked} BTC</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Positions Tab */}
          <TabsContent value="positions" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.positions.map((position, index) => (
                <PositionCard key={index} position={position} />
              ))}
            </div>
          </TabsContent>

          {/* Optimization Tab */}
          <TabsContent value="optimization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Yield Optimization Proposals</CardTitle>
                <CardDescription>
                  AI-generated recommendations to maximize your portfolio yield
                </CardDescription>
              </CardHeader>
            </Card>
            
            <div className="space-y-6">
              {proposals.map((proposal, index) => (
                <ProposalCard key={index} proposal={proposal} />
              ))}
            </div>
          </TabsContent>

          {/* Governance Tab */}
          <TabsContent value="governance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Governance Proposal Assistant</CardTitle>
                <CardDescription>
                  Draft governance proposals with AI assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Describe your proposal idea:
                    </label>
                    <Input
                      placeholder="e.g., increase staking rewards, new yield vault, parameter adjustment"
                      value={proposalIdea}
                      onChange={(e) => setProposalIdea(e.target.value)}
                    />
                  </div>
                  
                  {proposalIdea && (
                    <Card className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        {(() => {
                          const draft = draftGovernanceProposal(proposalIdea);
                          return (
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-blue-700">{draft.title}</h4>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Background:</p>
                                <p className="text-sm text-muted-foreground">{draft.background}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Proposal:</p>
                                <p className="text-sm text-muted-foreground">{draft.proposal}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Benefits:</p>
                                <p className="text-sm text-muted-foreground">{draft.benefits}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Risks:</p>
                                <p className="text-sm text-muted-foreground">{draft.risks}</p>
                              </div>
                            </div>
                          );
                        })()}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Alerts</CardTitle>
                <CardDescription>
                  Important notifications and opportunities for your portfolio
                </CardDescription>
              </CardHeader>
            </Card>
            
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <AlertCard key={index} alert={alert} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};