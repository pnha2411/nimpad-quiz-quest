import React, { useState, useEffect } from 'react';
import { WalletConnection } from '@/components/WalletConnection';
import { Dashboard } from '@/components/Dashboard';
import { AIChatbot } from '@/components/AIChatbot';
import { Navigation } from '@/components/Navigation';
import { PortfolioBuilder } from '@/components/PortfolioBuilder';
import { RiskAssessment } from '@/components/RiskAssessment';
import { infoWallet } from '@/hooks/useWallet';

const Index = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'portfolio' | 'risk-assessment' | 'chatbot' | 'market-analysis' | 'protocols' | 'asset-wizard'>('dashboard');
  
  // Always call hooks in the same order
  const { isConnected, account, connectWallet, disconnectWallet, isOnCitreaNetwork } = infoWallet();

  // Redirect to dashboard when wallet is successfully connected
  useEffect(() => {
    if (isConnected && account) {
      setCurrentView('dashboard');
    }
  }, [isConnected, account]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center animate-float">
                <span className="text-primary-foreground font-bold text-sm">N</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Nimpad
              </h1>
              <span className="text-sm text-muted-foreground hidden sm:inline">BTCfi Investment Tracker</span>
            </div>
            <div className="flex items-center space-x-4">
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

      {/* Navigation */}
      <div className="container mx-auto px-4 py-4">
        <Navigation 
          currentView={currentView} 
          setCurrentView={setCurrentView}
        />
      </div>

      {/* Main Content */}
      <main>
        {currentView === 'dashboard' && (
          <Dashboard 
            points={0}
            completedQuizzes={0}
            totalQuizzes={10}
            onStartQuiz={() => setCurrentView('portfolio')}
            onClaimTokens={() => setCurrentView('portfolio')}
          />
        )}

        {currentView === 'market-analysis' && (
          <div className="container mx-auto px-4 pb-8">
            <div className="bg-card rounded-xl p-6 border">
              <h2 className="text-2xl font-bold mb-4">Market Analysis Suite</h2>
              <p className="text-muted-foreground">Comprehensive BTCfi market analysis coming soon...</p>
            </div>
          </div>
        )}

        {currentView === 'protocols' && (
          <div className="container mx-auto px-4 pb-8">
            <div className="bg-card rounded-xl p-6 border">
              <h2 className="text-2xl font-bold mb-4">Protocol Analytics</h2>
              <p className="text-muted-foreground">Deep dive protocol analysis coming soon...</p>
            </div>
          </div>
        )}

        {currentView === 'asset-wizard' && (
          <div className="container mx-auto px-4 pb-8">
            <div className="bg-card rounded-xl p-6 border">
              <h2 className="text-2xl font-bold mb-4">Asset Acquisition Wizard</h2>
              <p className="text-muted-foreground">Step-by-step asset acquisition guide coming soon...</p>
            </div>
          </div>
        )}

        {currentView === 'chatbot' && (
          <div className="container mx-auto px-4 pb-8">
            <AIChatbot 
              onBack={() => setCurrentView('dashboard')}
            />
          </div>
        )}

        {currentView === 'portfolio' && (
          <div className="container mx-auto px-4 pb-8">
            <PortfolioBuilder 
              onBack={() => setCurrentView('dashboard')}
            />
          </div>
        )}

        {currentView === 'risk-assessment' && (
          <div className="container mx-auto px-4 pb-8">
            <RiskAssessment 
              onBack={() => setCurrentView('dashboard')}
              onComplete={() => setCurrentView('dashboard')}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xs">N</span>
                </div>
                <span className="font-bold text-lg">Nimpad</span>
              </div>
              <p className="text-muted-foreground text-sm">
                The ultimate BTCfi investment tracker for smart Bitcoin DeFi investors.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Track</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Portfolio</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Yield Opportunities</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Risk Assessment</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Optimize</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">AI Recommendations</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Auto Rebalancing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Performance Analytics</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="https://docs.citrea.xyz/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Citrea Docs</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <span>Built for Bitcoin Layer 2 Ecosystem</span>
            </div>
            <div className="text-center md:text-right">
              <p>Track • Optimize • Grow • Scale</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;