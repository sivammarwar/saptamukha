#!/usr/bin/env python3
"""Translate intake, result, warning, dedup, nav, and rarity flow keys for all languages."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TRANS_PATH = ROOT / "src/lib/translations.json"

# Keys that intentionally stay as English/product names across all langs
SKIP_SAME_AS_EN = {"harmony.title", "harmony.metric.fwhr"}

FLOW_KEYS = [
    "nav.souls", "nav.waiting",
    "dedup.searching", "dedup.consulting",
    "rarity.your_tier", "rarity.score_label",
    "intake.step", "intake.of", "intake.title", "intake.subtitle",
    "intake.counter.souls", "intake.counter.waiting",
    "intake.card1.title", "intake.card1.subtitle",
    "intake.card2.title", "intake.card2.subtitle",
    "intake.field.name", "intake.field.age", "intake.field.country",
    "intake.field.email", "intake.field.father", "intake.field.mother",
    "intake.placeholder.name", "intake.placeholder.age", "intake.placeholder.email",
    "intake.placeholder.father", "intake.placeholder.mother",
    "intake.hint.email", "intake.hint.father", "intake.hint.mother",
    "intake.oath.title", "intake.oath.text", "intake.oath.checkbox",
    "intake.ready.title", "intake.ready.text",
    "intake.final.title", "intake.final.text",
    "intake.button.open", "intake.next", "intake.back", "intake.cancel",
    "intake.error.name", "intake.error.age", "intake.error.country",
    "intake.error.email", "intake.error.father", "intake.error.mother", "intake.error.oath",
    "warning.title", "warning.p1", "warning.p2", "warning.p3",
    "warning.bullet1", "warning.bullet2", "warning.bullet3",
    "warning.question", "warning.accept", "warning.cancel",
    "result.unique.badge", "result.unique.title", "result.unique.search_title",
    "result.unique.search_body", "result.unique.last_searched", "result.unique.next_search",
    "result.social.title", "result.social.subtitle", "result.social.instagram",
    "result.social.other", "result.social.message_label", "result.social.message_placeholder",
    "result.social.message_hint", "result.social.saved", "result.social.seal", "result.social.sealing",
    "result.match.badge", "result.match.title", "result.match.percentage_label",
    "result.match.years", "result.match.joined", "result.match.why_title", "result.match.why_body",
    "result.duplicate.badge", "result.duplicate.title", "result.duplicate.body",
    "result.duplicate.not_you", "result.duplicate.not_you_body",
    "result.duplicate.update_title", "result.duplicate.update_subtitle",
    "result.duplicate.email_placeholder", "result.duplicate.update_button",
    "result.duplicate.updating", "result.duplicate.updated", "result.duplicate.update_error",
    "result.scan_again",
    "result.social.instagram_placeholder", "result.social.other_placeholder",
    "overlay.locked", "overlay.tracking", "overlay.align",
    "overlay.biometric_scan", "overlay.landmarks", "overlay.symmetry",
    "overlay.confidence", "overlay.tracking_label", "overlay.face_area", "overlay.depth",
    "overlay.lock_acquired", "overlay.scanning_hold", "overlay.aligning",
]

# Gold-highlight markup updates for facts sections (language-specific highlight phrases)
GOLD_FACTS = {
    "en": {
        "facts.science.p1": "Researchers took {gold}32 pairs{/gold} of unrelated human lookalikes — strangers from different countries who had never met — and ran their faces through three of the world's most advanced facial recognition systems.",
        "facts.science.p2": "{gold}Over 75%{/gold} of the pairs were classified as the same person. The same classification used for identical twins.",
        "facts.rarity.p1": "The human face is built from just {gold}43 measurable geometric points{/gold} — the distance between your eyes, the width of your jaw, the height of your nose bridge, the curve of your lips. That is all.",
        "facts.rarity.p2": "With 8 billion people and only ~1 billion truly unique facial profiles, every face on Earth repeats somewhere between {gold}4 and 8 times{/gold} among the living. The ancient seers said 7. The mathematics agrees.",
    },
    "hi": {
        "facts.science.p1": "शोधकर्ताओं ने {gold}32 जोड़ी{/gold} असंबद्ध मानव हमशक्ल लिए — अलग-अलग देशों के अजनबी जो कभी नहीं मिले — और उनके चेहरों को दुनिया की तीन सबसे उन्नत फेशियल रिकॉग्निशन सिस्टम से गुजारा।",
        "facts.science.p2": "जोड़ियों का {gold}75% से अधिक{/gold} एक ही व्यक्ति के रूप में वर्गीकृत किया गया। वही वर्गीकरण जो एक जुड़वां के लिए उपयोग किया जाता है।",
        "facts.rarity.p1": "मानव चेहरा केवल {gold}43 मापने योग्य ज्यामितीय बिंदुओं{/gold} से बना है — आंखों के बीच की दूरी, जबड़े की चौड़ाई, नाक के पुल की ऊंचाई, होंठों का वक्र। बस इतना ही।",
        "facts.rarity.p2": "8 अरब लोगों और केवल ~1 अरब वास्तव में अद्वितीय चेहरे के प्रोफाइल के साथ, पृथ्वी पर हर चेहरा जीवित लोगों में कहीं न कहीं {gold}4 से 8 बार{/gold} दोहराता है। प्राचीन ऋषियों ने 7 कहा। गणित सहमत है।",
    },
    "es": {
        "facts.science.p1": "Los investigadores tomaron {gold}32 pares{/gold} de sosias humanos no relacionados — extraños de diferentes países que nunca se habían conocido — y pasaron sus rostros por tres de los sistemas de reconocimiento facial más avanzados del mundo.",
        "facts.science.p2": "Más del {gold}75%{/gold} de los pares fueron clasificados como la misma persona. La misma clasificación usada para gemelos idénticos.",
        "facts.rarity.p1": "El rostro humano se construye con solo {gold}43 puntos geométricos medibles{/gold} — la distancia entre tus ojos, el ancho de tu mandíbula, la altura del puente de tu nariz, la curva de tus labios. Eso es todo.",
        "facts.rarity.p2": "Con 8 mil millones de personas y solo ~1 mil millones de perfiles faciales verdaderamente únicos, cada rostro en la Tierra se repite entre {gold}4 y 8 veces{/gold} entre los vivos. Los videntes antiguos dijeron 7. Las matemáticas coinciden.",
    },
    "pt": {
        "facts.science.p1": "Pesquisadores pegaram {gold}32 pares{/gold} de sósias humanos não relacionados — estranhos de países diferentes que nunca se encontraram — e passaram seus rostos por três dos sistemas de reconhecimento facial mais avançados do mundo.",
        "facts.science.p2": "Mais de {gold}75%{/gold} dos pares foram classificados como a mesma pessoa. A mesma classificação usada para gêmeos idênticos.",
        "facts.rarity.p1": "O rosto humano é construído com apenas {gold}43 pontos geométricos mensuráveis{/gold} — a distância entre seus olhos, a largura da mandíbula, a altura da ponte do nariz, a curva dos lábios. É só isso.",
        "facts.rarity.p2": "Com 8 bilhões de pessoas e apenas ~1 bilhão de perfis faciais verdadeiramente únicos, cada rosto na Terra se repete entre {gold}4 e 8 vezes{/gold} entre os vivos. Os videntes antigos disseram 7. A matemática concorda.",
    },
    "ja": {
        "facts.science.p1": "研究者は{gold}32組{/gold}の無関係な人間のそっくりさん — 異なる国の見知らぬ人同士 — を集め、世界で最も先進的な3つの顔認識システムで顔を分析しました。",
        "facts.science.p2": "ペアの{gold}75%以上{/gold}が同一人物と分類されました。一卵性双生児に使われるのと同じ分類です。",
        "facts.rarity.p1": "人間の顔はわずか{gold}43の測定可能な幾何学的ポイント{/gold}から構成されています — 目の間の距離、顎の幅、鼻筋の高さ、唇の曲線。それだけです。",
        "facts.rarity.p2": "80億人と真にユニークな顔プロファイルは約10億しかないため、地球上のすべての顔は生者の中で{gold}4〜8回{/gold}どこかで繰り返されます。古代の予言者は7と言いました。数学も同意します。",
    },
    "ko": {
        "facts.science.p1": "연구자들은 서로 다른 나라의 낯선 사람들로 이루어진 {gold}32쌍{/gold}의 무관한 닮은꼴을 모아 세계에서 가장 발전된 세 가지 얼굴 인식 시스템으로 분석했습니다.",
        "facts.science.p2": "쌍의 {gold}75% 이상{/gold}이 동일인으로 분류되었습니다. 일란성 쌍둥이에 사용되는 것과 같은 분류입니다.",
        "facts.rarity.p1": "인간의 얼굴은 단 {gold}43개의 측정 가능한 기하학적 포인트{/gold}로 만들어집니다 — 눈 사이의 거리, 턱의 너비, 콧대의 높이, 입술의 곡선. 그게 전부입니다.",
        "facts.rarity.p2": "80억 명과 진정으로 고유한 얼굴 프로필은 약 10억에 불과하므로, 지구상의 모든 얼굴은 살아 있는 사람들 사이에서 {gold}4~8번{/gold} 어딘가에서 반복됩니다. 고대 예언자들은 7이라고 했습니다. 수학도 동의합니다.",
    },
    "zh": {
        "facts.science.p1": "研究人员选取了{gold}32对{/gold}无关联的人类相似面孔 — 来自不同国家、从未谋面的陌生人 — 并将他们的面孔输入世界上三个最先进的面部识别系统。",
        "facts.science.p2": "超过{gold}75%{/gold}的配对被归类为同一个人。与用于同卵双胞胎的分类标准相同。",
        "facts.rarity.p1": "人类的面孔仅由{gold}43个可测量的几何点{/gold}构成 — 双眼间距、下颌宽度、鼻梁高度、嘴唇曲线。仅此而已。",
        "facts.rarity.p2": "在80亿人口中，真正独特的面部轮廓只有约10亿，地球上每张面孔在生者中会在某处重复{gold}4到8次{/gold}。古代先知说是7。数学也同意。",
    },
    "id": {
        "facts.science.p1": "Peneliti mengambil {gold}32 pasang{/gold} kembaran wajah manusia yang tidak terkait — orang asing dari negara berbeda yang belum pernah bertemu — dan menjalankan wajah mereka melalui tiga sistem pengenalan wajah tercanggih di dunia.",
        "facts.science.p2": "Lebih dari {gold}75%{/gold} pasangan diklasifikasikan sebagai orang yang sama. Klasifikasi yang sama digunakan untuk kembar identik.",
        "facts.rarity.p1": "Wajah manusia dibangun dari hanya {gold}43 titik geometris terukur{/gold} — jarak antara mata, lebar rahang, tinggi batang hidung, lekukan bibir. Hanya itu.",
        "facts.rarity.p2": "Dengan 8 miliar orang dan hanya ~1 miliar profil wajah yang benar-benar unik, setiap wajah di Bumi berulang antara {gold}4 dan 8 kali{/gold} di antara yang hidup. Para peramal kuno mengatakan 7. Matematika setuju.",
    },
    "tl": {
        "facts.science.p1": "Kinuha ng mga mananaliksik ang {gold}32 pares{/gold} ng hindi kaugnay na kamukha ng tao — mga estranghero mula sa iba't ibang bansa na hindi pa nagkikita — at pinatakbo ang kanilang mga mukha sa tatlong pinaka-advanced na facial recognition system sa mundo.",
        "facts.science.p2": "Mahigit {gold}75%{/gold} ng mga pares ay na-classify bilang parehong tao. Parehong klasipikasyon na ginagamit para sa kambal na magkapareho.",
        "facts.rarity.p1": "Ang mukha ng tao ay binuo mula sa {gold}43 measurable geometric points{/gold} lamang — ang distansya sa pagitan ng iyong mga mata, lapad ng panga, taas ng tulay ng ilong, kurba ng labi. Iyon lang.",
        "facts.rarity.p2": "Sa 8 bilyong tao at ~1 bilyong tunay na natatanging facial profile, bawat mukha sa Earth ay umuulit sa pagitan ng {gold}4 at 8 beses{/gold} sa mga buhay. Sinabi ng mga sinaunang seer ang 7. Sumasang-ayon ang matematika.",
    },
}

import sys
sys.path.insert(0, str(Path(__file__).parent))
from flow_data import OVERLAY_EN, HI
from flow_data_langs import ES, PT, JA, KO, ZH, ID, TL

TRANSLATIONS = {
    "en": OVERLAY_EN,
    "hi": HI,
    "es": ES,
    "pt": PT,
    "ja": JA,
    "ko": KO,
    "zh": ZH,
    "id": ID,
    "tl": TL,
}


def main():
    with open(TRANS_PATH, encoding="utf-8") as f:
        data = json.load(f)

    for lang, keys in TRANSLATIONS.items():
        if lang not in data:
            continue
        for key, value in keys.items():
            data[lang][key] = value

    for lang, keys in GOLD_FACTS.items():
        if lang not in data:
            continue
        for key, value in keys.items():
            data[lang][key] = value

    # Ensure en has overlay + placeholder keys
    en_overlay = TRANSLATIONS.get("en", {})
    for key in FLOW_KEYS:
        if key not in data["en"] and key in en_overlay:
            data["en"][key] = en_overlay[key]

    with open(TRANS_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    for lang in ["hi", "es", "pt", "ja", "ko", "zh", "id", "tl"]:
        en = data["en"]
        same = sum(
            1 for k in FLOW_KEYS
            if k in en and data[lang].get(k) == en[k] and k not in SKIP_SAME_AS_EN
        )
        print(f"{lang}: {same} flow keys still match English")


if __name__ == "__main__":
    main()
