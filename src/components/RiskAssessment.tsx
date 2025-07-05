import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, CheckCircle, AlertTriangle, TrendingUp, Shield } from 'lucide-react';
import { usePortfolio, RiskProfile } from '@/hooks/usePortfolio';

interface RiskAssessmentProps {
  onBack: () => void;
  onComplete: () => void;
}

const questions = [
  {
    id: 'experience',
    title: 'What is your experience with Bitcoin and DeFi?',
    options: [
      { value: 'beginner', label: 'New to Bitcoin/DeFi', points: 1 },
      { value: 'intermediate', label: 'Some experience (1-2 years)', points: 5 },
      { value: 'advanced', label: 'Experienced (3+ years)', points: 9 }
    ]
  },
  {
    id: 'investment_timeline',
    title: 'What is your investment timeline?',
    options: [
      { value: 'short', label: 'Short-term (< 1 year)', points: 3 },
      { value: 'medium', label: 'Medium-term (1-3 years)', points: 6 },
      { value: 'long', label: 'Long-term (3+ years)', points: 9 }
    ]
  },
  {
    id: 'risk_tolerance',
    title: 'How comfortable are you with potential losses?',
    options: [
      { value: 'low', label: 'Very uncomfortable with any losses', points: 1 },
      { value: 'medium', label: 'Comfortable with moderate losses', points: 5 },
      { value: 'high', label: 'Comfortable with significant losses for higher returns', points: 9 }
    ]
  },
  {
    id: 'portfolio_size',
    title: 'What percentage of your portfolio would you allocate to BTCFi?',
    options: [
      { value: 'small', label: 'Less than 10%', points: 2 },
      { value: 'medium', label: '10-30%', points: 5 },
      { value: 'large', label: 'More than 30%', points: 8 }
    ]
  },
  {
    id: 'knowledge',
    title: 'How familiar are you with concepts like yield farming, liquidity pools, and smart contract risks?',
    options: [
      { value: 'unfamiliar', label: 'Not familiar at all', points: 1 },
      { value: 'basic', label: 'Basic understanding', points: 4 },
      { value: 'advanced', label: 'Very familiar', points: 8 }
    ]
  }
];

export const RiskAssessment: React.FC<RiskAssessmentProps> = ({ onBack, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateRiskProfile } = usePortfolio();

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateRiskScore = () => {
    let totalPoints = 0;
    let maxPoints = 0;

    questions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        const option = question.options.find(opt => opt.value === answer);
        if (option) {
          totalPoints += option.points;
        }
      }
      maxPoints += Math.max(...question.options.map(opt => opt.points));
    });

    return Math.round((totalPoints / maxPoints) * 10);
  };

  const getRiskLevel = (score: number) => {
    if (score <= 3) return { level: 'Conservative', color: 'bg-green-500', icon: Shield };
    if (score <= 7) return { level: 'Moderate', color: 'bg-yellow-500', icon: TrendingUp };
    return { level: 'Aggressive', color: 'bg-red-500', icon: AlertTriangle };
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const riskScore = calculateRiskScore();
    const experienceLevel = answers.experience as 'beginner' | 'intermediate' | 'advanced';
    const investmentTimeline = answers.investment_timeline as 'short' | 'medium' | 'long';
    
    await updateRiskProfile({
      experience_level: experienceLevel,
      risk_tolerance: riskScore,
      investment_timeline: investmentTimeline,
      assessment_data: answers
    });
    
    setIsSubmitting(false);
    onComplete();
  };

  const isCompleted = Object.keys(answers).length === questions.length;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isCompleted && currentQuestion === questions.length - 1) {
    const riskScore = calculateRiskScore();
    const riskLevel = getRiskLevel(riskScore);
    const RiskIcon = riskLevel.icon;

    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Assessment Complete!</CardTitle>
            <CardDescription>
              Based on your answers, here's your risk profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <RiskIcon className="h-6 w-6" />
                <span className="text-2xl font-bold">{riskLevel.level} Investor</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span>Risk Score:</span>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {riskScore}/10
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Conservative</span>
                <span>Aggressive</span>
              </div>
              <div className="relative">
                <Progress value={riskScore * 10} className="h-3" />
                <div 
                  className={`absolute top-0 h-3 w-3 rounded-full ${riskLevel.color} transform -translate-x-1/2`}
                  style={{ left: `${riskScore * 10}%` }}
                />
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Recommended Strategy:</h4>
              <p className="text-sm text-muted-foreground">
                {riskScore <= 3 && "Focus on stable protocols like Babylon Staking with lower but more predictable yields."}
                {riskScore > 3 && riskScore <= 7 && "A balanced approach mixing stable staking with moderate DeFi exposure."}
                {riskScore > 7 && "Higher allocation to DeFi protocols for maximum yield potential, accepting higher volatility."}
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onBack} className="flex-1">
                Back to Dashboard
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const currentAnswer = answers[question.id];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Risk Assessment</h1>
          <p className="text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{question.title}</CardTitle>
          <CardDescription>
            Select the option that best describes your situation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={currentAnswer}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
          >
            {question.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2 p-4 rounded-lg border hover:bg-muted cursor-pointer">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!currentAnswer}
          className="flex items-center gap-2"
        >
          {currentQuestion === questions.length - 1 ? 'Review' : 'Next'}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};