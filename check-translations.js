
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/lib/translations.json', 'utf8'));
const languages = Object.keys(data);
const baseKeys = Object.keys(data.en);

console.log('Supported languages:', languages);

for (const lang of languages) {
  if (lang === 'en') continue;
  const missingKeys = baseKeys.filter(k => !(k in data[lang]));
  console.log(`Missing keys in ${lang} (${missingKeys.length}):`);
  for (const key of missingKeys) {
    console.log(`  - ${key}`);
  }
}
