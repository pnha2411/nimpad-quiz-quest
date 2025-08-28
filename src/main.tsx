import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { WalletProvider } from "@/hooks/WalletContext.tsx";
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'viem/chains';

// Wrap App with OnchainKit for Base integration
function AppWithProviders() {
  return (
    <OnchainKitProvider
      apiKey={import.meta.env.VITE_CDP_PROJECT_ID}
      chain={base}
    >
      <WalletProvider>
        <App />
      </WalletProvider>
    </OnchainKitProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppWithProviders />
  </React.StrictMode>
);