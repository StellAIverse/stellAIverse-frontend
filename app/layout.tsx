import type { Metadata } from 'next';
import './globals.css';
import { StellarWalletProvider } from '@/components/context/StellarWalletProvider';
import { ThemeModeProvider } from '@/components/providers/ThemeModeProvider';
import QueryProvider from '@/components/providers/QueryProvider';
import Navigation from '@/components/Navigation';
import PWAInstall from '@/components/PWAInstall';

export const metadata: Metadata = {
  title: 'stellAIverse - AI Agent Marketplace',
  description: 'Create, discover, and interact with AI agents in a cosmic universe',
  keywords: ['AI agents', 'marketplace', 'automation', 'AI', 'Stellar'],
  openGraph: {
    title: 'stellAIverse',
    description: 'Beautiful AI agent marketplace with cosmic UI',
    type: 'website',
  },
  manifest: '/manifest.json',
  themeColor: '#1a1a2e',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'stellAIverse',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
    ],
  },
};

function RootLayout({ children }: { children: React.ReactNode }) {
  const themeBootstrapScript = `
    (() => {
      try {
        const storageKey = 'stellaiverse-theme-mode';
        const savedTheme = localStorage.getItem(storageKey);
        const theme =
          savedTheme === 'light' || savedTheme === 'dark'
            ? savedTheme
            : window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light';
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = theme;
      } catch (error) {
        document.documentElement.dataset.theme = 'dark';
        document.documentElement.style.colorScheme = 'dark';
      }
    })();
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[rgb(var(--page-background))] text-[rgb(var(--page-text))] overflow-x-hidden">
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
        <ThemeModeProvider>
          <QueryProvider>
            <StellarWalletProvider>
              <div
                className="min-h-screen"
                style={{
                  background:
                    'linear-gradient(135deg, rgb(var(--page-background)) 0%, rgb(var(--page-background-alt)) 52%, rgb(var(--page-background)) 100%)',
                }}
              >
                {/* Animated background stars */}
                <div className="fixed inset-0 pointer-events-none">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 rounded-full animate-twinkle"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        backgroundColor: 'rgb(var(--color-cosmic-purple) / 0.45)',
                      }}
                    />
                  ))}
                </div>

                <div className="relative z-10">
                  <Navigation />
                  {children}
                </div>
              </div>
            </StellarWalletProvider>
          </QueryProvider>
        </ThemeModeProvider>
      </body>
    </html>
  );
}

export default RootLayout;

