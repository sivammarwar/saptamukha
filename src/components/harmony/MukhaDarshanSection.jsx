import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import SmartCameraZone from './SmartCameraZone';
import HarmonyResults from './HarmonyResults';
import { analyzeImageBatch } from '../../services/analyzeService';
import { usePlatformStats } from '../../hooks/usePlatformStats';
import { recordHarmonyScan, getTopHarmonyScorers } from '../../lib/statsService';
import HarmonyPlatformStats from './HarmonyPlatformStats';
import NewHighScoreModal from './NewHighScoreModal';

export default function MukhaDarshanSection() {
  const { t } = useLanguage();
  const { stats, refresh: refreshStats } = usePlatformStats();
  const [phase, setPhase] = useState('idle');
  const [captures, setCaptures] = useState({ front: null, left: null, right: null });
  const [errors, setErrors] = useState({ front: null, left: null, right: null });
  const [results, setResults] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  const [requireManualRetry, setRequireManualRetry] = useState(false);
  const [disableAutoCapture, setDisableAutoCapture] = useState(false);
  const [showHighScoreModal, setShowHighScoreModal] = useState(false);
  const [currentTopScorers, setCurrentTopScorers] = useState([]);
  const [highScoreRank, setHighScoreRank] = useState(1);

  const allCaptured = useMemo(
    () => Boolean(captures.front && captures.left && captures.right),
    [captures.front, captures.left, captures.right],
  );

  const batchPayload = useMemo(() => {
    if (!allCaptured) return null;
    return {
      front: captures.front.blob,
      left: captures.left.blob,
      right: captures.right.blob,
    };
  }, [allCaptured, captures.front, captures.left, captures.right]);

  const resetFlow = () => {
    setCaptures({ front: null, left: null, right: null });
    setErrors({ front: null, left: null, right: null });
    setResults(null);
    setGlobalError(null);
  };

  const cascadeClear = useCallback((viewType) => {
    const order = ['front', 'left', 'right'];
    const start = order.indexOf(viewType);
    if (start === -1) return;

    setCaptures((prev) => {
      const next = { ...prev };
      for (let i = start; i < order.length; i += 1) {
        next[order[i]] = null;
      }
      return next;
    });

    setErrors((prev) => {
      const next = { ...prev };
      for (let i = start; i < order.length; i += 1) {
        next[order[i]] = null;
      }
      return next;
    });
  }, []);

  const handleInitiate = () => {
    resetFlow();
    setRequireManualRetry(false);
    setDisableAutoCapture(false);
    setPhase('front');
  };

  const advancePhase = (viewType) => {
    if (viewType === 'front') setPhase('left');
    else if (viewType === 'left') setPhase('right');
    else if (viewType === 'right') setPhase('analyze');
  };

  const handleCapture = (viewType, data) => {
    setCaptures((prev) => ({ ...prev, [viewType]: data }));
    setErrors((prev) => ({ ...prev, [viewType]: null }));
    setGlobalError(null);
    setResults(null);
    setRequireManualRetry(false);
    setDisableAutoCapture(false);
    advancePhase(viewType);
  };

  const handleRetake = (viewType) => {
    cascadeClear(viewType);
    setGlobalError(null);
    setResults(null);
    setPhase(viewType);
  };

  const handleAnalyze = useCallback(async () => {
    if (!batchPayload || analyzing) return;
    setAnalyzing(true);
    setGlobalError(null);
    setResults(null);

    try {
      const response = await analyzeImageBatch(batchPayload);

      if (response.status === 'partial') {
        setRequireManualRetry(true);
        setDisableAutoCapture(true);
        const failed = [];
        for (const v of ['front', 'left', 'right']) {
          const vr = response.views[v];
          if (vr.status === 'error') {
            failed.push(v);
            setErrors((prev) => ({ ...prev, [v]: vr.message || t('harmony.view_failed') }));
          }
        }
        if (failed.length > 0) {
          cascadeClear(failed[0]);
          setPhase(failed[0]);
        }
      } else {
        setResults(response);
        await recordHarmonyScan({
          normalized_overall: response.normalized_overall,
          tier: response.tier,
          scores: response.scores,
        });
        refreshStats();
        
        // Check if this is a top score and calculate rank
        const newScore = response.normalized_overall;
        let isHighScore = false;
        let newRank = 1;

        // Create a combined list of all existing scores (from top_scorers and platform stats if needed)
        const existingScores = [...currentTopScorers.map(s => s.score || 0)];
        
        // Count how many scores are strictly higher than newScore
        const higherScores = existingScores.filter(s => s > newScore).length;
        newRank = higherScores + 1;

        // Only show pop-up if rank is <= 10
        if (newRank <= 10) {
          isHighScore = true;
          setHighScoreRank(newRank);
        }
        
        if (isHighScore) {
          setShowHighScoreModal(true);
        }
      }
    } catch (err) {
      setGlobalError(err?.message || err?.detail || t('harmony.analysis_failed'));
    } finally {
      setAnalyzing(false);
    }
  }, [batchPayload, analyzing, cascadeClear, t, refreshStats, currentTopScorers]);

  useEffect(() => {
    if (phase === 'analyze' && batchPayload && !analyzing && !results && !globalError && !requireManualRetry) {
      handleAnalyze();
    }
  }, [phase, batchPayload, analyzing, results, globalError, requireManualRetry, handleAnalyze]);

  useEffect(() => {
    async function fetchCurrentTop() {
      const top = await getTopHarmonyScorers();
      setCurrentTopScorers(top);
    }
    fetchCurrentTop();
  }, []);

  const handleHighScoreSuccess = useCallback(async () => {
    const newTop = await getTopHarmonyScorers();
    setCurrentTopScorers(newTop);
    refreshStats();
  }, [refreshStats]);

  return (
    <>
      <NewHighScoreModal
        isOpen={showHighScoreModal}
        onClose={() => setShowHighScoreModal(false)}
        score={results?.normalized_overall}
        rank={highScoreRank}
        onSuccess={handleHighScoreSuccess}
      />
      <section id="harmony" className="py-12 sm:py-16 px-4 scroll-anchor">
        <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2
            className="text-[28px] md:text-[36px] font-display text-[#d4b8ff] tracking-wide mb-2"
            style={{ textShadow: '0 0 20px rgba(127, 90, 240, 0.4)' }}
          >
            {t('harmony.title')}
          </h2>
          <p className="text-[11px] md:text-[13px] text-[#9d7fe3] uppercase tracking-[0.2em] font-mono">
            {t('harmony.subtitle')}
          </p>
        </motion.div>

        {phase !== 'idle' && (
          <div className="flex items-center justify-center gap-3 mb-6">
            {['front', 'left', 'right'].map((step, i) => {
              const isDone = captures[step];
              const isActive = phase === step;
              return (
                <div key={step} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-mono border ${
                      isDone
                        ? 'bg-[#00ff88]/10 border-[#00ff88] text-[#00ff88]'
                        : isActive
                          ? 'bg-[#7f5af0]/10 border-[#7f5af0] text-[#d4b8ff] animate-pulse'
                          : 'bg-[#1a1a1a] border-[#2a2a2a] text-[#5a3fcf]'
                    }`}
                  >
                    {isDone ? '✓' : i + 1}
                  </div>
                  {i < 2 && (
                    <div className={`w-8 h-px ${isDone ? 'bg-[#00ff88]/30' : 'bg-[#2a2a2a]'}`} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        <HarmonyPlatformStats stats={stats} />

        {phase === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <button
              onClick={handleInitiate}
              className="relative px-12 py-5 rounded-lg text-[14px] uppercase tracking-[0.2em] font-mono bg-[#7f5af0] text-white hover:bg-[#5a3fcf] hover:shadow-[0_0_40px_rgba(127,90,240,0.4)] transition-all duration-300"
            >
              {t('harmony.initiate')}
            </button>
            <p className="text-[10px] text-[#5a3fcf] mt-4 font-mono">
              {t('harmony.hint')}
            </p>
          </motion.div>
        )}

        {phase !== 'idle' && (
          <div className="space-y-4">
            {['front', 'left', 'right'].some((s) => captures[s]) && (
              <div className="flex items-center justify-center gap-3">
                {['front', 'left', 'right'].map((step) => {
                  const cap = captures[step];
                  if (!cap) return null;
                  return (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#1f1f25] opacity-70"
                    >
                      <img
                        src={cap.preview}
                        alt={`${step} preview`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-[8px] text-[#00ff88] font-mono uppercase tracking-wider">
                          {t(`harmony.view.${step}.short`)}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {['front', 'left', 'right'].includes(phase) && (
              <SmartCameraZone
                key="single-camera-zone" // Keep it mounted!
                viewType={phase}
                active={true}
                capture={captures[phase]}
                errorMessage={errors[phase]}
                disableAutoCapture={disableAutoCapture}
                onCapture={(data) => handleCapture(phase, data)}
                onRetake={handleRetake}
              />
            )}
          </div>
        )}

        {phase === 'analyze' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-8"
          >
            <button
              onClick={handleAnalyze}
              disabled={!allCaptured || analyzing}
              className={`
                relative px-12 py-5 rounded-lg text-[14px] uppercase tracking-[0.2em] font-mono
                transition-all duration-300
                ${allCaptured && !analyzing
                  ? 'bg-[#7f5af0] text-white hover:bg-[#5a3fcf] hover:shadow-[0_0_40px_rgba(127,90,240,0.4)]'
                  : 'bg-[#1a1a1a] text-[#5a3fcf] cursor-not-allowed border border-[#2a2a2a]'
                }
              `}
            >
              {analyzing ? t('harmony.computing') : results ? t('harmony.resync') : t('harmony.sync')}
            </button>
          </motion.div>
        )}

        {globalError && (
          <div className="mt-4 text-center text-[#ff7474] text-[12px] font-mono uppercase tracking-[0.2em]">
            {globalError}
          </div>
        )}

        {phase === 'analyze' && analyzing && (
          <div className="mt-4 text-center text-[#5a3fcf] text-[11px] font-mono uppercase tracking-[0.18em]">
            {t('harmony.syncing')}
          </div>
        )}

        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
            >
              <HarmonyResults results={results} stats={stats} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
    </>
  );
}
