import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'pt', label: 'Portuguese', native: 'Português' },
  { code: 'ja', label: 'Japanese', native: '日本語' },
  { code: 'ko', label: 'Korean', native: '한국어' },
  { code: 'zh', label: 'Chinese', native: '中文' },
  { code: 'id', label: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'tl', label: 'Tagalog', native: 'Tagalog' },
];

export default function LanguageSwitcher() {
  const { lang, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-xs text-tantrik-stone hover:text-tantrik-gold transition-colors"
      >
        <span>{current.code.toUpperCase()}</span>
        <span>▼</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 mystic-card py-2 z-50">
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => {
                setLanguage(l.code);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                l.code === lang
                  ? 'text-tantrik-gold bg-tantrik-gold/10'
                  : 'text-tantrik-parchment hover:bg-tantrik-gold/10'
              }`}
            >
              <span className="font-body">{l.native}</span>
              <span className="text-tantrik-stone text-xs ml-2">({l.label})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
