import React, { useState } from 'react';
import { WalletConnection } from '@/components/WalletConnection';
import { SimpleDashboard } from '@/components/SimpleDashboard';
import { AIChatbot } from '@/components/AIChatbot';
import { Navigation } from '@/components/Navigation';
import { PortfolioBuilder } from '@/components/PortfolioBuilder';
import { infoWallet } from '@/hooks/useWallet';
import nimpadLogo from '/nimpad_logo.jpg';

const Index = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'portfolio' | 'chatbot'>('dashboard');
  const { isConnected, account, connectWallet, disconnectWallet, isOnCitreaNetwork } = infoWallet();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img
                src={nimpadLogo}
                alt="Nimpad"
                className="w-8 h-8 rounded-lg"
              />
              <span className="font-semibold text-foreground">Nimpad</span>
            </div>
            {/* Navigation & Wallet in one row */}
            <div className="flex items-center space-x-4">
              <Navigation 
                currentView={currentView} 
                setCurrentView={setCurrentView}
              />
              <WalletConnection 
                isConnected={isConnected}
                account={account}
                onConnect={connectWallet}
                onDisconnect={disconnectWallet}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Always show dashboard by default, even if wallet is not connected */}
        {currentView === 'dashboard' && (
          <SimpleDashboard 
            points={0}
            completedQuizzes={0}
            totalQuizzes={10}
            onStartQuiz={() => setCurrentView('portfolio')}
            onClaimTokens={() => setCurrentView('portfolio')}
          />
        )}
        
        {currentView === 'chatbot' && (
          <AIChatbot 
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'portfolio' && (
          <PortfolioBuilder 
            onBack={() => setCurrentView('dashboard')}
          />
        )}      
      </main>

      {/* Minimal Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-2 mb-2 md:mb-0">
              <img src={nimpadLogo} alt="Nimpad" className="w-5 h-5 rounded" />
              <span>Nimpad - BTCfi Investment Tracker</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="https://t.me/btcfi_builders" className="hover:text-foreground transition-colors">Telegram</a>
              <a href="https://x.com/nxNim9" className="hover:text-foreground transition-colors">Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;