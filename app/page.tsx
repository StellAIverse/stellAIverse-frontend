'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-cosmic-dark/80 border-b border-cosmic-purple/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <span className="glow-text font-bold text-xl">stellAIverse</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-8">
              <Link href="/marketplace" className="hover:text-cosmic-purple transition-smooth">
                Marketplace
              </Link>
              <Link href="/create" className="hover:text-cosmic-purple transition-smooth">
                Create Agent
              </Link>
              <Link href="/portfolio" className="hover:text-cosmic-purple transition-smooth">
                Portfolio
              </Link>
              <Link href="/learn" className="hover:text-cosmic-purple transition-smooth">
                Learn
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              ☰
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <Link href="/marketplace" className="block py-2 hover:text-cosmic-purple">
                Marketplace
              </Link>
              <Link href="/create" className="block py-2 hover:text-cosmic-purple">
                Create Agent
              </Link>
              <Link href="/portfolio" className="block py-2 hover:text-cosmic-purple">
                Portfolio
              </Link>
              <Link href="/learn" className="block py-2 hover:text-cosmic-purple">
                Learn
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold glow-text animate-float">
            Welcome to stellAIverse
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover, create, and interact with AI agents in a beautiful cosmic universe.
            Build intelligent automation with an immersive experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link
              href="/marketplace"
              className="px-8 py-3 bg-gradient-to-r from-cosmic-purple to-cosmic-blue rounded-lg font-semibold hover:shadow-lg hover:shadow-cosmic-purple/50 transition-smooth glow-border"
            >
              Explore Marketplace
            </Link>
            <Link
              href="/create"
              className="px-8 py-3 border-2 border-cosmic-purple rounded-lg font-semibold hover:bg-cosmic-purple/10 transition-smooth"
            >
              Create Your Agent
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 glow-text">
            Key Features
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border border-cosmic-purple/30 hover:border-cosmic-purple/60 hover:shadow-lg hover:shadow-cosmic-purple/20 transition-smooth nebula-bg"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 glow-text">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 glow-text">Ready to Begin?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Join thousands of users creating and deploying intelligent AI agents.
          </p>
          <Link
            href="/create"
            className="inline-block px-8 py-4 bg-gradient-to-r from-cosmic-nebula to-cosmic-purple rounded-lg font-semibold hover:shadow-lg hover:shadow-cosmic-nebula/50 transition-smooth"
          >
            Start Creating Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cosmic-purple/20 py-8 px-4 text-center text-gray-400">
        <p>© 2025 stellAIverse. All rights reserved.</p>
      </footer>
    </main>
  );
}

const features = [
  {
    icon: '🧙',
    title: 'Agent Creation Wizard',
    description: 'Describe your agent\'s behavior and automatically generate basic contracts and metadata.',
  },
  {
    icon: '🌌',
    title: 'Galaxy Marketplace',
    description: 'Browse and discover agents visualized as stars and planets in an immersive interface.',
  },
  {
    icon: '💬',
    title: 'Agent Chat Interface',
    description: 'Interact with your AI agents in real-time through an intuitive chat interface.',
  },
  {
    icon: '📊',
    title: 'Agent Portfolio',
    description: 'Track your owned agents and view detailed performance statistics.',
  },
  {
    icon: '🎓',
    title: 'Educational Mode',
    description: 'Learn best practices and tutorials for building smarter agents.',
  },
  {
    icon: '✨',
    title: 'Cosmic UI Theme',
    description: 'Stunning dark space aesthetic with glowing effects and animated constellations.',
  },
];
