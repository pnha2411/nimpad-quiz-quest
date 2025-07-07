import React, { useState, useEffect } from 'react';
import { WalletConnection } from '@/components/WalletConnection';
import { Dashboard } from '@/components/Dashboard';
import { AIChatbot } from '@/components/AIChatbot';
import { Navigation } from '@/components/Navigation';
import { PortfolioBuilder } from '@/components/PortfolioBuilder';
import { RiskAssessment } from '@/components/RiskAssessment';
import { infoWallet } from '@/hooks/useWallet';
import nimpadLogo from '/nimpad_logo.jpg';

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
    <div className="min-h-screen bg-gradient-to-br from-[#e3eafc] via-[#f7f6fa] to-[#e3eafc]">
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={nimpadLogo}
                alt="Nimpad Logo"
                className="w-10 h-10 rounded-xl shadow-lg border-4 border-white bg-white animate-float"
                style={{ objectFit: 'cover' }}
              />             
              <span className="text-sm text-[#4b4b6b] hidden sm:inline font-medium">BTCfi Investment Tracker</span>
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
      <footer className="border-t border-border bg-white/70 backdrop-blur-md">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src={nimpadLogo}
                  alt="Nimpad Logo"
                  className="w-7 h-7 rounded-lg shadow border-2 border-white bg-white"
                  style={{ objectFit: 'cover' }}
                />
                <span className="font-bold text-lg text-[#2e2e5e]">Nimpad</span>
              </div>
              <p className="text-[#4b4b6b] text-sm">
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
                <li><a href="https://t.me/btcfi_builders" className="hover:text-primary transition-colors">Telegram</a></li>
                <li><a href="https://x.com/nxNim9" className="hover:text-primary transition-colors">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-[#4b4b6b]">
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