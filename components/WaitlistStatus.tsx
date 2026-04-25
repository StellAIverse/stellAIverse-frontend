'use client';

import React, { useEffect, useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import Link from 'next/link';
import { useStellarWallet } from './context/StellarWalletProvider';

export const WaitlistStatus: React.FC = () => {
  const { wallet } = useStellarWallet();
  const [status, setStatus] = useState<{
    joined: boolean;
    position?: number;
    joinedAt?: string;
    count?: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);
      try {
        const url = wallet?.publicKey 
          ? `/api/waitlist?walletAddress=${wallet.publicKey}`
          : '/api/waitlist';
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setStatus(data);
        }
      } catch (err) {
        console.error('Failed to fetch waitlist status:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [wallet?.publicKey]);

  if (loading) {
    return (
      <Card className="animate-pulse bg-cosmic-dark/40 border-cosmic-purple/20">
        <div className="h-20 bg-cosmic-purple/10 rounded-lg"></div>
      </Card>
    );
  }

  if (status?.joined) {
    return (
      <Card className="border-cosmic-nebula/40 bg-gradient-to-br from-cosmic-purple/20 to-cosmic-blue/10 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold glow-text mb-1">Premium Waitlist Status</h3>
            <p className="text-cosmic-cyan text-sm">
              You&apos;re in! Joined on {new Date(status.joinedAt!).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-cosmic-nebula">#{status.position}</div>
            <div className="text-xs text-cosmic-purple/60 uppercase tracking-widest">Position</div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-cosmic-purple/20 bg-cosmic-dark/40">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Join the Premium Waitlist</h3>
          <p className="text-gray-400 text-sm">
            Get early access to exclusive features and rewards. {status?.count || 0} users already waiting.
          </p>
        </div>
        <Link href="/waitlist">
          <Button size="sm" variant="primary">
            Join Now
          </Button>
        </Link>
      </div>
    </Card>
  );
};
