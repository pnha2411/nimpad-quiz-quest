import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, ArrowRight } from 'lucide-react';

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
  // PRESERVE ALL DAILY HABITS FUNCTIONALITY
  const [dailyHabits, setDailyHabits] = useState([
    { id: 1, title: "Morning Market Analysis", completed: false, streak: 3 },
    { id: 2, title: "Protocol Research", completed: true, streak: 7 },
    { id: 3, title: "Portfolio Review", completed: false, streak: 2 },
    { id: 4, title: "Risk Assessment", completed: true, streak: 5 }
  ]);

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

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

      {/* Daily Habits - PRESERVED ORIGINAL FUNCTIONALITY */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Daily BTCfi Habits
            <span className="text-sm font-normal text-muted-foreground">{completedHabitsCount}/4 completed</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dailyHabits.map((habit) => (
              <div 
                key={habit.id} 
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                onClick={() => toggleHabit(habit.id)}
              >
                <div className="flex items-center gap-3">
                  {habit.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div>
                    <div className="font-medium">{habit.title}</div>
                    <div className="text-sm text-muted-foreground">🔥 {habit.streak} day streak</div>
                  </div>
                </div>
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