import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Target, 
  BookOpen,
  Edit,
  Trash2,
  MessageSquare,
  Calendar,
  Trophy,
  Flame
} from 'lucide-react';
import { Habit } from '@/types/habits';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit;
  onToggle: (habitId: string) => void;
  onEdit?: (habitId: string) => void;
  onDelete?: (habitId: string) => void;
  onJournal?: (habitId: string) => void;
  isExpanded: boolean;
  onToggleExpanded: (habitId: string) => void;
  isDragging?: boolean;
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  hard: 'bg-red-100 text-red-800 border-red-200'
};

const categoryColors = {
  daily: 'bg-blue-100 text-blue-800',
  weekly: 'bg-purple-100 text-purple-800',
  monthly: 'bg-orange-100 text-orange-800'
};

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onToggle,
  onEdit,
  onDelete,
  onJournal,
  isExpanded,
  onToggleExpanded,
  isDragging = false
}) => {
  const [showActions, setShowActions] = useState(false);

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-600';
    if (streak >= 14) return 'text-blue-600';
    if (streak >= 7) return 'text-green-600';
    return 'text-muted-foreground';
  };

  const completionRate = habit.completedDates.length > 0 
    ? Math.round((habit.completedDates.length / Math.max(habit.completedDates.length + 5, 30)) * 100)
    : 0;

  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-md",
        isDragging && "opacity-50 rotate-2",
        habit.completed && "ring-2 ring-green-200 bg-green-50/50"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Header - Always Visible */}
      <div className="flex items-center justify-between p-4">
        <div 
          className="flex items-center gap-3 flex-1 cursor-pointer hover:opacity-80"
          onClick={() => onToggle(habit.id)}
        >
          {habit.completed ? (
            <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
          ) : (
            <Clock className="w-6 h-6 text-muted-foreground flex-shrink-0" />
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{habit.icon}</span>
              <h3 className="font-medium truncate">{habit.title}</h3>
            </div>
            
            {habit.subtitle && (
              <p className="text-sm text-muted-foreground truncate">{habit.subtitle}</p>
            )}
            
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="outline" className={categoryColors[habit.category]}>
                {habit.category}
              </Badge>
              
              <Badge variant="outline" className={difficultyColors[habit.difficulty]}>
                {habit.difficulty}
              </Badge>
              
              <div className={cn("flex items-center gap-1 text-xs", getStreakColor(habit.streak))}>
                <Flame className="w-3 h-3" />
                <span>{habit.streak} day streak</span>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Trophy className="w-3 h-3" />
                <span>{habit.points} pts</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Action Buttons */}
          {showActions && habit.isCustom && (
            <div className="flex items-center gap-1 mr-2">
              {onEdit && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onEdit(habit.id)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="w-3 h-3" />
                </Button>
              )}
              
              {onJournal && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onJournal(habit.id)}
                  className="h-8 w-8 p-0"
                >
                  <MessageSquare className="w-3 h-3" />
                </Button>
              )}
              
              {onDelete && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onDelete(habit.id)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onToggleExpanded(habit.id)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      
      {/* Progress Bar */}
      {habit.streak > 0 && (
        <div className="px-4 pb-2">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Completion Rate</span>
            <span>{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-1" />
        </div>
      )}
      
      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t bg-muted/20">
          <p className="text-sm text-muted-foreground pt-4">{habit.description}</p>
          
          {/* Tags */}
          {habit.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {habit.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Daily Tasks Section */}
          {habit.tasks && habit.tasks.length > 0 && (
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
          )}

          {/* Essential Resources Section */}
          {habit.resources && habit.resources.length > 0 && (
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
          )}

          {/* Chart Analytics Section - Only for Market Analysis */}
          {habit.id === 'btcfi-1' && (
            <div>
              <h4 className="font-medium mb-3 flex items-center text-sm">
                <Target className="w-4 h-4 mr-2 text-primary" />
                Chart Analytics Preview
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-background rounded border p-3">
                  <div className="text-xs text-muted-foreground mb-2">BTC/USDT Daily Chart</div>
                  <img 
                    src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop&crop=center" 
                    alt="BTC Chart Analysis" 
                    className="w-full h-24 object-cover rounded"
                  />
                  <div className="text-xs mt-2 text-muted-foreground">
                    Support: $95,000 | Resistance: $108,000
                  </div>
                </div>
                <div className="bg-background rounded border p-3">
                  <div className="text-xs text-muted-foreground mb-2">CORE/USDT Analysis</div>
                  <img 
                    src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=200&fit=crop&crop=center" 
                    alt="CORE Chart Analysis" 
                    className="w-full h-24 object-cover rounded"
                  />
                  <div className="text-xs mt-2 text-muted-foreground">
                    Trend: Bullish | Entry: $1.20-$1.35
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Journal Entries */}
          {habit.journalEntries && habit.journalEntries.length > 0 && (
            <div>
              <h4 className="font-medium mb-3 flex items-center text-sm">
                <MessageSquare className="w-4 h-4 mr-2 text-primary" />
                Recent Reflections
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {habit.journalEntries.slice(-3).map((entry) => (
                  <div key={entry.id} className="text-xs p-2 bg-background rounded border">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</span>
                      <Badge variant="outline" className="text-xs">{entry.mood}</Badge>
                    </div>
                    {entry.notes && <p className="truncate">{entry.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};