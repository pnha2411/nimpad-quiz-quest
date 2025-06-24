
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { useQuiz } from '@/hooks/useQuiz';
import { toast } from '@/hooks/use-toast';

interface QuizEngineProps {
  onComplete: () => void;
  onBack: () => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({ onComplete, onBack }) => {
  const { getAvailableQuizzes, completeQuiz } = useQuiz();
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);

  const availableQuizzes = getAvailableQuizzes();
  const currentQuiz = availableQuizzes[currentQuizIndex];

  useEffect(() => {
    if (availableQuizzes.length === 0) {
      toast({
        title: "All quizzes completed!",
        description: "You've completed all available quizzes. Great job!",
      });
      onComplete();
    }
  }, [availableQuizzes.length, onComplete]);

  // Add loading state while checking for available quizzes
  if (availableQuizzes.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">All Quizzes Completed!</h3>
          <p className="text-gray-600 mb-6">
            You've successfully completed all available quizzes. Check back later for new content!
          </p>
          <Button onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Add safety check for currentQuiz
  if (!currentQuiz) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-12">
          <p className="text-gray-600 mb-6">Loading quiz...</p>
          <Button onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) {
      toast({
        title: "Please select an answer",
        description: "Choose one of the options before submitting.",
        variant: "destructive",
      });
      return;
    }

    setShowResult(true);

    if (selectedAnswer === currentQuiz.correctAnswer) {
      setTotalPoints(prev => prev + currentQuiz.points);
      completeQuiz(currentQuiz.id, currentQuiz.points);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex < availableQuizzes.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleFinishQuiz = () => {
    toast({
      title: "Quiz session completed!",
      description: `You earned a total of ${totalPoints} points this session.`,
    });
    onComplete();
  };

  if (quizCompleted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Session Complete!</h3>
          <p className="text-gray-600 mb-4">
            Great job! You've completed this quiz session.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="text-sm text-green-700 mb-1">Points Earned This Session</div>
            <div className="text-3xl font-bold text-green-800">{totalPoints}</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleFinishQuiz} className="bg-gradient-to-r from-green-600 to-blue-600">
              Back to Dashboard
            </Button>
            {availableQuizzes.length > currentQuizIndex + 1 && (
              <Button variant="outline" onClick={() => {
                setCurrentQuizIndex(prev => prev + 1);
                setSelectedAnswer(null);
                setShowResult(false);
                setQuizCompleted(false);
              }}>
                Continue with Next Quiz
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="text-sm text-gray-600">
          Question {currentQuizIndex + 1} of {availableQuizzes.length}
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Quiz Progress</span>
          <span>{Math.round((currentQuizIndex / availableQuizzes.length) * 100)}%</span>
        </div>
        <Progress value={(currentQuizIndex / availableQuizzes.length) * 100} className="h-2" />
      </div>

      {/* Citrea Documentation Link */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Study Material</h4>
              <p className="text-sm text-blue-700">
                Review Citrea's documentation before answering
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a 
                href="https://docs.citrea.xyz/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Docs
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quiz Question */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">
            {currentQuiz.question}
          </CardTitle>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Quiz #{currentQuiz.id}</span>
            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
              {currentQuiz.points} points
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuiz.options.map((option, index) => {
              let buttonClass = "w-full text-left p-4 border-2 rounded-lg transition-all ";
              
              if (showResult) {
                if (index === currentQuiz.correctAnswer) {
                  buttonClass += "border-green-500 bg-green-50 text-green-800";
                } else if (index === selectedAnswer && selectedAnswer !== currentQuiz.correctAnswer) {
                  buttonClass += "border-red-500 bg-red-50 text-red-800";
                } else {
                  buttonClass += "border-gray-200 bg-gray-50 text-gray-600";
                }
              } else if (selectedAnswer === index) {
                buttonClass += "border-blue-500 bg-blue-50 text-blue-800";
              } else {
                buttonClass += "border-gray-200 hover:border-blue-300 hover:bg-blue-25";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={buttonClass}
                >
                  <div className="flex items-center">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-3 text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {showResult && index === currentQuiz.correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
                    )}
                    {showResult && index === selectedAnswer && selectedAnswer !== currentQuiz.correctAnswer && (
                      <XCircle className="w-5 h-5 text-red-600 ml-2" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Result Explanation */}
          {showResult && currentQuiz.explanation && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="py-4">
                <h4 className="font-medium text-blue-900 mb-2">Explanation</h4>
                <p className="text-blue-800">{currentQuiz.explanation}</p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            {!showResult ? (
              <Button 
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Submit Answer
              </Button>
            ) : (
              <Button 
                onClick={handleNextQuestion}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                {currentQuizIndex < availableQuizzes.length - 1 ? 'Next Question' : 'Complete Quiz'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
