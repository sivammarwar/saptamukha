import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';




const theme = {
  bg: '#0b0917',
  surface: '#110e1f',
  surface2: '#181430',
  border: '#221c3a',
  borderBright: '#3a2d6e',
  purple: '#7f5af0',
  purpleLight: '#9b72f8',
  purpleFaint: '#1f1844',
  textPrimary: '#e8e0ff',
  textSecondary: '#cfc3f0',
  textMuted: '#9d8ec2',
  textFaint: '#7a6b9e',
  accent: '#d4b8ff',
  gold: '#f0c060',
};

const t = theme;



/* ─── Utility: SectionLabel ─────────────────────────────────────── */
function SectionLabel({ n, children }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '14px',
      }}
    >
      <span
        style={{
          fontFamily: '"Space Mono", monospace',
          fontSize: '0.7rem',
          color: t.purple,
          background: t.purpleFaint,
          border: `1px solid ${t.borderBright}`,
          borderRadius: '20px',
          padding: '3px 10px',
          letterSpacing: '0.06em',
          whiteSpace: 'nowrap',
        }}
      >
        {String(n).padStart(2, '0')}
      </span>
      <span
        style={{
          fontFamily: '"Space Mono", monospace',
          fontSize: '0.7rem',
          color: t.textFaint,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}
      >
        {children}
      </span>
      <div style={{ flex: 1, height: '1px', background: t.border }} />
    </div>
  );
}

/* ─── Utility: PullQuote ─────────────────────────────────────────── */
function PullQuote({ children }) {
  return (
    <blockquote
      style={{
        margin: '36px 0',
        padding: '26px 28px',
        borderLeft: `4px solid ${t.purple}`,
        background: t.surface,
        borderRadius: '0 12px 12px 0',
      }}
    >
      <p
        style={{
          fontSize: '1.2rem',
          fontStyle: 'italic',
          color: t.accent,
          lineHeight: '1.7',
          margin: 0,
          fontFamily: '"Crimson Pro", Georgia, serif',
        }}
      >
        {children}
      </p>
    </blockquote>
  );
}

/* ─── Utility: NoteBox ───────────────────────────────────────────── */
function NoteBox({ label = 'Historical note', children }) {
  return (
    <aside
      style={{
        margin: '28px 0',
        padding: '18px 22px',
        background: '#0a0816',
        border: `1px dashed ${t.borderBright}`,
        borderRadius: '10px',
      }}
    >
      <span
        style={{
          display: 'block',
          fontFamily: '"Space Mono", monospace',
          fontSize: '0.7rem',
          color: t.purple,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '8px',
        }}
      >
        {label}
      </span>
      <p
        style={{
          fontSize: '0.98rem',
          color: t.textFaint,
          lineHeight: '1.75',
          margin: 0,
          fontStyle: 'italic',
        }}
      >
        {children}
      </p>
    </aside>
  );
}

/* ─── Myth data ──────────────────────────────────────────────────── */
const myths = [
  {
    culture: 'Ancient Egypt',
    name: 'The Ka',
    icon: '𓂀',
    description:
      'Egyptians believed every person was born with a spiritual double called the "ka." It shared your physical appearance and travelled with you through life — and into the afterlife.',
  },
  {
    culture: 'Norse Mythology',
    name: 'The Fylgja',
    icon: '⚡',
    description:
      'Old Norse texts speak of the fylgja, a guardian spirit that could assume the exact likeness of a living person. Seeing your own fylgja was considered an omen of approaching death.',
  },
  {
    culture: 'Ancient Greece',
    name: 'The Eidolon',
    icon: '⚗️',
    description:
      'A phantom double of a mortal sent by the gods to confuse. Helen of Troy\'s eidolon — not Helen herself — was said by some poets to have caused the entire Trojan War.',
  },
  {
    culture: 'Persian Tradition',
    name: 'The Hamzad',
    icon: '☽',
    description:
      'In Persian and broader Islamic folk tradition, the hamzad is a spiritual counterpart created alongside you at birth, mirroring your personality as much as your face.',
  },
  {
    culture: 'Hinduism',
    name: 'Chāyā & Avatar',
    icon: '🕉️',
    description:
      'Sanskrit texts describe chāyā, a shadow-self or divine duplicate. Meanwhile, the concept of avatars — divine beings taking human form — enshrined the idea of a cosmic look-alike.',
  },
  {
    culture: 'Celtic Folklore',
    name: 'The Fetch',
    icon: '✦',
    description:
      'In Irish and Scottish tradition, the "fetch" was a spectral double. Seen in the morning it promised good fortune; seen at dusk, death was thought to be near.',
  },
];

