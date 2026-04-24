'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function PremiumWaitlist() {
  const { t } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setEmail('');
      }
    } catch (error) {
      console.error('Error submitting to waitlist:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      title: t('waitlist.benefits.earlyAccess.title'),
      description: t('waitlist.benefits.earlyAccess.description'),
      icon: '🚀',
    },
    {
      title: t('waitlist.benefits.exclusiveDiscounts.title'),
      description: t('waitlist.benefits.exclusiveDiscounts.description'),
      icon: '💎',
    },
    {
      title: t('waitlist.benefits.prioritySupport.title'),
      description: t('waitlist.benefits.prioritySupport.description'),
      icon: '⭐',
    },
    {
      title: t('waitlist.benefits.betaFeatures.title'),
      description: t('waitlist.benefits.betaFeatures.description'),
      icon: '🔮',
    },
    {
      title: t('waitlist.benefits.communityAccess.title'),
      description: t('waitlist.benefits.communityAccess.description'),
      icon: '🌟',
    },
    {
      title: t('waitlist.benefits.enhancedAnalytics.title'),
      description: t('waitlist.benefits.enhancedAnalytics.description'),
      icon: '📊',
    },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 nebula-bg">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">✨</div>
            <h1 className="text-4xl font-bold mb-4 glow-text">You&apos;re on the list!</h1>
            <p className="text-xl text-cosmic-cyan mb-8">
              Thank you for joining the premium waitlist. We&apos;ll be in touch soon with exclusive updates.
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-cosmic-purple">
              {t('waitlist.success.checkEmail')}
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)}
              className="mx-auto"
            >
              {t('waitlist.success.addAnother')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen nebula-bg">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-cosmic-purple/20 rounded-full border border-cosmic-purple/30 mb-6">
              <span className="text-cosmic-nebula text-sm font-semibold">{t('waitlist.limitedSpots')}</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 glow-text">
            {t('waitlist.title')}
            <span className="block text-cosmic-nebula">{t('waitlist.subtitle')}</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-cosmic-cyan mb-8 max-w-3xl mx-auto">
            {t('waitlist.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <div className="flex items-center gap-2 text-cosmic-purple">
              <span className="text-2xl">👥</span>
              <span className="font-semibold">{t('waitlist.peopleWaiting')}</span>
            </div>
            <div className="flex items-center gap-2 text-cosmic-purple">
              <span className="text-2xl">⏱️</span>
              <span className="font-semibold">{t('waitlist.earlyAccess')}</span>
            </div>
          </div>
        </div>

        {/* Email Signup Form */}
        <div className="max-w-md mx-auto mb-16">
          <Card className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-cosmic-nebula">{t('waitlist.reserveSpot')}</h2>
            <p className="text-cosmic-cyan mb-6">
              {t('waitlist.reserveDescription')}
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('waitlist.emailPlaceholder')}
                required
                className="w-full px-4 py-3 bg-cosmic-dark/50 border border-cosmic-purple/30 rounded-lg text-white placeholder-cosmic-purple/50 focus:outline-none focus:border-cosmic-purple focus:ring-2 focus:ring-cosmic-purple/20 transition-smooth"
              />
              
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? t('waitlist.joining') : t('waitlist.joinButton')}
              </Button>
            </form>
            
            <p className="text-xs text-cosmic-purple/60 mt-4">
              {t('waitlist.noSpam')}
            </p>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 glow-text">
            {t('waitlist.premiumBenefits')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center group hover:scale-105 transition-smooth">
                <div className="text-4xl mb-4 group-hover:animate-pulse-slow">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-cosmic-nebula">
                  {benefit.title}
                </h3>
                <p className="text-cosmic-cyan">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-block p-8 bg-gradient-to-r from-cosmic-purple/20 to-cosmic-blue/20 rounded-2xl border border-cosmic-purple/30">
            <h2 className="text-2xl font-bold mb-4 text-cosmic-nebula">
              {t('waitlist.readyTitle')}
            </h2>
            <p className="text-cosmic-cyan mb-6">
              {t('waitlist.readyDescription')}
            </p>
            <Button size="lg" onClick={() => document.getElementById('email-form')?.scrollIntoView({ behavior: 'smooth' })}>
              {t('waitlist.joinNowButton')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
