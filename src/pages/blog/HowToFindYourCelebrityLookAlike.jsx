import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function HowToFindYourCelebrityLookAlike() {
  useEffect(() => {
    document.title = "How to Find Your Celebrity Look-Alike — Saptamukha";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content = "What celebrity do I look like? Learn how Saptamukha finds your famous twin using AI face recognition. Step-by-step guide included!";
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
            June 12, 2026 · 6 min read
          </p>
          <h1 style={{ 
            fontSize: '2.5rem', 
            lineHeight: '1.2',
            color: '#d4b8ff',
            marginBottom: '20px'
          }}>
            How to Find Your Celebrity Look-Alike
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#9d7fe3',
            lineHeight: '1.7'
          }}>
            We've all wondered: "Which celebrity do I look like?" At Saptamukha, finding your famous twin is just one part of your mystical journey. Here's exactly how it works.
          </p>
        </header>

        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            color: '#d4b8ff',
            marginTop: '40px',
            marginBottom: '15px'
          }}>
            Step 1: Start Your Saptamukha Journey
          </h2>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '15px' }}>
            To find your celebrity look-alike, you'll begin your Saptamukha experience the same way everyone does! Read and accept the mystical warning, then fill out your intake form with your name, age, country, email, and parent names.
          </p>
        </section>

        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            color: '#d4b8ff',
            marginTop: '40px',
            marginBottom: '15px'
          }}>
            Step 2: Scan Your Face
          </h2>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '15px' }}>
            Next is the face scan! Position your face in the camera frame and follow the instructions until the AI captures your perfect photo. For the most accurate celebrity match, make sure you're in good lighting and looking directly at the camera!
          </p>
        </section>

        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            color: '#d4b8ff',
            marginTop: '40px',
            marginBottom: '15px'
          }}>
            Step 3: Get Your Celebrity Matches
          </h2>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '15px' }}>
            Right after your face scan is complete, we'll show you your celebrity look-alike matches! Our AI compares your face against our database of thousands of celebrities and shows you who you resemble most, along with similarity scores.
          </p>
        </section>

        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            color: '#d4b8ff',
            marginTop: '40px',
            marginBottom: '15px'
          }}>
            Step 4: The Rest of Your Saptamukha Experience
          </h2>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '15px' }}>
            But finding your celebrity twin is just the beginning! During your Saptamukha visit, you'll also get:
          </p>
          <ul style={{ marginLeft: '25px', lineHeight: '2', fontSize: '1.1rem' }}>
            <li>Your real-life twin stranger search result</li>
            <li>Your facial harmony score</li>
            <li>Your face rarity score</li>
          </ul>
        </section>

        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            color: '#d4b8ff',
            marginTop: '40px',
            marginBottom: '15px'
          }}>
            How Our Celebrity Look-Alike AI Works
          </h2>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '15px' }}>
            Our celebrity look-alike AI uses advanced facial recognition technology to analyze thousands of features on your face, then compares them with our database of celebrities. We don't just look at one feature — we look at your entire face holistically!
          </p>
        </section>

        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            color: '#d4b8ff',
            marginTop: '40px',
            marginBottom: '25px'
          }}>
            Frequently Asked Questions About Celebrity Look-Alikes
          </h2>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ 
              fontSize: '1.25rem', 
              color: '#e0d6ff', 
              marginBottom: '10px',
              fontWeight: '700'
            }}>
              Q: Do I have to do the twin search just to find my celebrity look-alike?
            </h4>
            <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#9d7fe3' }}>
              A: At Saptamukha, the celebrity look-alike is part of the full experience! But trust us — finding your real twin is even more magical.
            </p>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ 
              fontSize: '1.25rem', 
              color: '#e0d6ff', 
              marginBottom: '10px',
              fontWeight: '700'
            }}>
              Q: How many celebrity matches will I get?
            </h4>
            <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#9d7fe3' }}>
              A: You'll get your top celebrity match first, and you can see additional matches too!
            </p>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ 
              fontSize: '1.25rem', 
              color: '#e0d6ff', 
              marginBottom: '10px',
              fontWeight: '700'
            }}>
              Q: Can I try again to get different celebrity matches?
            </h4>
            <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#9d7fe3' }}>
              A: Absolutely! Try using different photos or facial expressions and you might get different results!
            </p>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ 
              fontSize: '1.25rem', 
              color: '#e0d6ff', 
              marginBottom: '10px',
              fontWeight: '700'
            }}>
              Q: Is finding my celebrity look-alike free?
            </h4>
            <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#9d7fe3' }}>
              A: Yes! Everything at Saptamukha is completely free!
            </p>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ 
              fontSize: '1.25rem', 
              color: '#e0d6ff', 
              marginBottom: '10px',
              fontWeight: '700'
            }}>
              Q: What photos work best for celebrity look-alike?
            </h4>
            <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#9d7fe3' }}>
              A: For best results, use a well-lit photo of yourself looking directly at the camera with a neutral expression!
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
            Ready to Find Your Celebrity Twin?
          </h3>
          <p style={{ lineHeight: '1.7', fontSize: '1.1rem', marginBottom: '20px' }}>
            Find your celebrity look-alike and your real-life twin today at Saptamukha!
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
            Start Your Journey
          </Link>
        </section>
      </article>
    </div>
  );
}