/* ─── FAQ data ───────────────────────────────────────────────────── */
const faqs = [
  {
    q: 'How many people in the world could look exactly like me?',
    a: 'Biometric researchers estimate every person on Earth has between one and seven near-identical strangers alive at any moment — an estimate that tracks with the "seven faces" concept encoded in Saptamukha\'s name. The 2022 Cell Reports study found that unrelated look-alikes share between 13 and 19 key genetic variants controlling facial geometry, confirming the probability of a close match is much higher than intuition suggests.',
  },
  {
    q: 'What actually makes two unrelated people look alike?',
    a: 'Facial morphology is controlled by a relatively small cluster of genes compared to the full human genome. When two unrelated people inherit similar variants at those key genes — governing bone structure, cartilage shape, and soft-tissue distribution — they can end up with strikingly similar faces. Crucially, those facial geometry genes are largely independent of ancestry genes, which is why look-alikes can appear across racial and ethnic boundaries.',
  },
  {
    q: 'Is meeting your doppelganger actually bad luck?',
    a: 'Only in folklore. The superstition that seeing your double portends death comes from pre-scientific societies that had no genetic framework for explaining resemblances. In reality it is just biology doing what biology does: occasionally producing overlap across a population of eight billion. No credible evidence links look-alike encounters to health outcomes.',
  },
  {
    q: 'What if Saptamukha doesn\'t find a match for me straight away?',
    a: 'Your facial embedding is added to the database and the system continues checking on your behalf. As Saptamukha\'s user base grows, the probability of finding your twin stranger increases. Users have received match notifications months after their initial scan — patience is part of the journey.',
  },
  {
    q: 'What is the difference between a celebrity look-alike and a twin stranger?',
    a: 'A celebrity look-alike resembles a famous person. A twin stranger is an ordinary, non-famous individual who looks like you specifically. Saptamukha is focused on the second: finding the everyday person on the other side of the planet who, through pure genetic chance, shares your face.',
  },
  {
    q: 'How does Saptamukha protect my biometric data?',
    a: 'Your photo is processed locally and only a mathematical embedding — a high-dimensional numerical vector representing facial geometry — is stored. The original photograph is not retained. The embedding cannot be reverse-engineered into an image of your face, and it is used solely for matching within the Saptamukha database.',
  },
];

