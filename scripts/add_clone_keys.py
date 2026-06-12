import json

with open('src/lib/translations.json', 'r') as f:
    data = json.load(f)

# New keys with English fallback
new_keys = {
    "celebrity.subtitle": "The cosmos remembers all faces.",
    "celebrity.no_match": "No celebrity match found in the celestial mirror.",
    "celebrity.clone_found": "We Found Your Clone!",
    "celebrity.clone_message": "Your face is almost identical to {name}. You are their twin across the stars.",
    "celebrity.clone_note": "This is for fun only — no contact details needed.",
    "celebrity.mirrors": "Your face mirrors {name}'s across the stars.",
}

# Language-specific translations
hi_keys = {
    "celebrity.subtitle": "ब्रह्मांड सभी चेहरों को याद रखता है।",
    "celebrity.no_match": "दिव्य दर्पण में कोई सेलिब्रिटी मैच नहीं मिला।",
    "celebrity.clone_found": "हमने आपका क्लोन ढूंढ लिया!",
    "celebrity.clone_message": "आपका चेहरा लगभग {name} जैसा ही है। आप उनके जुड़वां हैं तारों के पार।",
    "celebrity.clone_note": "यह केवल मज़े के लिए है — कोई संपर्क विवरण की आवश्यकता नहीं।",
    "celebrity.mirrors": "आपका चेहरा {name} की परछाई बनाता है तारों के पार।",
}

ko_keys = {
    "celebrity.subtitle": "우주는 모든 얼굴을 기억합니다.",
    "celebrity.no_match": "신성한 거울에서 셀러브리티 매치를 찾을 수 없습니다.",
    "celebrity.clone_found": "당신의 클론을 찾았습니다!",
    "celebrity.clone_message": "당신의 얼굴은 {name}과 거의 동일합니다. 별들 너머의 쌍둥이입니다.",
    "celebrity.clone_note": "이것은 재미를 위한 것입니다 — 연락처가 필요하지 않습니다.",
    "celebrity.mirrors": "당신의 얼굴은 별들 너머 {name}을 비춥니다.",
}

pt_keys = {
    "celebrity.subtitle": "O cosmos lembra todos os rostos.",
    "celebrity.no_match": "Nenhuma correspondência de celebridade encontrada no espelho celestial.",
    "celebrity.clone_found": "Encontramos Seu Clone!",
    "celebrity.clone_message": "Seu rosto é quase idêntico ao de {name}. Você é o gêmeo deles através das estrelas.",
    "celebrity.clone_note": "Isso é apenas por diversão — não são necessários detalhes de contato.",
    "celebrity.mirrors": "Seu rosto espelha o de {name} através das estrelas.",
}

es_keys = {
    "celebrity.subtitle": "El cosmos recuerda todos los rostros.",
    "celebrity.no_match": "No se encontró coincidencia de celebridad en el espejo celestial.",
    "celebrity.clone_found": "¡Encontramos Tu Clon!",
    "celebrity.clone_message": "Tu rostro es casi idéntico al de {name}. Eres su gemelo a través de las estrellas.",
    "celebrity.clone_note": "Esto es solo por diversión — no se necesitan datos de contacto.",
    "celebrity.mirrors": "Tu rostro refleja el de {name} a través de las estrellas.",
}

ja_keys = {
    "celebrity.subtitle": "宇宙はすべての顔を覚えている。",
    "celebrity.no_match": "神聖な鏡にセレブリティの一致が見つかりませんでした。",
    "celebrity.clone_found": "あなたのクローンを見つけました！",
    "celebrity.clone_message": "あなたの顔は{name}とほぼ同じです。星を超えた双子です。",
    "celebrity.clone_note": "これは楽しみのためだけです — 連絡先は必要ありません。",
    "celebrity.mirrors": "あなたの顔は星を超えて{name}を映しています。",
}

zh_keys = {
    "celebrity.subtitle": "宇宙记得所有面孔。",
    "celebrity.no_match": "在神圣之镜中未找到名人匹配。",
    "celebrity.clone_found": "我们找到了你的克隆！",
    "celebrity.clone_message": "你的面孔几乎与{name}相同。你们是跨越星辰的双胞胎。",
    "celebrity.clone_note": "这仅用于娱乐 — 无需联系方式。",
    "celebrity.mirrors": "你的面孔跨越星辰映照着{name}。",
}

id_keys = {
    "celebrity.subtitle": "Kosmos mengingat semua wajah.",
    "celebrity.no_match": "Tidak ada kecocakan selebriti yang ditemukan di cermin surgawi.",
    "celebrity.clone_found": "Kami Menemukan Klon Anda!",
    "celebrity.clone_message": "Wajah Anda hampir identik dengan {name}. Anda adalah kembaran mereka di seberang bintang.",
    "celebrity.clone_note": "Ini hanya untuk bersenang-senang — tidak diperlukan detail kontak.",
    "celebrity.mirrors": "Wajah Anda mencerminkan {name} melintasi bintang-bintang.",
}

tl_keys = {
    "celebrity.subtitle": "Ang kosmos ay nagbabalik-tanaw sa lahat ng mga mukha.",
    "celebrity.no_match": "Walang natagpuang katugma ng celebrity sa sagradong salamin.",
    "celebrity.clone_found": "Natagpuan Namin Ang Iyong Klon!",
    "celebrity.clone_message": "Ang iyong mukha ay halos kapareho ng kay {name}. Ikaw ang kanilang kambal sa kabila ng mga bituin.",
    "celebrity.clone_note": "Ito ay para sa kasiyahan lamang — walang kailangang detaille ng contact.",
    "celebrity.mirrors": "Ang iyong mukha ay sumasalamin kay {name} sa kabila ng mga bituin.",
}

# Update all languages
for lang, keys in [('en', new_keys), ('hi', hi_keys), ('ko', ko_keys), ('pt', pt_keys),
                     ('es', es_keys), ('ja', ja_keys), ('zh', zh_keys), ('id', id_keys), ('tl', tl_keys)]:
    data[lang].update(keys)

with open('src/lib/translations.json', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
    f.write('\n')

print("Added clone keys to all 9 languages")
