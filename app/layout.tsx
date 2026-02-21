import type { Metadata } from 'next';
import './globals.css';
import { StellarWalletProvider } from '@/components/context/StellarWalletProvider';
import { appWithTranslation } from 'next-i18next';

export const metadata: Metadata = {
  title: 'stellAIverse - AI Agent Marketplace',
  description: 'Create, discover, and interact with AI agents in a cosmic universe',
  keywords: ['AI agents', 'marketplace', 'automation', 'AI', 'Stellar'],
  openGraph: {
    title: 'stellAIverse',
    description: 'Beautiful AI agent marketplace with cosmic UI',
    type: 'website',
  },
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-cosmic-dark text-white overflow-x-hidden">
        <StellarWalletProvider>
          <div className="min-h-screen bg-gradient-to-br from-cosmic-dark via-cosmic-darker to-cosmic-dark">
            {/* Animated background stars */}
            <div className="fixed inset-0 pointer-events-none">
              {Array.from({ length: 100 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                  }}
                />
              ))}
            </div>

            {/* Main content */}
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </StellarWalletProvider>
      </body>
    </html>
  );
}

export default appWithTranslation(RootLayout);

