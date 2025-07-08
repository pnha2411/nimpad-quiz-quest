import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen,
  Code,
  Coins,
  ExternalLink,
  PlayCircle,
  Target
} from 'lucide-react';

interface SimpleDashboardProps {
  points: number;
  completedQuizzes: number;
  totalQuizzes: number;
  onStartQuiz: () => void;
  onClaimTokens: () => void;
}

export const SimpleDashboard: React.FC<SimpleDashboardProps> = ({
  points,
  completedQuizzes,
  totalQuizzes,
  onStartQuiz,
  onClaimTokens,
}) => {
  const quickActions = [
    {
      title: "Learn Core DAO",
      description: "Start with basics and build your knowledge",
      icon: BookOpen,
      action: () => window.open('https://docs.coredao.org', '_blank'),
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200"
    },
    {
      title: "Build Portfolio",
      description: "Track and optimize your DeFi positions",
      icon: Target,
      action: onStartQuiz,
      color: "bg-green-50 hover:bg-green-100 border-green-200"
    },
    {
      title: "AI Assistant",
      description: "Get help with Core DAO development",
      icon: Code,
      action: () => {}, // Will be handled by parent navigation
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200"
    }
  ];

  const learningResources = [
    { title: "Core DAO Documentation", url: "https://docs.coredao.org", type: "Docs" },
    { title: "Developer Academy", url: "https://academy.coredao.org", type: "Learn" },
    { title: "GitHub Repository", url: "https://github.com/coredao-org", type: "Code" },
    { title: "Community Discord", url: "https://discord.com/invite/coredaoofficial", type: "Community" }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Welcome to Core DAO Builder</h2>
        <p className="text-muted-foreground">Your journey to mastering Bitcoin-powered blockchain development starts here</p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <Card key={index} className={`cursor-pointer transition-all duration-200 ${action.color}`} onClick={action.action}>
            <CardHeader className="text-center pb-4">
              <action.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle className="text-lg">{action.title}</CardTitle>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="secondary" className="w-full">
                <PlayCircle className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Learning Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Essential Resources
          </CardTitle>
          <CardDescription>Quick access to important Core DAO resources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {learningResources.map((resource, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <h4 className="font-medium">{resource.title}</h4>
                  <span className="text-xs text-muted-foreground">{resource.type}</span>
                </div>
                <Button size="sm" variant="ghost" onClick={() => window.open(resource.url, '_blank')}>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Learning Progress</span>
            <span className="text-sm text-muted-foreground">{completedQuizzes}/{totalQuizzes} completed</span>
          </div>
          <Progress value={(completedQuizzes / totalQuizzes) * 100} className="h-2" />
          
          <div className="flex justify-between items-center pt-4">
            <div>
              <div className="text-2xl font-bold text-primary">{points}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </div>
            <Button onClick={onClaimTokens} disabled={points === 0}>
              Claim Rewards
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};