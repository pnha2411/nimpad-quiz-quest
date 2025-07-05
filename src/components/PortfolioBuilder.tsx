import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, PieChart, TrendingUp, Shield, Zap } from 'lucide-react';
import { usePortfolio, Portfolio } from '@/hooks/usePortfolio';

interface PortfolioBuilderProps {
  onBack: () => void;
}

export const PortfolioBuilder: React.FC<PortfolioBuilderProps> = ({ onBack }) => {
  const { protocols, riskProfile, createPortfolio, getPortfolioRecommendations } = usePortfolio();
  const [portfolioName, setPortfolioName] = useState('');
  const [customAllocations, setCustomAllocations] = useState<Record<string, number>>({});
  const [selectedTemplate, setSelectedTemplate] = useState<'conservative' | 'balanced' | 'aggressive' | 'custom'>('balanced');
  const [isCreating, setIsCreating] = useState(false);

  const riskScore = riskProfile?.risk_tolerance || 5;
  const recommendations = getPortfolioRecommendations(riskScore);

  const templates = {
    conservative: {
      name: 'Conservative',
      icon: Shield,
      description: 'Low risk, stable returns',
      risk: 2,
      expectedApy: 8.5,
      allocations: getPortfolioRecommendations(2).allocations
    },
    balanced: {
      name: 'Balanced',
      icon: PieChart,
      description: 'Moderate risk, balanced returns',
      risk: 5,
      expectedApy: 12.3,
      allocations: getPortfolioRecommendations(5).allocations
    },
    aggressive: {
      name: 'Aggressive',
      icon: TrendingUp,
      description: 'High risk, maximum returns',
      risk: 8,
      expectedApy: 18.7,
      allocations: getPortfolioRecommendations(8).allocations
    },
    custom: {
      name: 'Custom',
      icon: Zap,
      description: 'Build your own allocation',
      risk: riskScore,
      expectedApy: 0,
      allocations: customAllocations
    }
  };

  const handleAllocationChange = (protocolName: string, value: number) => {
    setCustomAllocations(prev => ({
      ...prev,
      [protocolName]: Math.max(0, Math.min(100, value))
    }));
  };

  const getTotalAllocation = () => {
    const allocations = selectedTemplate === 'custom' ? customAllocations : templates[selectedTemplate].allocations;
    return Object.values(allocations).reduce((sum, val) => sum + val, 0);
  };

  const handleCreatePortfolio = async () => {
    if (!portfolioName.trim()) return;
    
    setIsCreating(true);
    const allocations = selectedTemplate === 'custom' ? customAllocations : templates[selectedTemplate].allocations;
    
    await createPortfolio({
      name: portfolioName,
      template_type: selectedTemplate,
      risk_score: templates[selectedTemplate].risk,
      allocations,
      status: 'draft'
    });
    
    setIsCreating(false);
    onBack();
  };

  const isValidPortfolio = portfolioName.trim() && getTotalAllocation() === 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Portfolio Builder
          </h1>
          <p className="text-muted-foreground">Create your personalized BTCFi portfolio</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Template Selection */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Choose a Template</CardTitle>
              <CardDescription>
                Select a pre-built portfolio or create your own custom allocation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(templates).map(([key, template]) => {
                  const Icon = template.icon;
                  return (
                    <Card 
                      key={key}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedTemplate === key ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedTemplate(key as any)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Icon className="h-5 w-5 text-primary" />
                          <span className="font-semibold">{template.name}</span>
                          <Badge variant="outline">Risk {template.risk}/10</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                        {key !== 'custom' && (
                          <p className="text-sm font-medium text-green-600">
                            Expected APY: {template.expectedApy}%
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Allocation Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Allocation</CardTitle>
              <CardDescription>
                {selectedTemplate === 'custom' 
                  ? 'Set your custom allocation percentages'
                  : `Recommended allocation for ${templates[selectedTemplate].name} strategy`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {protocols.map(protocol => {
                  const allocation = selectedTemplate === 'custom' 
                    ? customAllocations[protocol.name] || 0
                    : templates[selectedTemplate].allocations[protocol.name] || 0;

                  return (
                    <div key={protocol.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">{protocol.name}</Label>
                          <p className="text-sm text-muted-foreground">{protocol.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{protocol.apy_current}% APY</Badge>
                          <Badge variant="secondary">{protocol.chain}</Badge>
                        </div>
                      </div>
                      
                      {selectedTemplate === 'custom' ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={allocation}
                            onChange={(e) => handleAllocationChange(protocol.name, Number(e.target.value))}
                            className="w-20"
                          />
                          <span className="text-sm">%</span>
                          <Progress value={allocation} className="flex-1" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium w-12">{allocation}%</span>
                          <Progress value={allocation} className="flex-1" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Allocation:</span>
                  <span className={`font-bold ${getTotalAllocation() === 100 ? 'text-green-600' : 'text-red-600'}`}>
                    {getTotalAllocation()}%
                  </span>
                </div>
                {getTotalAllocation() !== 100 && (
                  <p className="text-sm text-red-600 mt-1">
                    Total allocation must equal 100%
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Summary */}
        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Portfolio Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="portfolio-name">Portfolio Name</Label>
                <Input
                  id="portfolio-name"
                  value={portfolioName}
                  onChange={(e) => setPortfolioName(e.target.value)}
                  placeholder="My BTCFi Portfolio"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Template:</span>
                  <span className="text-sm font-medium">{templates[selectedTemplate].name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Risk Level:</span>
                  <Badge variant="outline">{templates[selectedTemplate].risk}/10</Badge>
                </div>
                {selectedTemplate !== 'custom' && (
                  <div className="flex justify-between">
                    <span className="text-sm">Expected APY:</span>
                    <span className="text-sm font-medium text-green-600">
                      {templates[selectedTemplate].expectedApy}%
                    </span>
                  </div>
                )}
              </div>

              <Button 
                onClick={handleCreatePortfolio}
                disabled={!isValidPortfolio || isCreating}
                className="w-full"
              >
                {isCreating ? 'Creating...' : 'Create Portfolio'}
              </Button>

              <div className="text-xs text-muted-foreground">
                <p>• Portfolios start in draft status</p>
                <p>• You can edit allocations before deployment</p>
                <p>• No funds are moved until you deploy</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};