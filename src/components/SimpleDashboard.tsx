import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus, Filter, Search, ArrowRight, Settings, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHabits } from '@/hooks/useHabits';
import { HabitCard } from '@/components/habits/HabitCard';
import { CreateHabitDialog } from '@/components/habits/CreateHabitDialog';
import { UserProgress } from '@/components/habits/UserProgress';

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
  // Enhanced habit system with all functionality
  const { 
    habits, 
    userProgress, 
    loading,
    toggleHabit, 
    addCustomHabit, 
    updateHabit, 
    deleteHabit, 
    addJournalEntry,
    reorderHabits 
  } = useHabits();

  const [expandedHabits, setExpandedHabits] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const toggleExpanded = (habitId: string) => {
    setExpandedHabits(prev => ({
      ...prev,
      [habitId]: !prev[habitId]
    }));
  };

  // Filter habits based on search and filters
  const filteredHabits = habits.filter(habit => {
    const matchesSearch = habit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         habit.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         habit.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || habit.category === filterCategory;
    const matchesDifficulty = filterDifficulty === 'all' || habit.difficulty === filterDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const completedHabitsCount = habits.filter(h => h.completed).length;

  // Wrapper functions for HabitCard compatibility
  const handleEdit = (habitId: string) => {
    // This would open an edit dialog - simplified for now
    console.log('Edit habit:', habitId);
  };

  const handleJournal = (habitId: string) => {
    // This would open a journal dialog - simplified for now
    console.log('Journal for habit:', habitId);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading your habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center py-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          Welcome to Nimpad ✨
        </h1>
        <p className="text-muted-foreground">Your ultimate tool for personal growth and habit mastery</p>
      </div>

      {/* User Progress Section */}
      <UserProgress progress={userProgress} habitCount={habits.length} />

      {/* Habits Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              🎯 Your Habits & Routines
              <span className="text-sm font-normal text-muted-foreground">
                ({completedHabitsCount}/{habits.length} completed today)
              </span>
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <CreateHabitDialog onCreateHabit={addCustomHabit}>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Habit
                </Button>
              </CreateHabitDialog>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-3 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search habits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterCategory} onValueChange={(value: any) => setFilterCategory(value)}>
              <SelectTrigger className="w-full md:w-[130px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterDifficulty} onValueChange={(value: any) => setFilterDifficulty(value)}>
              <SelectTrigger className="w-full md:w-[130px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          {filteredHabits.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-medium mb-2">No habits found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || filterCategory !== 'all' || filterDifficulty !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first habit to get started'
                }
              </p>
              {(!searchQuery && filterCategory === 'all' && filterDifficulty === 'all') && (
                <CreateHabitDialog onCreateHabit={addCustomHabit}>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Habit
                  </Button>
                </CreateHabitDialog>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggle={toggleHabit}
                  onEdit={habit.isCustom ? handleEdit : undefined}
                  onDelete={habit.isCustom ? deleteHabit : undefined}
                  onJournal={handleJournal}
                  isExpanded={expandedHabits[habit.id] || false}
                  onToggleExpanded={toggleExpanded}
                />
              ))}
            </div>
          )}
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
    </div>
  );
};