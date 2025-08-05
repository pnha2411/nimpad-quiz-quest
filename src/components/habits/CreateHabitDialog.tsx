import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X, Target, Sparkles } from 'lucide-react';
import { Habit } from '@/types/habits';

interface CreateHabitDialogProps {
  onCreateHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'streak' | 'maxStreak' | 'completedDates' | 'journalEntries'>) => void;
  children: React.ReactNode;
}

const HABIT_ICONS = ['📚', '💪', '🧘', '💰', '🎯', '🌱', '⚡', '🔥', '💡', '🎨', '🏃', '💻', '📝', '🍎', '💤'];
const HABIT_COLORS = ['blue', 'green', 'purple', 'red', 'orange', 'yellow', 'pink', 'indigo', 'teal'];

const HABIT_TEMPLATES = [
  {
    title: 'Morning Routine',
    description: 'Start your day with purpose',
    icon: '🌅',
    category: 'daily' as const,
    difficulty: 'easy' as const,
    tasks: ['Wake up at set time', 'Drink water', 'Light stretching', 'Review daily goals'],
    tags: ['morning', 'routine', 'wellness']
  },
  {
    title: 'Exercise',
    description: 'Stay active and healthy',
    icon: '💪',
    category: 'daily' as const,
    difficulty: 'medium' as const,
    tasks: ['30 minutes cardio', 'Strength training', 'Cool down stretches'],
    tags: ['fitness', 'health', 'strength']
  },
  {
    title: 'Learning',
    description: 'Expand your knowledge daily',
    icon: '📚',
    category: 'daily' as const,
    difficulty: 'medium' as const,
    tasks: ['Read for 30 minutes', 'Practice new skill', 'Review notes'],
    tags: ['education', 'growth', 'knowledge']
  },
  {
    title: 'Meditation',
    description: 'Find inner peace and clarity',
    icon: '🧘',
    category: 'daily' as const,
    difficulty: 'easy' as const,
    tasks: ['10 minutes mindfulness', 'Deep breathing', 'Gratitude reflection'],
    tags: ['mindfulness', 'peace', 'mental-health']
  }
];

export const CreateHabitDialog: React.FC<CreateHabitDialogProps> = ({
  onCreateHabit,
  children
}) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'custom' | 'template'>('template');
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    icon: '🎯',
    color: 'blue',
    category: 'daily' as 'daily' | 'weekly' | 'monthly',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    points: 50,
    tags: [] as string[],
    tasks: [] as string[],
    resources: [] as Array<{title: string; url: string; type: string}>
  });
  const [currentTag, setCurrentTag] = useState('');
  const [currentTask, setCurrentTask] = useState('');

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      icon: '🎯',
      color: 'blue',
      category: 'daily',
      difficulty: 'medium',
      points: 50,
      tags: [],
      tasks: [],
      resources: []
    });
    setCurrentTag('');
    setCurrentTask('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    const newHabit = {
      title: formData.title,
      subtitle: formData.subtitle,
      description: formData.description,
      icon: formData.icon,
      color: formData.color,
      category: formData.category,
      difficulty: formData.difficulty,
      tags: formData.tags,
      tasks: formData.tasks,
      resources: formData.resources,
      points: formData.points,
      isCustom: true,
      currentCount: 0
    };

    onCreateHabit(newHabit);
    setOpen(false);
    resetForm();
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addTask = () => {
    if (currentTask.trim()) {
      setFormData(prev => ({
        ...prev,
        tasks: [...prev.tasks, currentTask.trim()]
      }));
      setCurrentTask('');
    }
  };

  const removeTask = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index)
    }));
  };

  const applyTemplate = (template: typeof HABIT_TEMPLATES[0]) => {
    setFormData(prev => ({
      ...prev,
      title: template.title,
      description: template.description,
      icon: template.icon,
      category: template.category,
      difficulty: template.difficulty,
      tasks: [...template.tasks],
      tags: [...template.tags]
    }));
    setMode('custom');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Create New Habit
          </DialogTitle>
        </DialogHeader>

        {/* Mode Selection */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={mode === 'template' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('template')}
          >
            Templates
          </Button>
          <Button
            variant={mode === 'custom' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('custom')}
          >
            Custom
          </Button>
        </div>

        {mode === 'template' ? (
          /* Template Selection */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {HABIT_TEMPLATES.map((template, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => applyTemplate(template)}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{template.icon}</span>
                    <div>
                      <h3 className="font-medium">{template.title}</h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {template.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Custom Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter habit title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Brief description"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="What is this habit about?"
                rows={3}
              />
            </div>

            {/* Icon & Color */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Icon</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {HABIT_ICONS.map((icon) => (
                    <Button
                      key={icon}
                      type="button"
                      variant={formData.icon === icon ? 'default' : 'outline'}
                      size="sm"
                      className="w-10 h-10 p-0"
                      onClick={() => setFormData(prev => ({ ...prev, icon }))}
                    >
                      {icon}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {HABIT_COLORS.map((color) => (
                    <Button
                      key={color}
                      type="button"
                      variant={formData.color === color ? 'default' : 'outline'}
                      size="sm"
                      className="capitalize"
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Category, Difficulty, Points */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Difficulty</Label>
                <Select value={formData.difficulty} onValueChange={(value: any) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) || 50 }))}
                  min="10"
                  max="100"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Add tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    #{tag}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tasks */}
            <div>
              <Label>Daily Tasks</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={currentTask}
                  onChange={(e) => setCurrentTask(e.target.value)}
                  placeholder="Add task"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTask())}
                />
                <Button type="button" onClick={addTask} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2 mt-2">
                {formData.tasks.map((task, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <span className="flex-1 text-sm">{task}</span>
                    <X 
                      className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-red-500" 
                      onClick={() => removeTask(index)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Create Habit
              </Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};