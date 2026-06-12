import React, { useState, useCallback, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import SmartCameraZone from '../harmony/SmartCameraZone';
import { findCelebrityMatches } from '../../lib/celebrityMatcher';
import { embedImageFile } from '../../lib/embedService';

const CameraFeed = forwardRef(function CameraFeed({ onCaptureComplete }, ref) {
  const { t } = useLanguage();
  const [status, setStatus] = useState('idle'); // idle | processing | error
  const [errorMessage, setErrorMessage] = useState('');

  const handleCapture = useCallback(async ({ blob }) => {
    try {
      setStatus('processing');
      // Use the captured blob (from SmartCameraZone) for embedding!
      const result = await embedImageFile(blob);
      const celebMatches = findCelebrityMatches(result.embedding, 3);
      setStatus('done');
      onCaptureComplete({
        embedding: result.embedding,
        celebrityResults: celebMatches,
        quality: result.quality,
        image: blob,
        scanType: 'live',
      });
    } catch (err) {
      console.error('Auto capture error:', err);
      setStatus('error');
      setErrorMessage(err.message || t('camera.error.generic'));
    }
  }, [onCaptureComplete, t]);

  const handleUpload = useCallback(async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setStatus('processing');
      const result = await embedImageFile(file);
      const celebMatches = findCelebrityMatches(result.embedding, 3);
      setStatus('done');
      onCaptureComplete({
        embedding: result.embedding,
        celebrityResults: celebMatches,
        quality: result.quality,
        image: file,
        scanType: 'upload',
      });
    } catch (err) {
      console.error('Upload error:', err);
      setStatus('error');
      setErrorMessage(err.message || t('camera.error.generic'));
    }
  }, [onCaptureComplete, t]);

  const resetToIdle = useCallback(() => {
    setStatus('idle');
    setErrorMessage('');
  }, []);

  return (
    <div className="relative">
      <div className="relative mx-auto w-full px-4 sm:px-0 max-w-lg sm:max-w-xl md:max-w-2xl">
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              key="camera"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SmartCameraZone
                viewType="front"
                active={status === 'idle'}
                onCapture={handleCapture}
                onUpload={handleUpload}
                onRetake={() => {
                  // No-op since it's only front view, reset via our own Scan Again button
                }}
                errorMessage={errorMessage}
                hideHeader={true}
              />
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mystic-card p-8 text-center"
            >
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="font-display text-xl text-tantrik-fire mb-3">
                {t('camera.error.title')}
              </h3>
              <p className="text-tantrik-stone text-sm mb-6">
                {errorMessage}
              </p>
              <button
                onClick={resetToIdle}
                className="golden-button w-full"
              >
                {t('camera.try_again')}
              </button>
            </motion.div>
          )}

          {status === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mystic-card p-8 text-center"
            >
              <div className="text-4xl mb-4 animate-pulse">🔮</div>
              <p className="text-tantrik-gold font-display text-lg">
                {t('camera.processing')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

export default CameraFeed;
