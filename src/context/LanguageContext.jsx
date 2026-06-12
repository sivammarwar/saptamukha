import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import translations from '../lib/translations.json';

const LanguageContext = createContext();
const SITE_URL = 'https://saptamukha.com';

const LANGUAGE_MAP = {
  'hi': 'hi', 'hi-IN': 'hi',
  'en': 'en', 'en-US': 'en', 'en-GB': 'en',
  'es': 'es', 'es-ES': 'es', 'es-MX': 'es',
  'pt': 'pt', 'pt-BR': 'pt',
  'ja': 'ja', 'ja-JP': 'ja',
  'ko': 'ko', 'ko-KR': 'ko',
  'zh': 'zh', 'zh-CN': 'zh', 'zh-TW': 'zh',
  'id': 'id', 'id-ID': 'id',
  'tl': 'tl', 'fil': 'tl',
};

const LOCALE_MAP = {
  en: 'en_US',
  hi: 'hi_IN',
  es: 'es_ES',
  pt: 'pt_BR',
  ja: 'ja_JP',
  ko: 'ko_KR',
  zh: 'zh_CN',
  id: 'id_ID',
  tl: 'tl_PH',
};

const KEYWORDS_MAP = {
  en: 'celebrity look alike, celebrity doppelganger, soul twin, face match, mukha darshan, facial harmony, ai face match, saptamukha',
  hi: 'सेलेब्रिटी हमशक्ल, चेहरा मिलान, आत्मा जुड़वां, मुख दर्शन, चेहरे की समानता, सप्तमुख',
  es: 'parecido de celebridad, doppelganger, alma gemela, coincidencia facial, armonia facial, saptamukha',
  pt: 'sosia de celebridade, alma gemea, correspondencia facial, harmonia facial, mukha darshan, saptamukha',
  ja: '有名人 そっくり, ドッペルゲンガー, 魂の双子, 顔診断, 顔一致, ムカ ダルシャン, saptamukha',
  ko: '연예인 닮은꼴, 도플갱어, 영혼의 쌍둥이, 얼굴 매칭, 얼굴 조화, saptamukha',
  zh: '明星撞脸, 灵魂双胞胎, 人脸匹配, 面部分析, 颜值分析, saptamukha',
  id: 'mirip selebriti, doppelganger, kembar jiwa, kecocokan wajah, analisis wajah, saptamukha',
  tl: 'kamukha ng artista, doppelganger, kambal na kaluluwa, face match, facial harmony, saptamukha',
};

function getInitialLanguage() {
  const urlLang = new URLSearchParams(window.location.search).get('lang');
  if (urlLang && translations[urlLang]) {
    localStorage.setItem('selectedLanguage', urlLang);
    return urlLang;
  }

  const stored = localStorage.getItem('selectedLanguage');
  if (stored && translations[stored]) return stored;

  const browserLang = navigator.language;
  const mapped = LANGUAGE_MAP[browserLang] || 'en';
  localStorage.setItem('selectedLanguage', mapped);
  return mapped;
}

function upsertMeta(selector, attrName, content) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, selector.match(/="([^"]+)"/)?.[1] || '');
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href, hreflang = null) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    if (hreflang) el.setAttribute('hreflang', hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function buildLocalizedUrl(pathname, lang) {
  const normalizedPath = pathname || '/';
  const suffix = lang === 'en' ? '' : `?lang=${lang}`;
  return `${SITE_URL}${normalizedPath}${suffix}`;
}

function updateSeoMeta(lang, pathname) {
  const strings = translations[lang] || translations.en;
  const title = strings['meta.title'] || strings['hero.headline'] || translations.en['meta.title'];
  const description = strings['meta.description'] || strings['hero.subheadline'] || translations.en['hero.subheadline'];
  const keywords = strings['meta.keywords'] || KEYWORDS_MAP[lang] || KEYWORDS_MAP.en;
  const locale = LOCALE_MAP[lang] || LOCALE_MAP.en;
  const localizedUrl = buildLocalizedUrl(pathname, lang);
  const defaultUrl = buildLocalizedUrl(pathname, 'en');
  const ogImage = `${SITE_URL}/og-image.jpg`;
  const twitterImage = `${SITE_URL}/twitter-image.jpg`;

  document.title = title;
  document.documentElement.lang = lang;

  upsertMeta('meta[name="title"]', 'name', title);
  upsertMeta('meta[name="description"]', 'name', description);
  upsertMeta('meta[name="keywords"]', 'name', keywords);
  upsertMeta('meta[property="og:title"]', 'property', title);
  upsertMeta('meta[property="og:description"]', 'property', description);
  upsertMeta('meta[property="og:url"]', 'property', localizedUrl);
  upsertMeta('meta[property="og:locale"]', 'property', locale);
  upsertMeta('meta[property="og:image"]', 'property', ogImage);
  upsertMeta('meta[name="twitter:title"]', 'name', title);
  upsertMeta('meta[name="twitter:description"]', 'name', description);
  upsertMeta('meta[name="twitter:url"]', 'name', localizedUrl);
  upsertMeta('meta[name="twitter:image"]', 'name', twitterImage);

  upsertLink('canonical', localizedUrl);
  upsertLink('alternate', defaultUrl, 'x-default');
  Object.keys(LOCALE_MAP).forEach((code) => {
    upsertLink('alternate', buildLocalizedUrl(pathname, code), code);
  });
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');
  const location = useLocation();

  useEffect(() => {
    setLang(getInitialLanguage());
  }, []);

  useEffect(() => {
    if (!lang) return;
    updateSeoMeta(lang, location.pathname);
  }, [lang, location.pathname]);

  const setLanguage = (code) => {
    setLang(code);
    localStorage.setItem('selectedLanguage', code);
    const url = new URL(window.location.href);
    if (code === 'en') {
      url.searchParams.delete('lang');
    } else {
      url.searchParams.set('lang', code);
    }
    window.history.replaceState({}, '', url.toString());
  };

  const t = (key, replacements = {}) => {
    const text = translations[lang]?.[key] || translations['en']?.[key] || key;
    return text.replace(/\{(\w+)\}/g, (_, k) => replacements[k] ?? `{${k}}`);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
