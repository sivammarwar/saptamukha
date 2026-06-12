import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const COUNTRIES = [
  'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
  'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Switzerland',
  'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Poland', 'Czech Republic',
  'Russia', 'Ukraine', 'Turkey', 'Israel', 'UAE', 'Saudi Arabia', 'Iran',
  'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Bhutan', 'Maldives',
  'China', 'Japan', 'South Korea', 'Thailand', 'Vietnam', 'Indonesia',
  'Malaysia', 'Singapore', 'Philippines', 'Myanmar', 'Cambodia', 'Laos',
  'Brazil', 'Argentina', 'Mexico', 'Colombia', 'Chile', 'Peru', 'Venezuela',
  'South Africa', 'Nigeria', 'Egypt', 'Kenya', 'Ethiopia', 'Ghana', 'Morocco',
  'New Zealand', 'Ireland', 'Portugal', 'Greece', 'Hungary', 'Romania', 'Serbia',
  'Croatia', 'Slovenia', 'Slovakia', 'Lithuania', 'Latvia', 'Estonia',
  'Iceland', 'Luxembourg', 'Malta', 'Cyprus', 'Bulgaria', 'Albania', 'Macedonia',
  'Bosnia and Herzegovina', 'Montenegro', 'Moldova', 'Belarus', 'Georgia',
  'Armenia', 'Azerbaijan', 'Kazakhstan', 'Uzbekistan', 'Kyrgyzstan', 'Tajikistan',
  'Turkmenistan', 'Mongolia', 'Afghanistan', 'Iraq', 'Syria', 'Lebanon', 'Jordan',
  'Kuwait', 'Qatar', 'Bahrain', 'Oman', 'Yemen', 'Sudan', 'Libya', 'Tunisia',
  'Algeria', 'Mali', 'Senegal', 'Ivory Coast', 'Cameroon', 'Tanzania', 'Uganda',
  'Rwanda', 'Zimbabwe', 'Zambia', 'Botswana', 'Namibia', 'Madagascar',
  'Cuba', 'Jamaica', 'Haiti', 'Dominican Republic', 'Puerto Rico', 'Guatemala',
  'Honduras', 'El Salvador', 'Nicaragua', 'Costa Rica', 'Panama', 'Ecuador',
  'Bolivia', 'Paraguay', 'Uruguay', 'Guyana', 'Suriname', 'Belize', 'Barbados',
  'Trinidad and Tobago', 'Bahamas', 'Fiji', 'Papua New Guinea', 'Solomon Islands',
  'Samoa', 'Tonga', 'Vanuatu', 'Kiribati', 'Tuvalu', 'Nauru', 'Palau', 'Marshall Islands',
  'Micronesia', 'Taiwan', 'Hong Kong', 'Macau', 'Brunei', 'Timor-Leste', 'North Korea',
  'Seychelles', 'Mauritius', 'Comoros', 'Djibouti', 'Eritrea',
  'Somalia', 'Chad', 'Central African Republic', 'Democratic Republic of Congo',
  'Republic of Congo', 'Gabon', 'Equatorial Guinea', 'Sao Tome and Principe',
  'Guinea', 'Guinea-Bissau', 'Sierra Leone', 'Liberia', 'Burkina Faso', 'Togo',
  'Benin', 'Niger', 'Mauritania', 'Western Sahara', 'Gambia', 'Lesotho', 'Eswatini',
  'Malawi', 'Mozambique', 'Angola', 'Burundi', 'South Sudan', 'Palestine'
];

