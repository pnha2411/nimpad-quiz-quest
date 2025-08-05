export interface Habit {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  icon: string;
  color: string;
  tags: string[];
  category: 'daily' | 'weekly' | 'monthly';
  difficulty: 'easy' | 'medium' | 'hard';
  streak: number;
  maxStreak: number;
  completed: boolean;
  completedDates: string[];
  tasks: string[];
  resources: Resource[];
  createdAt: string;
  updatedAt: string;
  isCustom: boolean;
  points: number;
  journalEntries: JournalEntry[];
  reminderTime?: string;
  targetCount?: number;
  currentCount: number;
}

export interface Resource {
  title: string;
  url: string;
  type: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: 'great' | 'good' | 'okay' | 'difficult';
  notes: string;
  reflection: string;
}

export interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  habits: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'streak' | 'maxStreak' | 'completedDates' | 'journalEntries'>[];
  category: string;
  author: string;
  isPublic: boolean;
  likes: number;
  uses: number;
}

export interface UserProgress {
  totalPoints: number;
  level: number;
  badges: Badge[];
  weeklyStreak: number;
  monthlyStreak: number;
  completedHabits: number;
  totalHabits: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: string;
  category: 'streak' | 'milestone' | 'social' | 'special';
}