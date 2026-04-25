/* Navigation Component */

"use client";

import Link from "next/link";
import { useState } from "react";
import ConnectWallet from "./ConnectWallet";
import WalletAddress from "./WalletAddress";
import NetworkSwitcher from "./NetworkSwitcher";
import ThemeToggle from "./ThemeToggle";

import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "next-i18next";
export const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/marketplace", label: "Marketplace" },
    { href: "/create", label: "Create Agent" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/analytics", label: "Analytics" },
    { href: "/telemetry", label: "Telemetry" },
    { href: "/security", label: "Security" },
    { href: "/provenance", label: "Provenance" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/waitlist", label: "Waitlist" },
    { href: "/staking", label: "Staking" },
    { href: "/learn", label: "Learn" },
    { href: "/bug-report", label: "Report Bug" },
    { href: "/bug-reports", label: "Bug Reports" },
    { href: "submissions", label: "Submission Dashboard" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-cosmic-dark/80 border-b border-cosmic-purple/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-smooth"
          >
            <span className="text-2xl">*</span>
            <span className="glow-text font-bold text-xl">stellAIverse</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
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

          {/* Wallet Controls */}
          <div className="hidden md:flex gap-3 items-center">
            <ThemeToggle />
            <LanguageSwitcher />
            <NetworkSwitcher />
            <ConnectWallet />
            <WalletAddress />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            className="md:hidden p-2"
          >
            Menu
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <div className="flex items-center gap-3 pb-3 border-b border-cosmic-purple/20">
              <ThemeToggle />
              <NetworkSwitcher className="flex-1" />
            </div>
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
            <div className="pt-4 border-t border-cosmic-purple/20 space-y-2">
              <div className="flex gap-2">
                <LanguageSwitcher />
                <NetworkSwitcher className="flex-1" />
              </div>
              <ConnectWallet className="w-full" />
              <WalletAddress />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
