
import React, { useState, useEffect } from 'react';
import { WalletConnection } from '@/components/WalletConnection';
import { QuizEngine } from '@/components/QuizEngine';
import { Dashboard } from '@/components/Dashboard';
import { TokenClaiming } from '@/components/TokenClaiming';
import { AIChatbot } from '@/components/AIChatbot';
import { NFTBadges } from '@/components/NFTBadges';
import { Navigation } from '@/components/Navigation';
import { infoWallet } from '@/hooks/useWallet';
import { useQuiz } from '@/hooks/useQuiz';

const Index = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'quiz' | 'claim' | 'chatbot' | 'badges'>('dashboard');
  
  // Always call hooks in the same order
  const { isConnected, account, connectWallet, disconnectWallet, isOnCitreaNetwork } = infoWallet();
  const { currentPoints, totalQuizzes, completedQuizzes } = useQuiz();

  // Redirect to dashboard when wallet is successfully connected
  useEffect(() => {
    if (isConnected && account) {
      setCurrentView('dashboard');
    }
  }, [isConnected, account]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Nimpad
              </h1>
              <span className="text-sm text-gray-500 hidden sm:inline">Learn to Earn on Citrea</span>
            </div>
            <div className="flex items-center space-x-4">
              {isConnected && !isOnCitreaNetwork() && (
                <div className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full">
                  Wrong Network
                </div>
              )}
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
      <main className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Nimpad</h2>
              <p className="text-gray-600 mb-8">
                Learn about Citrea's Bitcoin Layer 2 technology and earn tokens for your knowledge. 
                Connect your MetaMask wallet to get started.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  📚 Complete quizzes based on Citrea documentation<br/>
                  🤖 Ask our AI assistant about DeFi and BtcFi<br/>
                  🎯 Earn points for correct answers<br/>
                  🏆 Mint NFT badges to showcase your achievements<br/>
                  💰 Claim tokens through on-chain transactions
                </p>
              </div>             
            </div>
          </div>
        ) : (
          <>
            <Navigation 
              currentView={currentView} 
              setCurrentView={setCurrentView}
              currentPoints={currentPoints}
              completedQuizzes={completedQuizzes.length}
              totalQuizzes={totalQuizzes}
            />
            
            <div className="mt-8">
              {currentView === 'dashboard' && (
                <Dashboard 
                  points={currentPoints}
                  completedQuizzes={completedQuizzes.length}
                  totalQuizzes={totalQuizzes}
                  onStartQuiz={() => setCurrentView('quiz')}
                  onClaimTokens={() => setCurrentView('claim')}
                />
              )}
              
              {currentView === 'quiz' && (
                <QuizEngine 
                  onComplete={() => setCurrentView('dashboard')}
                  onBack={() => setCurrentView('dashboard')}
                />
              )}
              
              {currentView === 'claim' && (
                <TokenClaiming 
                  availablePoints={30}
                  onBack={() => setCurrentView('dashboard')}
                />
              )}

              {currentView === 'chatbot' && (
                <AIChatbot 
                  onBack={() => setCurrentView('dashboard')}
                />
              )}

              {currentView === 'badges' && (
                <NFTBadges 
                  availablePoints={currentPoints}
                  completedQuizzes={completedQuizzes.length}
                  onBack={() => setCurrentView('dashboard')}
                />
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <span>Built on Citrea</span>
              <a 
                href="https://docs.citrea.xyz/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Documentation
              </a>
            </div>
            <div className="text-center md:text-right">
              <p>Learn • Ask • Earn • Collect</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
