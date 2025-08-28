import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Flame, 
  Target, 
  Star,
  TrendingUp,
  Calendar,
  Award
} from 'lucide-react';
import { UserProgress as UserProgressType, Badge as BadgeType } from '@/types/habits';

interface UserProgressProps {
  progress: UserProgressType;
  habitCount: number;
}

const getLevelProgress = (points: number): { level: number; currentLevelPoints: number; nextLevelPoints: number; progress: number } => {
  const pointsPerLevel = 1000;
  const level = Math.floor(points / pointsPerLevel) + 1;
  const currentLevelPoints = points % pointsPerLevel;
  const nextLevelPoints = pointsPerLevel;
  const progress = (currentLevelPoints / nextLevelPoints) * 100;
  
  return { level, currentLevelPoints, nextLevelPoints, progress };
};

const getBadgeIcon = (category: BadgeType['category']) => {
  switch (category) {
    case 'streak': return Flame;
    case 'milestone': return Trophy;
    case 'social': return Star;
    case 'special': return Award;
    default: return Trophy;
  }
};

export const UserProgress: React.FC<UserProgressProps> = ({ progress, habitCount }) => {
  const levelInfo = getLevelProgress(progress.totalPoints);
  const completionRate = habitCount > 0 ? Math.round((progress.completedHabits / habitCount) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Level & Points */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Level {levelInfo.level}
            </span>
            <span className="text-sm text-muted-foreground">
              {progress.totalPoints.toLocaleString()} total points
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {levelInfo.level + 1}</span>
              <span>{levelInfo.currentLevelPoints}/{levelInfo.nextLevelPoints}</span>
            </div>
            <Progress value={levelInfo.progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <div className="text-xs text-muted-foreground">Completion Rate</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold">{progress.weeklyStreak}</div>
            <div className="text-xs text-muted-foreground">Week Streak</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold">{progress.monthlyStreak}</div>
            <div className="text-xs text-muted-foreground">Month Streak</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold">{progress.badges.length}</div>
            <div className="text-xs text-muted-foreground">Badges Earned</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Badges */}
      {progress.badges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {progress.badges.slice(-4).map((badge) => {
                const IconComponent = getBadgeIcon(badge.category);
                return (
                  <div key={badge.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className={`p-2 rounded-full bg-${badge.color}-100`}>
                      <IconComponent className={`w-4 h-4 text-${badge.color}-600`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{badge.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{badge.description}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(badge.earnedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {badge.category}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};