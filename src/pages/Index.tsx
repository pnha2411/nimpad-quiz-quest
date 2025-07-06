
import React, { useState, useEffect } from 'react';
import { WalletConnection } from '@/components/WalletConnection';
import { Dashboard } from '@/components/Dashboard';
import { AIChatbot } from '@/components/AIChatbot';
import { Navigation } from '@/components/Navigation';
import { PortfolioBuilder } from '@/components/PortfolioBuilder';
import { RiskAssessment } from '@/components/RiskAssessment';
import { infoWallet } from '@/hooks/useWallet';

const Index = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'portfolio' | 'risk-assessment' | 'chatbot'>('dashboard');
  
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
              {isConnected && (
                <WalletConnection 
                  isConnected={isConnected}
                  account={account}
                  onConnect={connectWallet}
                  onDisconnect={disconnectWallet}
                />
              )}
              {!isConnected && (
                <WalletConnection 
                  isConnected={isConnected}
                  account={account}
                  onConnect={connectWallet}
                  onDisconnect={disconnectWallet}
                />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {!isConnected ? (
          <>
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 lg:py-32">
              <div className="absolute inset-0 hero-gradient opacity-20"></div>
              <div className="container mx-auto px-4 text-center relative z-10">
                <div className="animate-fade-up">
                  <h1 className="text-5xl lg:text-7xl font-bold mb-6 glow-text">
                    Build Your
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> BTCfi Portfolio</span>
                  </h1>
                  <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                    Track, Optimize & Grow Your Bitcoin DeFi Investments • Daily Yield Insights • Smart Risk Management
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <button 
                      onClick={connectWallet}
                      className="bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold animate-glow hover:scale-105 transition-transform"
                    >
                      Get Started
                    </button>
                    <button 
                      onClick={connectWallet}
                      className="border border-primary text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/10 transition-colors"
                    >
                      Open App
                    </button>
                  </div>
                  
                  {/* Progress indicator */}
                  <div className="inline-flex items-center bg-card/50 backdrop-blur px-6 py-3 rounded-full border border-border">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">Portfolio Tracking • Yield Optimization • Risk Management</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Feature Highlights */}
            <section className="py-20 bg-card/20">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16 animate-fade-up">
                  Why Choose <span className="text-primary">Nimpad</span>?
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    {
                      icon: "📈",
                      title: "Portfolio Tracking",
                      description: "Real-time monitoring of your BTCfi investments across multiple chains and protocols"
                    },
                    {
                      icon: "🔄",
                      title: "Yield Optimization",
                      description: "AI-powered recommendations to maximize your Bitcoin DeFi yields and returns"
                    },
                    {
                      icon: "🛡️",
                      title: "Risk Management",
                      description: "Advanced risk assessment and smart contract audit tracking for safe investing"
                    },
                    {
                      icon: "🌐",
                      title: "Multi-Chain Support",
                      description: "Track assets across Core, Rootstock, Stacks, Bitlayer, and other Bitcoin L2s"
                    }
                  ].map((feature, index) => (
                    <div 
                      key={index}
                      className="feature-card bg-card border border-border rounded-xl p-6 text-center animate-fade-up"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <div className="text-4xl mb-4">{feature.icon}</div>
                      <h3 className="text-xl font-semibold mb-3 text-primary">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* How It Works */}
            <section className="py-20">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16 animate-fade-up">
                  How It <span className="text-secondary">Works</span>
                </h2>
                <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
                  {[
                    {
                      step: "01",
                      title: "Connect Wallet",
                      description: "Link your MetaMask wallet to start tracking your BTCfi portfolio",
                      icon: "🔗"
                    },
                    {
                      step: "02", 
                      title: "Analyze Portfolio",
                      description: "Get AI-powered insights on yield opportunities and risk assessment",
                      icon: "📊"
                    },
                    {
                      step: "03",
                      title: "Optimize Returns",
                      description: "Execute smart rebalancing and maximize your Bitcoin DeFi yields",
                      icon: "🚀"
                    }
                  ].map((step, index) => (
                    <div key={index} className="text-center animate-fade-up" style={{ animationDelay: `${index * 0.3}s` }}>
                      <div className="relative mb-6">
                        <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto text-2xl animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
                          {step.icon}
                        </div>
                        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-sm font-bold px-2 py-1 rounded-full">
                          {step.step}
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Credibility Section */}
            <section className="py-20 bg-card/20">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-2xl font-semibold mb-8 animate-fade-up">Trusted by BTCfi Investors</h2>
                <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
                  {['Core Blockchain', 'Rootstock RSK', 'Stacks', 'Bitlayer', 'BOB Network', 'BSquared'].map((tech, index) => (
                    <div 
                      key={index}
                      className="bg-card border border-border px-6 py-3 rounded-lg text-muted-foreground font-medium animate-fade-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {tech}
                    </div>
                  ))}
                </div>
                <div className="grid md:grid-cols-3 gap-8 max-w-2xl mx-auto">
                  <div className="animate-fade-up">
                    <div className="text-3xl font-bold text-primary">$10M+</div>
                    <div className="text-muted-foreground">Portfolio Value Tracked</div>
                  </div>
                  <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
                    <div className="text-3xl font-bold text-secondary">15%</div>
                    <div className="text-muted-foreground">Average APY Optimized</div>
                  </div>
                  <div className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
                    <div className="text-3xl font-bold text-primary">1,000+</div>
                    <div className="text-muted-foreground">Active Investors</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Final CTA */}
            <section className="py-20">
              <div className="container mx-auto px-4 text-center">
                <div className="max-w-2xl mx-auto animate-fade-up">
                  <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                    Ready to Optimize Your <span className="text-primary">BTCfi Portfolio</span>?
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    Join smart investors maximizing Bitcoin DeFi yields with data-driven insights.
                  </p>
                  <button 
                    onClick={connectWallet}
                    className="bg-primary text-primary-foreground px-12 py-4 rounded-lg text-xl font-semibold animate-glow hover:scale-105 transition-transform"
                  >
                    Connect Wallet & Start Tracking
                  </button>
                </div>
              </div>
            </section>
          </>
        ) : (
          <>
            <Navigation 
              currentView={currentView} 
              setCurrentView={setCurrentView}
            />
            
            <div className="mt-8">
              {currentView === 'dashboard' && (
                <Dashboard 
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

              {currentView === 'risk-assessment' && (
                <RiskAssessment 
                  onBack={() => setCurrentView('dashboard')}
                  onComplete={() => setCurrentView('dashboard')}
                />
              )}
            </div>
          </>
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
