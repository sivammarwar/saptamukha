import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import Header from '../components/layout/Header';
import BackgroundEffects from '../components/layout/BackgroundEffects';
import CameraFeed from '../components/camera/CameraFeed';
import CelebrityMatches from '../components/celebrity/CelebrityMatches';
import PreScanIntakeForm from '../components/intake/PreScanIntakeForm';
import NoMatchResult from '../components/results/NoMatchResult';
import RealMatchResult from '../components/results/RealMatchResult';
import DuplicateResult from '../components/results/DuplicateResult';
import MukhaDarshanSection from '../components/harmony/MukhaDarshanSection';
import TopScorersSection from '../components/harmony/TopScorersSection';
import { runDedup } from '../lib/dedupService';
import { goldMarkupToHtml } from '../lib/i18nHelpers';
import { usePlatformStats } from '../hooks/usePlatformStats';
import { recordSoulScan } from '../lib/statsService';

export default function Home() {
  const { t } = useLanguage();
  const [showWarning, setShowWarning] = useState(false);
  const [showIntake, setShowIntake] = useState(false);
  const [intakeData, setIntakeData] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [celebrityMatches, setCelebrityMatches] = useState(null);
  const [dedupResult, setDedupResult] = useState(null);
  const [isDeduping, setIsDeduping] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { stats, refresh: refreshStats } = usePlatformStats();
  const cameraRef = useRef(null);

  const showWarningModal = () => setShowWarning(true);

  const acceptWarning = () => {
    setShowWarning(false);
    setShowIntake(true);
  };

  const handleIntakeSubmit = (data) => {
    setIntakeData(data);
    setShowIntake(false);
    setShowCamera(true);
    setActiveSection('camera');
    setTimeout(() => {
      document.getElementById('camera')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Scroll to result section when it becomes active
  useEffect(() => {
    if (activeSection === 'result') {
      setTimeout(() => {
        document.getElementById('result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [activeSection]);

  const handleCaptureComplete = async ({ embedding, celebrityResults, quality, image }) => {
    setCelebrityMatches(celebrityResults);
    setActiveSection('celebrity');
    setIsDeduping(true);

    await recordSoulScan();
    refreshStats();

    try {
      const result = await runDedup({ embedding, intakeData, quality, image });
      setDedupResult(result);
      setActiveSection('result');
      refreshStats();
    } catch (err) {
      console.error('Dedup error:', err);
    } finally {
      setIsDeduping(false);
    }
  };

  const handleReset = () => {
    setShowCamera(false);
    setCelebrityMatches(null);
    setDedupResult(null);
    setIntakeData(null);
    setActiveSection('hero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-tantrik-bg text-tantrik-parchment overflow-x-hidden">
      <BackgroundEffects />
      <Header
        onScanClick={showWarningModal}
        mirrorCount={stats?.soulsInMirror}
        waitingCount={stats?.waitingForTwin}
        matchedPairs={stats?.matchedPairs}
        scansToday={stats?.soulScansToday}
        scansOverall={stats?.soulScansOverall}
      />

      <main className="relative z-10">
        {/* HERO */}
        <section id="hero" className="hero-section flex flex-col items-center justify-start md:justify-center px-4 sm:px-6 text-center scroll-anchor">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl w-full"
          >
            <img src="/trishul.svg" alt="Trishul Logo" className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6" />
            <h1 className="font-display text-3xl sm:text-4xl md:text-7xl font-bold text-gradient-gold mb-4 sm:mb-6 leading-tight">
              SAPTAMUKHA
            </h1>
            <p className="font-display text-lg sm:text-xl md:text-3xl text-tantrik-gold mb-3 sm:mb-4 px-1">
              {t('hero.headline')}
            </p>
            <p className="font-body text-base sm:text-lg md:text-xl text-tantrik-stone max-w-2xl mx-auto mb-6 leading-relaxed px-1">
              {t('hero.subheadline')}
            </p>

            {/* Live counters: fake baseline + real from DB */}
            <div className="mb-8 sm:mb-10 max-w-md sm:max-w-none mx-auto">
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center gap-3 sm:gap-x-6 sm:gap-y-3 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 text-sm text-[#9d7fe3] bg-[#1a0a2e]/40 sm:bg-transparent border border-[#3d2a6e]/50 sm:border-0 rounded-lg p-2.5 sm:p-0">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <span>🪞</span>
                    <span className="font-mono text-base sm:text-sm">{(stats?.soulsInMirror ?? 109810).toLocaleString()}</span>
                  </div>
                  <span className="text-[10px] sm:text-sm text-[#9d7fe3]/80 sm:text-[#9d7fe3]">{t('nav.souls')}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 text-sm text-[#7f5af0] bg-[#1a0a2e]/40 sm:bg-transparent border border-[#3d2a6e]/50 sm:border-0 rounded-lg p-2.5 sm:p-0">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <span className="animate-pulse">⏳</span>
                    <span className="font-mono text-base sm:text-sm">{(stats?.waitingForTwin ?? 108721).toLocaleString()}</span>
                  </div>
                  <span className="text-[10px] sm:text-sm text-[#7f5af0]/80 sm:text-[#7f5af0]">{t('nav.waiting')}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 text-sm text-[#9d7fe3] bg-[#1a0a2e]/40 sm:bg-transparent border border-[#3d2a6e]/50 sm:border-0 rounded-lg p-2.5 sm:p-0">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <span>📸</span>
                    <span className="font-mono text-base sm:text-sm">{(stats?.soulScansToday ?? 500).toLocaleString()}</span>
                  </div>
                  <span className="text-[10px] sm:text-sm text-[#9d7fe3]/80 sm:text-[#9d7fe3]">{t('stats.scans_today')}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 text-sm text-[#7f5af0] bg-[#1a0a2e]/40 sm:bg-transparent border border-[#3d2a6e]/50 sm:border-0 rounded-lg p-2.5 sm:p-0">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <span>✨</span>
                    <span className="font-mono text-base sm:text-sm">{(stats?.soulScansOverall ?? 109810).toLocaleString()}</span>
                  </div>
                  <span className="text-[10px] sm:text-sm text-[#7f5af0]/80 sm:text-[#7f5af0]">{t('stats.scans_overall')}</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-0.5 sm:gap-2 text-lg sm:text-xl text-[#00ff88] bg-[#1a0a2e]/40 sm:bg-transparent border border-[#3d2a6e]/50 sm:border-0 rounded-lg p-3 sm:p-0">
                <div className="flex items-center justify-center gap-2">
                  <span>🤝</span>
                  <span className="font-mono text-2xl sm:text-3xl">{(stats?.matchedPairs ?? 436).toLocaleString()}</span>
                </div>
                <span className="text-xs sm:text-sm text-[#00ff88]/80 sm:text-[#00ff88]">matched twins</span>
              </div>
            </div>

            <button
              onClick={showWarningModal}
              className="golden-button w-full sm:w-auto text-base sm:text-lg md:text-xl animate-pulse-glow max-w-sm sm:max-w-none mx-auto"
            >
              {t('hero.cta')}
            </button>
          </motion.div>

          {/* Why Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-10 sm:mt-16 max-w-5xl w-full px-0 sm:px-4"
          >
            {[
              { icon: '👁', titleKey: 'why.lookalike', descKey: 'why.lookalike.desc' },
              { icon: '⚡', titleKey: 'why.rarity', descKey: 'why.rarity.desc' },
              { icon: '🪷', titleKey: 'why.twins', descKey: 'why.twins.desc' },
            ].map((card, i) => (
              <div key={i} className="mystic-card p-6 text-left hover:border-tantrik-gold/50 transition-colors">
                <div className="text-3xl mb-3">{card.icon}</div>
                <h3 className="font-display text-lg text-tantrik-gold mb-2">{t(card.titleKey)}</h3>
                <p className="text-tantrik-stone text-sm leading-relaxed">{t(card.descKey)}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* CAMERA (Reveal my twin) */}
        <AnimatePresence>
          {showCamera && (
            <motion.section
              id="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 px-4 scroll-anchor"
            >
              <div className="max-w-2xl mx-auto">
                <h2 className="font-display text-3xl text-tantrik-gold text-center mb-2">
                  {t('camera.title')}
                </h2>
                <p className="text-tantrik-stone text-center mb-8">
                  {t('camera.subtitle')}
                </p>
                <CameraFeed
                  ref={cameraRef}
                  onCaptureComplete={handleCaptureComplete}
                />
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* CELEBRITY RESULTS */}
        <AnimatePresence>
          {celebrityMatches?.length > 0 && (activeSection === 'celebrity' || activeSection === 'result') && (
            <motion.section
              id="celebrity"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-16 px-4 scroll-anchor"
            >
              <CelebrityMatches matches={celebrityMatches} />
            </motion.section>
          )}
        </AnimatePresence>

        {/* DEDUP RESULT */}
        <AnimatePresence>
          {activeSection === 'result' && dedupResult && (
            <motion.section
              id="result"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-16 px-4 scroll-anchor"
            >
              {dedupResult.type === 'unique' && (
                <NoMatchResult soul={dedupResult.soul} onReset={handleReset} />
              )}
              {dedupResult.type === 'match' && (
                <RealMatchResult
                  soul={dedupResult.soul}
                  matchedSoul={dedupResult.matchedSoul}
                  matchedSouls={dedupResult.matchedSouls}
                  similarity={dedupResult.similarity}
                  onReset={handleReset}
                />
              )}
              {dedupResult.type === 'duplicate' && (
                <DuplicateResult
                  existingSoul={dedupResult.existingSoul}
                  onReset={handleReset}
                />
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* TOP HARMONY SCORERS */}
        <TopScorersSection />

        {/* MUKHA DARSHAN — Face Harmony Analysis */}
        <MukhaDarshanSection />
      </main>

      {/* ===== TRUST & EDUCATION BLOCKS ===== */}
      <div className="relative z-10">
        {/* HERO SUBLINE */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 border-t border-tantrik-gold/10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="text-tantrik-stone text-lg md:text-xl leading-relaxed">
              {t('facts.intro').replace('SAPTAMUKHA', '')}
              <span className="text-tantrik-gold font-display">SAPTAMUKHA</span>.
            </p>
            <p className="text-tantrik-stone/70 text-sm mt-6 leading-relaxed">
              {t('facts.science_note')}
            </p>
          </motion.div>
        </section>

        {/* THE NUMBERS */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 bg-tantrik-dark/30">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="font-display text-3xl md:text-4xl text-gradient-gold text-center mb-12">
              {t('facts.numbers.title')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { num: '~8 Billion', key: 'facts.numbers.8b' },
                { num: '43', key: 'facts.numbers.43' },
                { num: '~1 Billion', key: 'facts.numbers.1b' },
                { num: '4 to 8', key: 'facts.numbers.4to8' },
                { num: '0.1%', key: 'facts.numbers.01' },
                { num: '7', key: 'facts.numbers.7' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="mystic-card p-6 text-center"
                >
                  <div className="font-display text-2xl md:text-3xl text-tantrik-gold mb-2">{item.num}</div>
                  <p className="text-tantrik-stone text-sm leading-snug">{t(item.key)}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-tantrik-stone/60 text-sm mt-10 italic">
              {t('facts.numbers.footer')}
            </p>
          </motion.div>
        </section>

        {/* CELEBRITY TRUST PROOF */}
        <section className="py-12 sm:py-20 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="font-display text-3xl md:text-4xl text-gradient-gold text-center mb-4">
              {t('facts.celebs.title')}
            </h2>
            <p className="text-tantrik-stone text-center mb-12">
              {t('facts.celebs.sub')}
            </p>
            <div className="space-y-6">
              {[
                { pairKey: 'facts.celebs.pair.keira', key: 'facts.celebs.keira' },
                { pairKey: 'facts.celebs.pair.will', key: 'facts.celebs.will' },
                { pairKey: 'facts.celebs.pair.jeffrey', key: 'facts.celebs.jeffrey' },
                { pairKey: 'facts.celebs.pair.daniel', key: 'facts.celebs.daniel' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="mystic-card p-6 md:p-8"
                >
                  <h3 className="font-display text-lg text-tantrik-gold mb-2">{t(item.pairKey)}</h3>
                  <p className="text-tantrik-stone text-sm leading-relaxed">{t(item.key)}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-tantrik-stone/70 text-sm mt-10">
              {t('facts.celebs.footer')}
            </p>
          </motion.div>
        </section>

        {/* SOUL TWIN SCIENCE */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 bg-tantrik-dark/30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="font-display text-3xl md:text-4xl text-gradient-gold text-center mb-8">
              {t('facts.science.title')}
            </h2>
            <div className="space-y-6 text-tantrik-stone leading-relaxed">
              <p dangerouslySetInnerHTML={{ __html: goldMarkupToHtml(t('facts.science.p1'), 'text-tantrik-gold font-display') }} />
              <p dangerouslySetInnerHTML={{ __html: goldMarkupToHtml(t('facts.science.p2')) }} />
              <p>{t('facts.science.p3')}</p>
              <p>{t('facts.science.p4')}</p>
              <p className="text-tantrik-parchment text-lg font-display text-center py-4 border-y border-tantrik-gold/20">
                {t('facts.science.quote')}
              </p>
              <p>{t('facts.science.p5')}</p>
            </div>
            <div className="text-center mt-8 text-xs text-tantrik-stone/50">
              <p>— {t('facts.science.source')}</p>
            </div>
          </motion.div>
        </section>

        {/* HOW TO USE SAPTAMUKHA */}
        <section className="py-12 sm:py-20 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="font-display text-3xl md:text-4xl text-gradient-gold text-center mb-12">
              {t('howto.title')}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* PATH 1: FIND YOUR CELEBRITY TWIN & SOUL TWIN */}
              <div className="mystic-card p-6">
                <h3 className="font-display text-xl text-tantrik-gold mb-4 flex items-center gap-3">
                  <span className="text-2xl">🌟</span>
                  {t('howto.path1.title')}
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      title: 'howto.path1.step1.title',
                      description: 'howto.path1.step1.desc',
                    },
                    {
                      title: 'howto.path1.step2.title',
                      description: 'howto.path1.step2.desc',
                    },
                    {
                      title: 'howto.path1.step3.title',
                      description: 'howto.path1.step3.desc',
                    },
                  ].map((step, i) => (
                    <div key={i} className="pl-6 border-l border-tantrik-gold/30">
                      <h4 className="font-display text-md text-tantrik-parchment mb-1">{t(step.title)}</h4>
                      <p className="text-tantrik-stone text-sm leading-relaxed">{t(step.description)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* PATH 2: MUKHA DARSHAN - FULL FACE HARMONY ANALYSIS */}
              <div className="mystic-card p-6">
                <h3 className="font-display text-xl text-tantrik-gold mb-4 flex items-center gap-3">
                  <span className="text-2xl">🪷</span>
                  {t('howto.path2.title')}
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      title: 'howto.path2.step1.title',
                      description: 'howto.path2.step1.desc',
                    },
                    {
                      title: 'howto.path2.step2.title',
                      description: 'howto.path2.step2.desc',
                    },
                    {
                      title: 'howto.path2.step3.title',
                      description: 'howto.path2.step3.desc',
                    },
                  ].map((step, i) => (
                    <div key={i} className="pl-6 border-l border-tantrik-gold/30">
                      <h4 className="font-display text-md text-tantrik-parchment mb-1">{t(step.title)}</h4>
                      <p className="text-tantrik-stone text-sm leading-relaxed">{t(step.description)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* HARMONY CATEGORIES & THEIR SIGNIFICANCE */}
            <div className="mystic-card p-6">
              <h3 className="font-display text-xl text-tantrik-gold mb-6 text-center">
                {t('harmony.dimensions.title')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { nameKey: 'harmony.metric.symmetry', sigKey: 'harmony.metric.symmetry.significance' },
                  { nameKey: 'harmony.metric.facialThirds', sigKey: 'harmony.metric.facialThirds.significance' },
                  { nameKey: 'harmony.metric.eyeSpacing', sigKey: 'harmony.metric.eyeSpacing.significance' },
                  { nameKey: 'harmony.metric.canthalTilt', sigKey: 'harmony.metric.canthalTilt.significance' },
                  { nameKey: 'harmony.metric.jawline', sigKey: 'harmony.metric.jawline.significance' },
                  { nameKey: 'harmony.metric.noseHarmony', sigKey: 'harmony.metric.noseHarmony.significance' },
                  { nameKey: 'harmony.metric.lipRatio', sigKey: 'harmony.metric.lipRatio.significance' },
                  { nameKey: 'harmony.metric.fwhr', sigKey: 'harmony.metric.fwhr.significance' },
                  { nameKey: 'harmony.metric.profileHarmony', sigKey: 'harmony.metric.profileHarmony.significance' },
                  { nameKey: 'harmony.metric.structuralHarmony', sigKey: 'harmony.metric.structuralHarmony.significance' },
                ].map((category, i) => (
                  <div key={i} className="p-4 bg-[#0a0a0f]/50 border border-[#1f1f25] rounded-lg">
                    <h4 className="font-display text-md text-tantrik-gold mb-2">{t(category.nameKey)}</h4>
                    <p className="text-tantrik-stone text-sm leading-relaxed">{t(category.sigKey)}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* WHAT MAKES YOUR FACE RARE */}
        <section className="py-12 sm:py-20 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="font-display text-3xl md:text-4xl text-gradient-gold mb-8">
              {t('facts.rarity.title')}
            </h2>
            <p className="text-tantrik-stone leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: goldMarkupToHtml(t('facts.rarity.p1')) }} />
            <p className="text-tantrik-stone leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: goldMarkupToHtml(t('facts.rarity.p2')) }} />
            <p className="text-tantrik-stone leading-relaxed">
              {t('facts.rarity.p3')}
            </p>
            <p className="text-tantrik-gold font-display text-lg mt-8">
              {t('facts.rarity.footer')}
            </p>
          </motion.div>
        </section>

        {/* CULTURAL TRUTH */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 bg-tantrik-dark/30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="font-display text-3xl md:text-4xl text-gradient-gold text-center mb-12">
              {t('facts.culture.title')}
            </h2>
            <p className="text-tantrik-stone text-center mb-12">
              {t('facts.culture.sub')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Saptamukha', origin: 'Hindu', key: 'facts.culture.saptamukha' },
                { name: 'Doppelgänger', origin: 'German', key: 'facts.culture.doppel' },
                { name: 'Hamzad', origin: 'Persian', key: 'facts.culture.hamzad' },
                { name: 'Kagami no Hito', origin: 'Japanese', key: 'facts.culture.kagami' },
                { name: 'Ka', origin: 'Ancient Egyptian', key: 'facts.culture.ka' },
                { name: 'Ibeji', origin: 'Yoruba', key: 'facts.culture.ibeji' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  className="mystic-card p-6"
                >
                  <div className="font-display text-xl text-tantrik-gold mb-1">{item.name}</div>
                  <div className="text-tantrik-stone/50 text-xs uppercase tracking-wider mb-3">{item.origin}</div>
                  <p className="text-tantrik-stone text-sm leading-relaxed">{t(item.key)}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-tantrik-gold font-display text-xl mt-12">
              {t('facts.culture.footer1')}
            </p>
            <p className="text-center text-tantrik-stone/70 text-sm mt-2">
              {t('facts.culture.footer2')}
            </p>
          </motion.div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="py-12 sm:py-20 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="font-display text-3xl md:text-4xl text-gradient-gold text-center mb-12">
              {t('faq.title')}
            </h2>
            <div className="space-y-6">
              {[
                { q: 'faq.q1', a: 'faq.a1' },
                { q: 'faq.q2', a: 'faq.a2' },
                { q: 'faq.q3', a: 'faq.a3' },
                { q: 'faq.q4', a: 'faq.a4' },
                { q: 'faq.q5', a: 'faq.a5' },
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="mystic-card p-6"
                >
                  <h3 className="font-display text-lg text-tantrik-gold mb-3">{t(faq.q)}</h3>
                  <p className="text-tantrik-stone text-sm leading-relaxed">{t(faq.a)}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* PRIVACY TRUST BLOCK */}
        <section className="py-16 px-4 bg-tantrik-dark/30 border-t border-tantrik-gold/10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="font-display text-2xl text-tantrik-gold text-center mb-8">
              {t('facts.privacy.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'facts.privacy.1',
                'facts.privacy.2',
                'facts.privacy.3',
                'facts.privacy.4',
                'facts.privacy.5',
              ].map((key, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="flex items-start gap-3 text-tantrik-stone text-sm"
                >
                  <span className="text-tantrik-gold mt-0.5">✓</span>
                  <span>{t(key)}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </div>

      {/* INTAKE FORM */}
      <AnimatePresence>
        {showIntake && (
          <PreScanIntakeForm
            onSubmit={handleIntakeSubmit}
            onCancel={() => setShowIntake(false)}
            soulsInMirror={stats?.soulsInMirror}
            waitingForTwin={stats?.waitingForTwin}
            scansToday={stats?.soulScansToday}
            scansOverall={stats?.soulScansOverall}
          />
        )}
      </AnimatePresence>

      {/* WARNING MODAL */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowWarning(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="mystic-card max-w-md w-full p-8 text-center border-2 border-tantrik-fire/50"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-4xl mb-4">🚨</div>
              <h2 className="font-display text-2xl text-tantrik-fire mb-2">
                {t('warning.title')}
              </h2>
              <div className="space-y-4 text-tantrik-stone text-sm leading-relaxed mb-6 text-left">
                <p>{t('warning.p1')}</p>
                <p>{t('warning.p2')}</p>
                <p>{t('warning.p3')}</p>
                <ul className="list-disc pl-5 space-y-1 text-tantrik-parchment">
                  <li>{t('warning.bullet1')}</li>
                  <li>{t('warning.bullet2')}</li>
                  <li>{t('warning.bullet3')}</li>
                </ul>
                <p className="text-tantrik-parchment font-display text-center text-lg">
                  {t('warning.question')}
                </p>
              </div>
              <button
                onClick={acceptWarning}
                className="golden-button w-full text-lg animate-pulse-glow"
              >
                {t('warning.accept')}
              </button>
              <button
                onClick={() => setShowWarning(false)}
                className="mt-3 text-tantrik-stone text-xs underline hover:text-tantrik-parchment transition-colors"
              >
                {t('warning.cancel')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DEDUP LOADING OVERLAY */}
      <AnimatePresence>
        {isDeduping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#0d0821]/95 backdrop-blur-md px-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 mb-6 opacity-40"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <g fill="none" stroke="#7f5af0" strokeWidth="0.5">
                  <polygon points="50,5 95,85 5,85" />
                  <polygon points="50,95 5,15 95,15" />
                  <circle cx="50" cy="50" r="45" />
                </g>
              </svg>
            </motion.div>
            <p className="font-display text-xl text-[#d4b8ff] mb-2">{t('dedup.searching')}</p>
            <p className="text-[13px] text-[#9d7fe3] animate-pulse">{t('dedup.consulting')}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="relative z-10 py-16 px-4 text-center border-t border-tantrik-gold/10">
        <img src="/trishul.svg" alt="Trishul Logo" className="w-12 h-12 mx-auto mb-4" />
        <p className="font-display text-tantrik-gold text-lg mb-4">SAPTAMUKHA</p>
        <p className="text-tantrik-stone text-sm max-w-md mx-auto mb-8 italic">
          {t('footer.tagline')}
        </p>
        <div className="flex justify-center gap-6 text-xs text-tantrik-stone mb-8">
          <Link to="/blog" className="hover:text-tantrik-gold transition-colors">Blog</Link>
          <Link to="/privacy" className="hover:text-tantrik-gold transition-colors">{t('footer.privacy')}</Link>
          <Link to="/terms" className="hover:text-tantrik-gold transition-colors">{t('footer.terms')}</Link>
          <Link to="/contact" className="hover:text-tantrik-gold transition-colors">{t('footer.contact')}</Link>
        </div>
        <p className="text-tantrik-stone/50 text-xs">
          {t('footer.rights', { year: new Date().getFullYear() })}
        </p>
      </footer>
    </div>
  );
}
