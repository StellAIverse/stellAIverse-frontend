/* Navigation Component */

'use client';

import Link from 'next/link';
import { useState } from 'react';

export const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/create', label: 'Create Agent' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/learn', label: 'Learn' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-cosmic-dark/80 border-b border-cosmic-purple/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-smooth">
            <span className="text-2xl">✨</span>
            <span className="glow-text font-bold text-xl">stellAIverse</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-cosmic-purple transition-smooth"
              >
                {link.label}
              </Link>
            ))}
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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 hover:text-cosmic-purple transition-smooth"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