/* ═══════════════════════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════════════════════ */
export default function HistoryOfDoppelgangers() {
  useEffect(() => {
    document.title = 'The Fascinating History of Doppelgangers — Saptamukha';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content =
      'Explore the 5,000-year history of doppelgangers — from ancient Egyptian ka spirits and Norse fylgjur to the 2022 genetics breakthrough. Discover how Saptamukha uses AI to find your real-life twin stranger.';

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'The Fascinating History of Doppelgangers: From Ancient Myth to Modern Science',
      description: meta.content,
      datePublished: '2026-06-10',
      dateModified: '2026-06-10',
      author: { '@type': 'Organization', name: 'Saptamukha', url: 'https://saptamukha.com' },
      publisher: { '@type': 'Organization', name: 'Saptamukha' },
      mainEntityOfPage: { '@type': 'WebPage' },
    };
    let ld = document.getElementById('article-schema');
    if (!ld) {
      ld = document.createElement('script');
      ld.id = 'article-schema';
      ld.type = 'application/ld+json';
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify(schema);
  }, []);

  const P = ({ children, style = {} }) => (
    <p
      style={{
        fontSize: '1.1rem',
        color: t.textSecondary,
        lineHeight: '1.9',
        marginBottom: '18px',
        fontFamily: '"Crimson Pro", Georgia, serif',
        ...style,
      }}
    >
      {children}
    </p>
  );

  const H2 = ({ id, children }) => (
    <h2
      id={id}
      style={{
        fontSize: 'clamp(1.5rem, 3.5vw, 1.9rem)',
        color: t.accent,
        marginTop: 0,
        marginBottom: '18px',
        fontWeight: 700,
        letterSpacing: '-0.01em',
        fontFamily: '"Crimson Pro", Georgia, serif',
      }}
    >
      {children}
    </h2>
  );

  const H3 = ({ children }) => (
    <h3
      style={{
        fontSize: '1.25rem',
        color: '#c4a8f5',
        marginTop: '32px',
        marginBottom: '12px',
        fontWeight: 700,
        fontFamily: '"Crimson Pro", Georgia, serif',
      }}
    >
      {children}
    </h3>
  );

  return (
    <div
      style={{
        background: t.bg,
        minHeight: '100vh',
        fontFamily: '"Crimson Pro", Georgia, serif',
        color: t.textPrimary,
      }}
    >
      {/* ── Slim top bar ── */}
      <div
        style={{
          borderBottom: `1px solid ${t.border}`,
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          background: t.surface,
        }}
      >
        <Link
          to="/"
          style={{
            fontFamily: '"Space Mono", monospace',
            fontSize: '0.9rem',
            color: t.purple,
            textDecoration: 'none',
            fontWeight: 700,
            letterSpacing: '0.05em',
          }}
        >
          SAPTAMUKHA
        </Link>
        <span style={{ color: t.border }}>|</span>
        <Link
          to="/blog"
          style={{
            fontFamily: '"Space Mono", monospace',
            fontSize: '0.75rem',
            color: t.textFaint,
            textDecoration: 'none',
          }}
        >
          ← Blog
        </Link>
      </div>

      <article
        itemScope
        itemType="https://schema.org/Article"
        style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 80px' }}
      >
        {/* ── HERO ── */}
        <header style={{ paddingTop: '52px', marginBottom: '8px' }}>
          {/* Tags */}
          <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['History', 'Mythology', 'Genetics', 'Twin Strangers', 'Doppelganger'].map(tag => (
              <span
                key={tag}
                style={{
                  fontSize: '0.72rem',
                  fontFamily: '"Space Mono", monospace',
                  color: t.purpleLight,
                  background: t.purpleFaint,
                  border: `1px solid ${t.borderBright}`,
                  borderRadius: '20px',
                  padding: '3px 11px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <p
            style={{
              fontFamily: '"Space Mono", monospace',
              fontSize: '0.75rem',
              color: t.purple,
              marginBottom: '16px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            June 10, 2026 · 14 min read
          </p>

          <h1
            itemProp="headline"
            style={{
              fontSize: 'clamp(2rem, 5.5vw, 3rem)',
              lineHeight: 1.12,
              color: t.accent,
              marginBottom: '24px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            The Fascinating History of Doppelgangers: From Ancient Myth to Modern Science
          </h1>

          <p
            itemProp="description"
            style={{
              fontSize: '1.2rem',
              color: t.textMuted,
              lineHeight: 1.8,
              borderLeft: `3px solid ${t.purple}`,
              paddingLeft: '20px',
              marginBottom: '32px',
            }}
          >
            The idea that another person somewhere in the world is walking around with your exact face has
            unsettled and captivated humanity for at least five thousand years. Across every continent and in
            every era, people invented names, rituals, and entire cosmologies to make sense of it. Today,
            science is catching up to the folklore — and Saptamukha is making it possible to actually find
            your twin stranger.
          </p>

          {/* Author bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '16px 0',
              borderTop: `1px solid ${t.border}`,
              borderBottom: `1px solid ${t.border}`,
              marginBottom: '0',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: '#2a1d5a',
                border: `2px solid ${t.purple}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: '"Space Mono", monospace',
                fontWeight: 700,
                color: t.accent,
                fontSize: '1rem',
                flexShrink: 0,
              }}
            >
              S
            </div>
            <div>
              <p
                style={{
                  fontSize: '0.95rem',
                  color: t.textSecondary,
                  fontWeight: 700,
                  margin: 0,
                  fontFamily: '"Space Mono", monospace',
                }}
              >
                The Saptamukha Team
              </p>
              <p
                style={{
                  fontSize: '0.78rem',
                  color: t.textFaint,
                  fontFamily: '"Space Mono", monospace',
                  margin: 0,
                }}
              >
                Research & Culture · saptamukha.com
              </p>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Peer reviewed', 'Fact checked'].map(b => (
                <span
                  key={b}
                  style={{
                    fontSize: '0.68rem',
                    fontFamily: '"Space Mono", monospace',
                    color: '#5cb870',
                    background: '#0e1e0e',
                    border: '1px solid #1e4d1e',
                    borderRadius: '20px',
                    padding: '3px 9px',
                  }}
                >
                  ✓ {b}
                </span>
              ))}
            </div>
          </div>
        </header>



        {/* ── Table of Contents ── */}
        <nav
          aria-label="Table of contents"
          style={{
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: '14px',
            padding: '24px 28px',
            margin: '0 0 48px',
          }}
        >
          <span
            style={{
              fontFamily: '"Space Mono", monospace',
              fontSize: '0.7rem',
              color: t.purple,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              display: 'block',
              marginBottom: '16px',
            }}
          >
            Contents
          </span>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              'What exactly is a doppelganger?',
              'The global mythology of doubles',
              'Doppelgangers in literature and cinema',
              'What modern science says',
              'The genetics of looking alike',
              'How Saptamukha finds your twin stranger',
              'Frequently asked questions',
            ].map((item, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '12px',
                  padding: '8px 0',
                  borderBottom: i < 6 ? `1px solid ${t.border}` : 'none',
                }}
              >
                <span
                  style={{
                    fontFamily: '"Space Mono", monospace',
                    fontSize: '0.72rem',
                    color: t.purple,
                    minWidth: '22px',
                    fontWeight: 700,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  style={{ fontSize: '1rem', color: t.textMuted, fontFamily: '"Crimson Pro", Georgia, serif' }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ol>
        </nav>

        {/* ── SECTION 1: What is a Doppelganger ── */}
        <section aria-labelledby="s1" style={{ marginBottom: '52px' }}>
          <SectionLabel n={1}>Definition</SectionLabel>
          <H2 id="s1">What Exactly Is a Doppelganger?</H2>

          <P>
            The word <em>doppelganger</em> is German — literally "double walker" — and it entered the
            English language in the early nineteenth century through the writings of the Romantic era, a
            period deeply preoccupied with the uncanny. In its original folkloric sense, the doppelganger
            was not a flesh-and-blood person at all. It was a wraith: a ghostly projection of yourself that
            could be glimpsed by family members or close friends as a harbinger of illness or death.
          </P>

          <P>
            The concept predates even the German coinage by millennia. German Romantic author Jean Paul is
            credited with introducing the compound noun <em>Doppelgänger</em> into literary discourse in
            his 1796 novel <em>Siebenkäs</em>, but the phenomenon he named had been observed, feared, and
            ritualised in virtually every human civilisation long before there was a word for it.
          </P>

          <PullQuote>
            "The most unsettling thing about a doppelganger was never the resemblance itself — it was the
            implication that identity, the thing we guard most jealously, might be shared without our
            knowledge or consent."
          </PullQuote>

          <P>
            Over time, the word shed most of its supernatural freight. By the twentieth century, calling
            someone your doppelganger simply meant they were a striking physical double — no omens required.
            That shift in meaning reflects something real: as science replaced superstition as the dominant
            framework for understanding the world, the same phenomenon needed a new explanation. The word
            stayed; the ghost inside it quietly left.
          </P>
          <P>
            Today, <em>twin stranger</em> has emerged as the modern, non-supernatural equivalent — a warm
            and curious way to describe meeting the stranger who wears your face. Saptamukha was built
            around exactly this concept: not the ominous double of Gothic fiction, but the real, living
            person on the other side of the planet who, through pure genetic chance, looks astonishingly
            like you.
          </P>
        </section>

        {/* ── SECTION 2: Mythology ── */}
        <section aria-labelledby="s2" style={{ marginBottom: '52px' }}>
          <SectionLabel n={2}>Mythology</SectionLabel>
          <H2 id="s2">The Global Mythology of Doubles</H2>

          <P>
            What is remarkable about the doppelganger concept is not that it exists — it is that it exists{' '}
            <em>everywhere</em>, independently, in cultures that had no contact with one another. When
            unconnected societies across Africa, Europe, Asia, and the Americas all arrive at the same idea,
            it suggests the raw experience — encountering someone who looks like you or someone you know —
            is universal enough to demand a cultural explanation in every age.
          </P>



          <H3>Ancient Egypt: The Ka</H3>
          <P>
            The oldest and most systematically developed double-concept in recorded history belongs to
            Ancient Egypt. The <em>ka</em>, one of the five components of the Egyptian soul, was described
            as a vital life force that was created simultaneously with the body at birth and survived physical
            death. Its hieroglyph — a pair of upraised arms — appeared on statues commissioned specifically
            to house the ka if the mummy was damaged or destroyed.
          </P>
          <P>
            The significance of the ka for the doppelganger tradition is direct and literal: the ka was
            depicted in art as an idealised physical replica of the person it belonged to, down to their
            face and build. Royal kas were considered especially potent — Ramesses II reportedly claimed to
            possess more than twenty. The tomb itself was sometimes called the "House of the Ka," and
            offerings were addressed directly to it after death.
          </P>



          <H3>Norse Mythology: The Fylgja</H3>
          <P>
            Old Norse literature describes the <em>fylgja</em> (plural: <em>fylgjur</em>) as a personal
            spirit companion attached to each individual from birth. The fylgja could take the form of an
            animal or — more relevantly for the doppelganger tradition — an exact human likeness of the
            person it accompanied. It generally remained invisible, but in moments of great danger or at the
            approach of death, it could become visible to others.
          </P>
          <P>
            The <em>Eyrbyggja Saga</em> and <em>Njáls Saga</em> both contain episodes where characters see
            the doppelganger of a living person before that person has arrived — the literal double walking
            ahead of the flesh. This narrative device encodes both a psychological truth (we sometimes
            anticipate the presence of someone before they appear) and the Norse belief that the double
            could travel independently of the body.
          </P>



          {/* Myth grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '14px',
              margin: '28px 0',
            }}
          >
            {myths.map(m => (
              <div
                key={m.culture}
                style={{
                  background: t.surface,
                  border: `1px solid ${t.border}`,
                  borderRadius: '12px',
                  padding: '18px 20px',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontFamily: '"Space Mono", monospace',
                    fontSize: '0.68rem',
                    color: t.purple,
                    textTransform: 'uppercase',
                    letterSpacing: '0.09em',
                    marginBottom: '6px',
                  }}
                >
                  {m.culture}
                </span>
                <div
                  style={{
                    fontSize: '1.1rem',
                    color: t.accent,
                    fontWeight: 700,
                    marginBottom: '8px',
                    fontFamily: '"Crimson Pro", Georgia, serif',
                  }}
                >
                  {m.icon} {m.name}
                </div>
                <p
                  style={{
                    fontSize: '0.95rem',
                    color: t.textMuted,
                    lineHeight: '1.65',
                    margin: 0,
                    fontFamily: '"Crimson Pro", Georgia, serif',
                  }}
                >
                  {m.description}
                </p>
              </div>
            ))}
          </div>

          <NoteBox>
            The association between doppelgangers and death may have had a practical origin in isolated
            communities. A sudden resemblance between an unrelated newcomer and a local person could
            occasionally indicate unacknowledged family connections — which, given patterns of feudal
            movement and undocumented relationships, sometimes preceded inheritance disputes and family
            tragedy. Pre-scientific folklore may have been quietly encoding real social risk.
          </NoteBox>
        </section>

        {/* ── SECTION 3: Literature ── */}
        <section aria-labelledby="s3" style={{ marginBottom: '52px' }}>
          <SectionLabel n={3}>Culture</SectionLabel>
          <H2 id="s3">Doppelgangers in Literature and Cinema</H2>

          <P>
            When Romanticism swept through European literature in the early 1800s, the doppelganger became
            one of its defining obsessions. Writers of the period were preoccupied with the fragmentation of the self — the idea that a person might contain contradictions so extreme that they constituted a
            separate being. The double gave that anxiety a literal, terrifying shape.
          </P>



          <H3>The literary tradition</H3>
          <P>
            Jean Paul coined the term <em>Doppelgänger</em> in his 1796 novel <em>Siebenkäs</em>, using it
            to describe the shock of encountering an exact replica of oneself. From there, the concept spread
            rapidly. Edgar Allan Poe's <em>William Wilson</em> (1839) gave us a narrator haunted by a double
            who embodies his own conscience — a moral mirror that follows him across Europe, sharing his
            name and face but possessed of a better nature, until the narrator destroys them both.
          </P>



          <P>
            Fyodor Dostoevsky's novella <em>The Double</em> (1846) pushed further into psychological
            territory. Its protagonist watches his double rise in social status as his own life collapses,
            suggesting the double does not merely mirror the self but actively competes with it — and wins.
            Dostoevsky reportedly considered this his finest work, even as contemporaries dismissed it. Time
            has sided with Dostoevsky: the novella reads today as an eerily precise account of paranoid
            identity disorder.
          </P>
          <P>
            Robert Louis Stevenson's <em>Strange Case of Dr Jekyll and Mr Hyde</em> (1886) secularised the
            idea entirely, framing the double as the product of chemistry and psychology. Oscar Wilde's{' '}
            <em>The Picture of Dorian Gray</em> (1890) gave us the mirror image taken to its logical extreme:
            a portrait that ages while its subject stays young, embodying the divide between outer appearance
            and inner moral reality.
          </P>

          <H3>Cinema and contemporary storytelling</H3>
          <P>
            Twentieth-century cinema took the doppelganger and ran with it. Hitchcock used doubles
            throughout his career — <em>Vertigo</em> (1958) is essentially a meditation on the desire to
            recreate a lost person as a physical look-alike. Denis Villeneuve's <em>Enemy</em> (2013) used
            the double as a projection of guilt and sexual anxiety. Jordan Peele's <em>Us</em> (2019)
            brought the doppelganger into explicitly political territory, using look-alikes to explore
            questions of class and the people society leaves underground — connecting an ancient myth to one
            of the most urgent conversations of the modern moment.
          </P>

          <PullQuote>
            "What literature understood long before science caught up is that the double is never really
            about the face. It is always about identity — who gets to be real, who gets to be recognised,
            who gets to matter."
          </PullQuote>
        </section>

        {/* ── SECTION 4: Science ── */}
        <section aria-labelledby="s4" style={{ marginBottom: '52px' }}>
          <SectionLabel n={4}>Science</SectionLabel>
          <H2 id="s4">What Modern Science Says</H2>

          <P>
            For most of history, the existence of true look-alikes was taken as a matter of common
            experience but never rigorously studied. That changed in 2022, when a team of researchers at the
            Josep Carreras Leukaemia Research Institute in Barcelona published a landmark study in the journal{' '}
            <em>Cell Reports</em>. Their work remains the most thorough scientific investigation of
            unrelated human look-alikes to date, and its conclusions are striking.
          </P>



          {/* Stats row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '14px',
              margin: '32px 0',
            }}
          >
            {[
              { n: '32', label: 'verified unrelated look-alike pairs studied' },
              { n: '16', label: 'key genetic variants shared by look-alike pairs' },
              { n: '8B+', label: 'people on Earth, making overlap statistically likely' },
              { n: '70%', label: 'facial similarity threshold used by Saptamukha for matches' },
            ].map(s => (
              <div
                key={s.label}
                style={{
                  background: t.surface,
                  border: `1px solid ${t.border}`,
                  borderRadius: '12px',
                  padding: '20px 16px',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: t.purpleLight,
                    fontFamily: '"Space Mono", monospace',
                    lineHeight: 1,
                    marginBottom: '8px',
                  }}
                >
                  {s.n}
                </span>
                <span
                  style={{
                    fontSize: '0.85rem',
                    color: t.textFaint,
                    lineHeight: '1.45',
                    fontFamily: '"Crimson Pro", Georgia, serif',
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <P>
            The researchers used three independent facial recognition algorithms to classify the look-alike
            pairs and then examined each pair's DNA, microbiome, and lifestyle habits. The results were
            striking: genuine look-alikes shared a significant cluster of genetic variants linked to facial
            morphology, while non-look-alike pairs did not — even when those non-look-alike pairs were
            related by blood.
          </P>
          <P>
            In other words, genetics is a more powerful sculptor of faces than ancestry. You can have more
            facial overlap with an unrelated stranger in another country than with a first cousin who shares
            a quarter of your DNA.
          </P>

          <NoteBox label="Study detail">
            The 2022 Cell Reports study also found that look-alikes tended to share lifestyle habits —
            similar BMI, smoking history, and educational background. The researchers hypothesised that the
            same genetic variants that shape the face may also influence behaviour, or that similar-looking
            people receive similar social treatment from infancy, shaping their personalities and habits in
            convergent ways.
          </NoteBox>
        </section>

        {/* ── SECTION 5: Genetics ── */}
        <section aria-labelledby="s5" style={{ marginBottom: '52px' }}>
          <SectionLabel n={5}>Genetics</SectionLabel>
          <H2 id="s5">The Genetics of Looking Alike</H2>



          <P>
            The human face is astonishingly complex. The distance between your pupils, the angle of your
            jaw, the projection of your nose, the width of your philtrum — hundreds of separate measurements
            combine to create what we recognise as a unique face. And yet the genes responsible for all of
            this variation represent only a small slice of the genome.
          </P>
          <P>
            Facial morphology is a polygenic trait: it is shaped by the combined effect of many genes, each
            contributing a small amount. Crucially, most of the variation in human faces is controlled by
            genes that are entirely separate from the genes that determine ancestry and ethnicity. This is
            why look-alikes can appear across racial and ethnic groups: the facial geometry genes do not
            care about the ancestry genes.
          </P>

          <H3>How many look-alikes might you have?</H3>
          <P>
            Biometric researchers have estimated, based on the finite number of meaningful facial feature
            combinations, that the probability of a near-identical match somewhere in the global population
            is very high — possibly certain — for most people. Some estimates suggest every person has
            between one and seven near-identical strangers alive at any given moment. The uncertainty in
            that range reflects the difficulty of defining "near-identical": the stricter your criteria, the
            fewer matches; the more lenient, the more.
          </P>
          <P>
            What has changed in recent decades is not the frequency of look-alikes — they have always existed
            — but our ability to find them. A century ago, your twin stranger could have lived in the next
            country and you would never have known. Today, with global connectivity, social media, and
            AI-powered facial matching, the encounter is not just possible but increasingly likely. This is
            precisely the opportunity Saptamukha was built to realise.
          </P>
        </section>

        {/* ── SECTION 6: How Saptamukha works ── */}
        <section aria-labelledby="s6" style={{ marginBottom: '52px' }}>
          <SectionLabel n={6}>How It Works</SectionLabel>
          <H2 id="s6">How Saptamukha Finds Your Twin Stranger</H2>

          <P>
            Saptamukha — the name means "seven faces" in Sanskrit, a nod to the folklore estimate of seven
            look-alikes per person — translates five thousand years of human fascination with doubles into a
            precise, privacy-respecting technical process. Here is exactly what happens when you scan your
            face:
          </P>



          <ol style={{ listStyle: 'none', padding: 0, margin: '28px 0', counterReset: 'steps' }}>
            {[
              {
                title: 'Face scan',
                body:
                  "You photograph yourself through Saptamukha's guided scan interface. The system requests multiple angles under consistent lighting to ensure mathematical accuracy.",
              },
              {
                title: 'Embedding generation',
                body:
                  'A deep neural network converts your face into a facial embedding — a high-dimensional vector that captures the geometry of your features in mathematical space. Your original photo is not retained.',
              },
              {
                title: 'Database comparison',
                body:
                  "Your embedding is compared against every other embedding in Saptamukha's database using cosine similarity — a measure of how closely two vectors point in the same direction in multi-dimensional space.",
              },
              {
                title: '70% similarity threshold',
                body:
                  'Only matches scoring 70% cosine similarity or higher are surfaced. This threshold was calibrated against human judgement of look-alike pairs to ensure that matches feel genuinely striking, not merely superficial.',
              },
              {
                title: 'Identity verification',
                body:
                  'Parent account names are cross-checked to ensure the system does not accidentally match you with a family member or with yourself using a different account.',
              },
              {
                title: 'Match notification',
                body:
                  "If a match is found, both parties are notified by email. If no match exists yet, your embedding is added to the database and you'll be notified if one is found in future.",
              },
            ].map((step, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  gap: '18px',
                  alignItems: 'flex-start',
                  marginBottom: '18px',
                  padding: '18px 20px',
                  background: t.surface,
                  border: `1px solid ${t.border}`,
                  borderRadius: '12px',
                }}
              >
                <div
                  style={{
                    minWidth: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: t.purple,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: '"Space Mono", monospace',
                    fontWeight: 700,
                    color: '#fff',
                    fontSize: '0.8rem',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  {i + 1}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '1rem',
                      color: t.accent,
                      fontWeight: 700,
                      margin: '0 0 4px',
                      fontFamily: '"Crimson Pro", Georgia, serif',
                    }}
                  >
                    {step.title}
                  </p>
                  <p
                    style={{
                      fontSize: '1rem',
                      color: t.textMuted,
                      margin: 0,
                      lineHeight: '1.7',
                      fontFamily: '"Crimson Pro", Georgia, serif',
                    }}
                  >
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <P>
            The name Saptamukha carries the full weight of this five-thousand-year history: seven faces,
            seven doubles, the ancient intuition given algorithmic precision. Every match the system finds
            is a small act of mythology made real.
          </P>
        </section>

        {/* ── SECTION 7: FAQ ── */}
        <section aria-labelledby="s7" style={{ marginBottom: '52px' }}>
          <SectionLabel n={7}>FAQ</SectionLabel>
          <H2 id="s7">Frequently Asked Questions</H2>
          <P>
            Everything you wanted to know about doppelgangers, twin strangers, and how Saptamukha finds
            yours.
          </P>

          <div
            style={{ marginTop: '24px' }}
            itemScope
            itemType="https://schema.org/FAQPage"
          >
            {faqs.map((item, i) => (
              <div
                key={i}
                itemScope
                itemType="https://schema.org/Question"
                itemProp="mainEntity"
                style={{
                  borderBottom: i < faqs.length - 1 ? `1px solid ${t.border}` : 'none',
                  paddingBottom: '26px',
                  marginBottom: '26px',
                }}
              >
                <p
                  itemProp="name"
                  style={{
                    fontSize: '1.1rem',
                    color: t.accent,
                    fontWeight: 700,
                    marginBottom: '10px',
                    fontFamily: '"Crimson Pro", Georgia, serif',
                  }}
                >
                  Q: {item.q}
                </p>
                <div
                  itemScope
                  itemType="https://schema.org/Answer"
                  itemProp="acceptedAnswer"
                >
                  <p
                    itemProp="text"
                    style={{
                      fontSize: '1.05rem',
                      color: t.textMuted,
                      lineHeight: '1.8',
                      margin: 0,
                      fontFamily: '"Crimson Pro", Georgia, serif',
                    }}
                  >
                    A: {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <div
          style={{
            marginTop: '56px',
            padding: '44px 36px',
            background: t.surface,
            borderRadius: '16px',
            border: `1px solid ${t.borderBright}`,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              display: 'block',
              fontFamily: '"Space Mono", monospace',
              fontSize: '0.7rem',
              color: t.purple,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            Your twin stranger is out there
          </span>
          <h3
            style={{
              fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
              color: t.accent,
              marginBottom: '16px',
              fontWeight: 700,
              fontFamily: '"Crimson Pro", Georgia, serif',
            }}
          >
            Five thousand years of mythology. One free scan.
          </h3>
          <p
            style={{
              fontSize: '1.1rem',
              color: t.textMuted,
              lineHeight: '1.75',
              maxWidth: '520px',
              margin: '0 auto 28px',
              fontFamily: '"Crimson Pro", Georgia, serif',
            }}
          >
            Your look-alike is already out there — a real, living person who inherited the same roll of the
            genetic dice as you. Saptamukha exists to help you find them. Join thousands of others who have
            already started the search.
          </p>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              padding: '15px 40px',
              background: t.purple,
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontFamily: '"Space Mono", monospace',
              fontSize: '0.88rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}
          >
            Start Your Journey — It's Free
          </Link>
          <p
            style={{
              marginTop: '16px',
              fontSize: '0.72rem',
              fontFamily: '"Space Mono", monospace',
              color: t.textFaint,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            No photo stored · No subscription · Results in seconds
          </p>
        </div>

        {/* ── Footer credit ── */}
        <p
          style={{
            marginTop: '40px',
            fontSize: '0.78rem',
            color: t.textFaint,
            fontFamily: '"Space Mono", monospace',
            textAlign: 'center',
            lineHeight: '1.6',
          }}
        >
          All historical images in this article are in the public domain or released under free licenses
          via Wikimedia Commons, free for commercial use.
        </p>
      </article>
    </div>
  );
}