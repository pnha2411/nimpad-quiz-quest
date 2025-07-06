
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, BookOpen, Coins, Bot, Award, PieChart, TrendingUp, BarChart3, Building2, ShoppingCart } from 'lucide-react';

interface NavigationProps {
  currentView: 'dashboard' | 'portfolio' | 'risk-assessment' | 'chatbot' | 'market-analysis' | 'protocols' | 'asset-wizard';
  setCurrentView: (view: 'dashboard' | 'portfolio' | 'risk-assessment' | 'chatbot' | 'market-analysis' | 'protocols' | 'asset-wizard') => void;
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
      id: 'market-analysis' as const,
      label: 'Market Analysis',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'protocols' as const,
      label: 'Protocols',
      icon: Building2,
      badge: null,
    },
    {
      id: 'asset-wizard' as const,
      label: 'Asset Wizard',
      icon: ShoppingCart,
      badge: null,
    },
    {
      id: 'portfolio' as const,
      label: 'Portfolio',
      icon: PieChart,
      badge: null,
    },
    {
      id: 'risk-assessment' as const,
      label: 'Risk Profile',
      icon: TrendingUp,
      badge: null,
    },
    {
      id: 'chatbot' as const,
      label: 'AI Assistant',
      icon: Bot,
      badge: null,
    },
  ];

  return (
    <div className="bg-card rounded-xl shadow-sm border p-1 flex flex-wrap gap-1 overflow-x-auto">
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
        );
      })}
    </div>
  );
};
