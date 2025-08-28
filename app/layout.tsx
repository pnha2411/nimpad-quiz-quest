import type { Metadata } from 'next';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'viem/chains';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { WalletProvider } from '@/hooks/WalletContext';
import './globals.css';

const queryClient = new QueryClient();

export const metadata: Metadata = {
  title: 'Nimpad - BTCfi Investment Tracker',
  description: 'A comprehensive BTCfi investment tracker with habit building features',
  manifest: '/manifest.json',
};

function OnchainProviders({ children }: { children: React.ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_CDP_PROJECT_ID}
      chain={base}
    >
      {children}
    </OnchainKitProvider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <OnchainProviders>
            <WalletProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                {children}
              </TooltipProvider>
            </WalletProvider>
          </OnchainProviders>
        </QueryClientProvider>
      </body>
    </html>
  );
}