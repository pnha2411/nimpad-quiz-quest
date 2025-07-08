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
    <nav className="w-full overflow-x-auto">
      <ul className="flex flex-nowrap gap-1 py-1 px-1 bg-card rounded-xl shadow-sm border">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <li key={item.id} className="flex-shrink-0">
              <Button
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentView(item.id)}
                className={`relative flex items-center px-3 ${
                  isActive 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                    : "hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.label.split(' ')[0]}</span>
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
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
