
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, BookOpen, Coins, ExternalLink, Target } from 'lucide-react';

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
  const progressPercentage = (completedQuizzes / totalQuizzes) * 100;
  const hasAvailableQuizzes = completedQuizzes < totalQuizzes;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Nimpad Learning Hub
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Master Citrea's Bitcoin Layer 2 technology through interactive quizzes and earn real tokens for your knowledge.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Points</CardTitle>
            <Trophy className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{points}</div>
            <p className="text-xs text-blue-600">
              Points earned from quizzes
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Progress</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{completedQuizzes}/{totalQuizzes}</div>
            <p className="text-xs text-green-600 mb-2">
              Quizzes completed
            </p>
            <Progress value={progressPercentage} className="h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Claimable</CardTitle>
            <Coins className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{points}</div>
            <p className="text-xs text-purple-600">
              Tokens ready to claim
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Section */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
              Continue Learning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Explore Citrea's documentation and test your knowledge with our interactive quizzes.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Read Citrea documentation</li>
                <li>• Complete knowledge quizzes</li>
                <li>• Earn points for correct answers</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={onStartQuiz}
                disabled={!hasAvailableQuizzes}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {hasAvailableQuizzes ? 'Start Quiz' : 'All Quizzes Complete'}
              </Button>
              
              <Button variant="outline" asChild>
                <a 
                  href="https://docs.citrea.xyz/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Read Docs
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Token Claiming Section */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Coins className="w-5 h-5 mr-2 text-purple-600" />
              Claim Your Rewards
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Convert your earned points into real tokens through Citrea's smart contract integration.
            </p>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-2">Your Rewards:</h4>
              <div className="text-sm text-purple-800 space-y-1">
                <div className="flex justify-between">
                  <span>Available Points:</span>
                  <span className="font-medium">{points}</span>
                </div>
                <div className="flex justify-between">
                  <span>Token Ratio:</span>
                  <span className="font-medium">1:1</span>
                </div>
                <div className="flex justify-between border-t border-purple-200 pt-2 mt-2">
                  <span className="font-medium">Claimable Tokens:</span>
                  <span className="font-bold">{points}</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={onClaimTokens}
              disabled={points === 0}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Coins className="w-4 h-4 mr-2" />
              {points > 0 ? `Claim ${points} Tokens` : 'No Tokens to Claim'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      {completedQuizzes === totalQuizzes && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="text-center py-8">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Congratulations! 🎉
            </h3>
            <p className="text-gray-600 mb-4">
              You've completed all available quizzes and mastered Citrea's fundamentals!
            </p>
            <div className="bg-white rounded-lg p-4 inline-block">
              <div className="text-sm text-gray-600 mb-1">Total Points Earned</div>
              <div className="text-3xl font-bold text-green-600">{points}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
