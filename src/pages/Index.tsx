import React, { useState, useEffect } from 'react';
import { WalletConnection } from '@/components/WalletConnection';
import { SimpleDashboard } from '@/components/SimpleDashboard';
import { AIChatbot } from '@/components/AIChatbot';
import { Navigation } from '@/components/Navigation';
import { PortfolioBuilder } from '@/components/PortfolioBuilder';
import { RiskAssessment } from '@/components/RiskAssessment';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { infoWallet } from '@/hooks/useWallet';
import nimpadLogo from '/nimpad_logo.jpg';

const Index = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'portfolio' | 'chatbot'>('dashboard');
  
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
      {/* Simplified Header */}
      <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <img
                src={nimpadLogo}
                alt="Nimpad"
                className="w-8 h-8 rounded-lg"
              />
              <h1 className="text-lg font-semibold text-foreground">Core DAO Builder</h1>
            </div>
            
            {/* Simple Navigation */}
            {isConnected && (
              <Navigation 
                currentView={currentView} 
                setCurrentView={setCurrentView}
              />
            )}
            
            {/* Wallet Connection */}
            <WalletConnection 
              isConnected={isConnected}
              account={account}
              onConnect={connectWallet}
              onDisconnect={disconnectWallet}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!isConnected ? (
          // Welcome Screen - First Time User Experience
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">Welcome to Core DAO Builder</h2>
              <p className="text-muted-foreground text-lg">
                Your all-in-one platform to learn, build, and earn in the Core DAO ecosystem
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 my-12">
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="font-semibold mb-2">Learn</h3>
                <p className="text-sm text-muted-foreground">Master Core DAO development with guided tutorials</p>
              </Card>
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="font-semibold mb-2">Build</h3>
                <p className="text-sm text-muted-foreground">Create dApps with AI assistance and tools</p>
              </Card>
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">💎</div>
                <h3 className="font-semibold mb-2">Earn</h3>
                <p className="text-sm text-muted-foreground">Optimize yields with portfolio analysis</p>
              </Card>
            </div>
            
            <div className="space-y-4">
              <Button size="lg" onClick={connectWallet} className="w-full max-w-md">
                Connect Wallet to Get Started
              </Button>
              <p className="text-sm text-muted-foreground">
                Connect your wallet to access all features
              </p>
            </div>
          </div>
        ) : (
          // Connected User Experience
          <>
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
          </>
        )}      
      </main>

      {/* Minimal Footer */}
      {isConnected && (
        <footer className="border-t bg-card/30 mt-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
              <p>Built for Core DAO Ecosystem</p>
              <div className="flex space-x-4 mt-2 md:mt-0">
                <a href="https://docs.coredao.org" className="hover:text-primary">Docs</a>
                <a href="https://discord.com/invite/coredaoofficial" className="hover:text-primary">Discord</a>
                <a href="https://github.com/coredao-org" className="hover:text-primary">GitHub</a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Index;