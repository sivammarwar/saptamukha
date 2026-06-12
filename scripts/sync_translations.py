import json

with open('src/lib/translations.json', 'r') as f:
    data = json.load(f)

en_keys = set(data['en'].keys())
langs = ['hi', 'es', 'pt', 'ja', 'ko', 'zh', 'id', 'tl']

for lang in langs:
    if lang not in data:
        data[lang] = {}
    existing = set(data[lang].keys())
    missing = en_keys - existing
    for key in missing:
        data[lang][key] = data['en'][key]
    print(f"{lang}: added {len(missing)} missing keys")

with open('src/lib/translations.json', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
    f.write('\n')

print("Done! All languages now have all keys.")
