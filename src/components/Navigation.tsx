import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, PieChart, Bot } from 'lucide-react';

interface NavigationProps {
  currentView: 'dashboard' | 'portfolio' | 'chatbot';
  setCurrentView: (view: 'dashboard' | 'portfolio' | 'chatbot') => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  setCurrentView,
}) => {
  const navItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: Home,
      badge: null,
    },    
    {
      id: 'portfolio' as const,
      label: 'Portfolio',
      icon: PieChart,
      badge: null,
    },
    {
      id: 'chatbot' as const,
      label: 'AI Assistant',
      icon: Bot,
      badge: null,
    },
    // Add more nav items here as needed
  ];

  return (
    <nav className="flex gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <Button
            key={item.id}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrentView(item.id)}
            className="flex items-center gap-2"
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{item.label}</span>
          </Button>
        );
      })}
    </nav>
  );
};
