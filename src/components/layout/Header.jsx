import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header({ onScanClick, mirrorCount, waitingCount, matchedPairs, scansToday, scansOverall }) {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      id="site-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-tantrik-bg/90 backdrop-blur-md border-b border-tantrik-gold/10' : 'bg-tantrik-bg/80 backdrop-blur-sm'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2 min-h-[var(--site-header-height)]">
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
          <img src="/trishul.svg" alt="Trishul Logo" className="w-10 h-10 sm:w-12 sm:h-12 shrink-0" />
          <div className="min-w-0">
            <h1 className="font-display text-base sm:text-lg text-tantrik-gold leading-none tracking-wider truncate">
              SAPTAMUKHA
            </h1>
            <p className="hidden sm:block text-[10px] text-tantrik-stone tracking-widest uppercase">
              {t('nav.tagline')}
            </p>
          </div>
        </div>

        {/* Center: Live Counters (fake baseline + real) */}
        <div className="hidden lg:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-[#9d7fe3]">
            <span>🪞</span>
            <span className="font-mono">{(mirrorCount ?? 109810).toLocaleString()} {t('nav.souls')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#7f5af0]">
            <span className="animate-pulse">⏳</span>
            <span className="font-mono">{(waitingCount ?? 100321).toLocaleString()} {t('nav.waiting')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#00ff88]">
            <span>🤝</span>
            <span className="font-mono">{(matchedPairs ?? 436).toLocaleString()} matched twins</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#9d7fe3]">
            <span>📸</span>
            <span className="font-mono">{(scansToday ?? 500).toLocaleString()} {t('stats.scans_today')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#7f5af0]">
            <span>✨</span>
            <span className="font-mono">{(scansOverall ?? 109810).toLocaleString()} {t('stats.scans_overall')}</span>
          </div>
        </div>

        {/* Right: Language + CTA */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <LanguageSwitcher />
          <button
            onClick={onScanClick}
            className="golden-button golden-button--compact max-w-[7.5rem] sm:max-w-none truncate sm:overflow-visible sm:whitespace-normal"
            title={t('hero.cta')}
          >
            {t('hero.cta')}
          </button>
        </div>
      </div>
    </motion.header>
  );
}
