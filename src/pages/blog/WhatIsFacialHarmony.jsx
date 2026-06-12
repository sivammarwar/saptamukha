import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function WhatIsFacialHarmony() {
  useEffect(() => {
    document.title = "What Is Facial Harmony? — The Science Behind Your Score | Saptamukha";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content = "Discover the science behind facial harmony and how Saptamukha calculates your unique harmony score. Learn about symmetry, proportions, and what makes faces aesthetically pleasing!";
    }
  }, []);

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '40px 20px', 
      color: '#e0d6ff',
      fontFamily: 'Crimson Pro, serif'
    }}>
      <nav style={{ marginBottom: '30px' }}>
        <Link to="/blog" style={{ 
          color: '#7f5af0',
          textDecoration: 'none',
          fontFamily: 'Space Mono, monospace',
          fontSize: '0.9rem'
        }}>
          ← Back to Blog
        </Link>
      </nav>

      <article>
        <header style={{ marginBottom: '40px' }}>
          <p style={{ 
            fontSize: '0.9rem', 
            color: '#7f5af0',
            fontFamily: 'Space Mono, monospace',
            marginBottom: '10px'
          }}>
            June 11, 2026 · 8 min read
          </p>
          <h1 style={{ 
            fontSize: '2.5rem', 
            lineHeight: '1.2',
            color: '#d4b8ff',
            marginBottom: '20px'
          }}>
            What Is Facial Harmony?
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#9d7fe3',
            lineHeight: '1.7'
          }}>
            Have you ever wondered why some faces are universally considered attractive? The secret might lie in facial harmony — a combination of symmetry, proportions, and balance that our brains naturally find pleasing. Here's how Saptamukha analyzes your face to give you your unique harmony score.
          </p>
        </header>

        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            color: '#d4b8ff',
            marginTop: '40px',
            marginBottom: '15px'
          }}>
            What Makes Up Your Facial Harmony Score?
          </h2>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '15px' }}>
            At Saptamukha, our AI analyzes your face from three angles to get the most complete picture. We look at many different factors, including:
          </p>
          <ul style={{ marginLeft: '25px', lineHeight: '2', fontSize: '1.1rem' }}>
            <li>Facial symmetry — how balanced the left and right sides of your face are</li>
            <li>Facial thirds — how evenly your face is divided into thirds</li>
            <li>Eye spacing — the distance between your eyes</li>
            <li>Nose proportions — how your nose fits with the rest of your face</li>
            <li>Lip ratio — the fullness and proportion of your lips</li>
            <li>Jawline definition — the shape of your jaw</li>
            <li>Profile harmony — how your side profile looks</li>
            <li>Overall facial balance</li>
          </ul>
        </section>

        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            color: '#d4b8ff',
            marginTop: '40px',
            marginBottom: '15px'
          }}>
            The History of Facial Harmony
          </h2>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '15px' }}>
            The idea that certain facial proportions are ideal isn't new. Ancient Greeks studied facial symmetry and the Golden Ratio (1:1.618) in their sculptures, believing it represented perfect beauty. Renaissance artists like Leonardo da Vinci used these same principles in their work.
          </p>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '15px' }}>
            But modern science has shown that while there are common patterns that many people find attractive, true beauty is subjective — and every face is unique and beautiful in its own way!
          </p>
        </section>

        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            color: '#d4b8ff',
            marginTop: '40px',
            marginBottom: '15px'
          }}>
            How Saptamukha Analyzes Your Face
          </h2>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '15px' }}>
            When you do your Mukha Darshan scan at Saptamukha:
          </p>
          <ol style={{ marginLeft: '25px', lineHeight: '2', fontSize: '1.1rem' }}>
            <li>First, you'll scan your face from the front</li>
            <li>Then from the left side</li>
            <li>Then from the right side</li>
            <li>Our AI will analyze all three angles</li>
            <li>You'll receive a detailed harmony score out of 100</li>
            <li>We'll also show you your strengths and areas that contribute to your unique look</li>
          </ol>
        </section>

        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            color: '#d4b8ff',
            marginTop: '40px',
            marginBottom: '15px'
          }}>
            Understanding Your Score
          </h2>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '15px' }}>
            Your facial harmony score is just a number — it doesn't define your beauty! Every face is unique, and the score is just a way to understand the mathematical and scientific aspects of your facial features.
          </p>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '15px' }}>
            We celebrate all faces at Saptamukha — your uniqueness is what makes you special!
          </p>
        </section>

        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            color: '#d4b8ff',
            marginTop: '40px',
            marginBottom: '25px'
          }}>
            Frequently Asked Questions About Facial Harmony
          </h2>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ 
              fontSize: '1.25rem', 
              color: '#e0d6ff', 
              marginBottom: '10px',
              fontWeight: '700'
            }}>
              Q: What's a good facial harmony score?
            </h4>
            <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#9d7fe3' }}>
              A: There's no single "perfect" score! Every face is beautiful in its own way. Your score is just a fun way to learn about your unique facial features!
            </p>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ 
              fontSize: '1.25rem', 
              color: '#e0d6ff', 
              marginBottom: '10px',
              fontWeight: '700'
            }}>
              Q: Why do you scan my face from three angles?
            </h4>
            <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#9d7fe3' }}>
              A: By scanning your front, left, and right views, we can analyze your face more completely and give you a more accurate harmony score!
            </p>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ 
              fontSize: '1.25rem', 
              color: '#e0d6ff', 
              marginBottom: '10px',
              fontWeight: '700'
            }}>
              Q: Can I improve my facial harmony score?
            </h4>
            <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#9d7fe3' }}>
              A: Your harmony score is just a snapshot of your natural features, which are perfect the way they are! But confidence and self-love will always make anyone shine!
            </p>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ 
              fontSize: '1.25rem', 
              color: '#e0d6ff', 
              marginBottom: '10px',
              fontWeight: '700'
            }}>
              Q: Is facial harmony the same thing as beauty?
            </h4>
            <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#9d7fe3' }}>
              A: No! Beauty is subjective and goes far beyond just facial proportions. Every face is beautiful in its own way!
            </p>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ 
              fontSize: '1.25rem', 
              color: '#e0d6ff', 
              marginBottom: '10px',
              fontWeight: '700'
            }}>
              Q: Is the facial harmony scan free?
            </h4>
            <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#9d7fe3' }}>
              A: Yes! The Mukha Darshan facial harmony scan is completely free at Saptamukha!
            </p>
          </div>
        </section>

        <section style={{ 
          marginTop: '50px', 
          padding: '30px', 
          backgroundColor: '#1a1a2e', 
          borderRadius: '12px',
          border: '1px solid #2a2a4a'
        }}>
          <h3 style={{ 
            fontSize: '1.5rem', 
            color: '#d4b8ff',
            marginBottom: '15px'
          }}>
            Get Your Facial Harmony Score Today
          </h3>
          <p style={{ lineHeight: '1.7', fontSize: '1.1rem', marginBottom: '20px' }}>
            Ready to discover your unique facial harmony score and learn about your own special features? Try Mukha Darshan at Saptamukha today!
          </p>
          <Link 
            to="/"
            style={{ 
              display: 'inline-block',
              padding: '12px 30px', 
              backgroundColor: '#7f5af0',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.95rem',
              fontWeight: '700',
              transition: 'background-color 0.3s ease'
            }}
          >
            Try Mukha Darshan
          </Link>
        </section>
      </article>
    </div>
  );
}