export default function PreScanIntakeForm({
  onSubmit,
  onCancel,
  soulsInMirror = 109810,
  waitingForTwin = 109810,
  scansToday = 500,
  scansOverall = 109810,
}) {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    age: '',
    country: 'India',
    email: '',
    fatherName: '',
    motherName: '',
    oath: false,
  });
  const [errors, setErrors] = useState({});

  const totalSteps = 5;

  function updateField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  }

  function validateCurrentStep() {
    const errs = {};
    if (step === 1) {
      if (!form.name.trim()) errs.name = t('intake.error.name');
      if (!form.age || Number(form.age) < 13 || Number(form.age) > 120) errs.age = t('intake.error.age');
      if (!form.country) errs.country = t('intake.error.country');
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t('intake.error.email');
    }
    if (step === 2) {
      if (!form.fatherName.trim()) errs.fatherName = t('intake.error.father');
      if (!form.motherName.trim()) errs.motherName = t('intake.error.mother');
    }
    if (step === 3) {
      if (!form.oath) errs.oath = t('intake.error.oath');
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function nextStep() {
    if (validateCurrentStep()) {
      if (step < totalSteps) setStep(step + 1);
    }
  }

  function handleSubmit() {
    if (!validateCurrentStep()) return;
    onSubmit({
      name: form.name.trim(),
      age: Number(form.age),
      country: form.country,
      email: form.email.trim(),
      fatherName: form.fatherName.trim(),
      motherName: form.motherName.trim(),
    });
  }

  const cardStyle = "bg-[#1a0a2e] border border-[#3d2a6e] rounded-xl p-6 space-y-5";
  const inputStyle = "w-full bg-[#0d0821] border border-[#3d2a6e] rounded-lg px-4 py-3 text-[#d4b8ff] placeholder-[#9d7fe3]/50 focus:outline-none focus:border-[#7f5af0] transition-colors text-[15px]";
  const labelStyle = "block text-[13px] text-[#9d7fe3] mb-1.5";
  const hintStyle = "text-[11px] text-[#9d7fe3]/60 mt-1";
  const errorStyle = "text-[11px] text-red-400 mt-1";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#0d0821]/95 backdrop-blur-md overflow-y-auto py-8"
    >
      <div className="w-full max-w-lg">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i < step ? 'w-8 bg-[#7f5af0]' : 'w-8 bg-[#3d2a6e]'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-[#9d7fe3] tracking-wider uppercase">
            {t('intake.step')} {step} {t('intake.of')} {totalSteps}
          </span>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="font-display text-[22px] text-[#d4b8ff] mb-2">
            {t('intake.title')}
          </h2>
          <p className="text-[13px] text-[#9d7fe3] leading-relaxed max-w-md mx-auto">
            {t('intake.subtitle')}
          </p>
        </div>

        {/* Live counters: fake baseline + real from DB */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#1a0a2e] border border-[#3d2a6e] rounded-xl p-4 text-center">
            <div className="text-[11px] text-[#9d7fe3] uppercase tracking-wider mb-1">{t('intake.counter.souls')}</div>
            <div className="text-2xl font-mono text-[#d4b8ff]">{soulsInMirror.toLocaleString()}</div>
          </div>
          <div className="bg-[#1a0a2e] border border-[#3d2a6e] rounded-xl p-4 text-center">
            <div className="text-[11px] text-[#9d7fe3] uppercase tracking-wider mb-1">{t('intake.counter.waiting')}</div>
            <div className="text-2xl font-mono text-[#7f5af0]">{waitingForTwin.toLocaleString()}</div>
          </div>
          <div className="bg-[#1a0a2e] border border-[#3d2a6e] rounded-xl p-4 text-center">
            <div className="text-[11px] text-[#9d7fe3] uppercase tracking-wider mb-1">{t('stats.scans_today')}</div>
            <div className="text-2xl font-mono text-[#d4b8ff]">{scansToday.toLocaleString()}</div>
          </div>
          <div className="bg-[#1a0a2e] border border-[#3d2a6e] rounded-xl p-4 text-center">
            <div className="text-[11px] text-[#9d7fe3] uppercase tracking-wider mb-1">{t('stats.scans_overall')}</div>
            <div className="text-2xl font-mono text-[#7f5af0]">{scansOverall.toLocaleString()}</div>
          </div>
        </div>

        {/* Form content */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cardStyle}
          >
            <h3 className="text-[15px] text-[#d4b8ff] font-display mb-1">{t('intake.card1.title')}</h3>
            <p className="text-[11px] text-[#9d7fe3]/60 mb-4">{t('intake.card1.subtitle')}</p>

            <div>
              <label className={labelStyle}>{t('intake.field.name')}</label>
              <input
                type="text"
                value={form.name}
                onChange={e => updateField('name', e.target.value)}
                placeholder={t('intake.placeholder.name')}
                className={inputStyle}
              />
              {errors.name && <p className={errorStyle}>{errors.name}</p>}
            </div>

            <div>
              <label className={labelStyle}>{t('intake.field.age')}</label>
              <input
                type="number"
                value={form.age}
                onChange={e => updateField('age', e.target.value)}
                placeholder={t('intake.placeholder.age')}
                min={13}
                max={120}
                className={inputStyle}
              />
              {errors.age && <p className={errorStyle}>{errors.age}</p>}
            </div>

            <div>
              <label className={labelStyle}>{t('intake.field.country')}</label>
              <select
                value={form.country}
                onChange={e => updateField('country', e.target.value)}
                className={inputStyle}
              >
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.country && <p className={errorStyle}>{errors.country}</p>}
            </div>

            <div>
              <label className={labelStyle}>{t('intake.field.email')}</label>
              <input
                type="email"
                value={form.email}
                onChange={e => updateField('email', e.target.value)}
                placeholder={t('intake.placeholder.email')}
                className={inputStyle}
              />
              <p className={hintStyle}>{t('intake.hint.email')}</p>
              {errors.email && <p className={errorStyle}>{errors.email}</p>}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cardStyle}
          >
            <h3 className="text-[15px] text-[#d4b8ff] font-display mb-1">{t('intake.card2.title')}</h3>
            <p className="text-[11px] text-[#9d7fe3]/60 mb-4">{t('intake.card2.subtitle')}</p>

            <div>
              <label className={labelStyle}>{t('intake.field.father')}</label>
              <input
                type="text"
                value={form.fatherName}
                onChange={e => updateField('fatherName', e.target.value)}
                placeholder={t('intake.placeholder.father')}
                className={inputStyle}
              />
              <p className={hintStyle}>{t('intake.hint.father')}</p>
              {errors.fatherName && <p className={errorStyle}>{errors.fatherName}</p>}
            </div>

            <div>
              <label className={labelStyle}>{t('intake.field.mother')}</label>
              <input
                type="text"
                value={form.motherName}
                onChange={e => updateField('motherName', e.target.value)}
                placeholder={t('intake.placeholder.mother')}
                className={inputStyle}
              />
              <p className={hintStyle}>{t('intake.hint.mother')}</p>
              {errors.motherName && <p className={errorStyle}>{errors.motherName}</p>}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cardStyle}
          >
            <div className="flex items-start gap-3">
              <div className="text-xl mt-0.5">🔒</div>
              <div>
                <h3 className="text-[15px] text-[#d4b8ff] font-display mb-2">{t('intake.oath.title')}</h3>
                <p className="text-[13px] text-[#9d7fe3] leading-relaxed mb-4">
                  {t('intake.oath.text')}
                </p>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.oath}
                    onChange={e => updateField('oath', e.target.checked)}
                    className="mt-1 w-4 h-4 accent-[#7f5af0]"
                  />
                  <span className="text-[13px] text-[#d4b8ff]">{t('intake.oath.checkbox')}</span>
                </label>
                {errors.oath && <p className={errorStyle}>{errors.oath}</p>}
              </div>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cardStyle + " text-center py-10"}
          >
            <div className="text-5xl mb-4">🪞</div>
            <h3 className="text-[18px] text-[#d4b8ff] font-display mb-3">{t('intake.ready.title')}</h3>
            <p className="text-[13px] text-[#9d7fe3] leading-relaxed max-w-sm mx-auto">
              {t('intake.ready.text')}
            </p>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cardStyle + " text-center py-10"}
          >
            <div className="text-5xl mb-4">👁</div>
            <h3 className="text-[18px] text-[#d4b8ff] font-display mb-3">{t('intake.final.title')}</h3>
            <p className="text-[13px] text-[#9d7fe3] leading-relaxed max-w-sm mx-auto mb-6">
              {t('intake.final.text')}
            </p>
            <button
              onClick={handleSubmit}
              className="w-full bg-[#1a0a2e] border border-[#7f5af0] text-[#d4b8ff] rounded-lg py-3 px-6 text-[15px] font-display hover:bg-[#7f5af0]/10 transition-colors"
            >
              {t('intake.button.open')} →
            </button>
          </motion.div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="text-[13px] text-[#9d7fe3] hover:text-[#d4b8ff] transition-colors"
            >
              ← {t('intake.back')}
            </button>
          ) : (
            <button
              onClick={onCancel}
              className="text-[13px] text-[#9d7fe3] hover:text-[#d4b8ff] transition-colors"
            >
              {t('intake.cancel')}
            </button>
          )}

          {step < totalSteps && (
            <button
              onClick={nextStep}
              className="bg-[#1a0a2e] border border-[#7f5af0] text-[#d4b8ff] rounded-lg py-2.5 px-6 text-[13px] font-display hover:bg-[#7f5af0]/10 transition-colors"
            >
              {t('intake.next')} →
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
