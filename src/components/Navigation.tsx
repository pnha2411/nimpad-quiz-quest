
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, BookOpen, Coins, Trophy } from 'lucide-react';

interface NavigationProps {
  currentView: 'dashboard' | 'quiz' | 'claim';
  setCurrentView: (view: 'dashboard' | 'quiz' | 'claim') => void;
  currentPoints: number;
  completedQuizzes: number;
  totalQuizzes: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  setCurrentView,
  currentPoints,
  completedQuizzes,
  totalQuizzes,
}) => {
  const navItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: Home,
      badge: null,
    },
    {
      id: 'quiz' as const,
      label: 'Learn & Quiz',
      icon: BookOpen,
      badge: `${completedQuizzes}/${totalQuizzes}`,
    },
    {
      id: 'claim' as const,
      label: 'Claim Tokens',
      icon: Coins,
      badge: currentPoints > 0 ? currentPoints.toString() : null,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-1 inline-flex space-x-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        
        return (
          <Button
            key={item.id}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrentView(item.id)}
            className={`relative ${
              isActive 
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                : "hover:bg-gray-50"
            }`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {item.label}
            {item.badge && (
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                isActive 
                  ? "bg-white/20 text-white" 
                  : "bg-blue-100 text-blue-700"
              }`}>
                {item.badge}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
};
