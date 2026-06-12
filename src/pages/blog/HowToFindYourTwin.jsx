import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function HowToFindYourTwin() {
  useEffect(() => {
    document.title = "How to Find Your Twin — Step-by-Step Guide | Saptamukha";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content = "Discover how Saptamukha finds your real-life twin stranger using AI face recognition. Step-by-step guide to find your doppelganger today!";
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
            June 12, 2026 · 8 min read
          </p>
          <h1 style={{ 
            fontSize: '2.5rem', 
            lineHeight: '1.2',
            color: '#d4b8ff',
            marginBottom: '20px'
          }}>
            How to Find Your Twin
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#9d7fe3',
            lineHeight: '1.7'
          }}>
            Have you ever wondered if someone, somewhere in the world, has your exact face? With Saptamukha, you can find your twin stranger using AI-powered face recognition. Here's exactly how it works.
          </p>
        </header>

        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            color: '#d4b8ff',
            marginTop: '40px',
            marginBottom: '15px'
          }}>
            Step 1: Accept the Warning & Start Your Journey
          </h2>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '15px' }}>
            When you visit Saptamukha, the first thing you'll see is a mystical warning. This is part of the experience — and it also reminds you that this is all for entertainment purposes only!
          </p>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '15px' }}>
            Read the warning carefully, then click the golden button to accept and proceed to the intake form.
          </p>
        </section>

        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            color: '#d4b8ff',
            marginTop: '40px',
            marginBottom: '15px'
          }}>
            Step 2: Fill Out the Intake Form
          </h2>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '15px' }}>
            Next, you'll need to tell us a little about yourself! We ask for your:
          </p>
          <ul style={{ marginLeft: '25px', lineHeight: '2', fontSize: '1.1rem' }}>
            <li>Name</li>
            <li>Age</li>
            <li>Country</li>
            <li>Email address</li>
            <li>Father's name</li>
            <li>Mother's name</li>
          </ul>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', marginTop: '15px' }}>
            Your mother and father's names are important — they help us avoid matching you with yourself if you ever come back and scan again!
          </p>
        </section>

        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            color: '#d4b8ff',
            marginTop: '40px',
            marginBottom: '15px'
          }}>
            Step 3: Scan Your Face
          </h2>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '15px' }}>
            Now it's time for the fun part! Position your face in the camera frame, follow the on-screen instructions, and wait for the AI to capture your perfect photo.
          </p>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '15px' }}>
            Tip: Make sure you're in a well-lit room, look directly at the camera, and keep a neutral expression for the most accurate match!
          </p>
        </section>

        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            color: '#d4b8ff',
            marginTop: '40px',
            marginBottom: '15px'
          }}>
            Step 4: How We Find Your Twin
          </h2>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '15px' }}>
            This is the magical part! Here's exactly what happens behind the scenes after you scan your face:
          </p>
          <ol style={{ marginLeft: '25px', lineHeight: '2', fontSize: '1.1rem' }}>
            <li>Our AI turns your photo into a "face embedding" — a mathematical representation of your face</li>
            <li>We search our database of over 100,000 faces (and counting!) to find the closest matches</li>
            <li>We look for matches with at least 70% similarity</li>
            <li>We check parent names to make sure we're not matching you with yourself</li>
          </ol>
        </section>

        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            color: '#d4b8ff',
            marginTop: '40px',
            marginBottom: '15px'
          }}>
            Step 5: The Three Possible Results
          </h2>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '15px' }}>
            There are three things that can happen after your scan:
          </p>
          <div style={{ marginLeft: '25px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#d4b8ff', marginBottom: '10px' }}>
              1. You Find Your Twin! 🎉
            </h3>
            <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#9d7fe3' }}>
              If we find someone with a 70%+ face match and different parent names — congratulations! You've found your twin stranger! We'll show you their photo and you can decide if you want to connect.
            </p>
          </div>
          <div style={{ marginLeft: '25px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#d4b8ff', marginBottom: '10px' }}>
              2. Your Soul is Sealed — You're Unique! 🔱
            </h3>
            <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#9d7fe3' }}>
              If we don't find a match right away, don't worry! You're simply unique. We'll add you to our database, and if someone who looks like you joins later, we'll let you know!
            </p>
          </div>
          <div style={{ marginLeft: '25px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#d4b8ff', marginBottom: '10px' }}>
              3. Welcome Back — You've Scanned Before! 👋
            </h3>
            <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#9d7fe3' }}>
              If we detect that you've scanned before (same face and parent names), we'll show you your previous results instead of creating a new entry.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            color: '#d4b8ff',
            marginTop: '40px',
            marginBottom: '15px'
          }}>
            Step 6: Share Your Results
          </h2>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '15px' }}>
            Whether you find your twin or not, your results are meant to be shared! Post your results on social media and tag us — we love seeing them!
          </p>
        </section>

        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            color: '#d4b8ff',
            marginTop: '40px',
            marginBottom: '15px'
          }}>
            What Else You'll Get
          </h2>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '15px' }}>
            Finding your twin is just part of the fun! Every scan also includes:
          </p>
          <ul style={{ marginLeft: '25px', lineHeight: '2', fontSize: '1.1rem' }}>
            <li>Your celebrity look-alike matches</li>
            <li>Your facial harmony score</li>
            <li>Your rarity score — how unique your face is!</li>
          </ul>
        </section>

        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            color: '#d4b8ff',
            marginTop: '40px',
            marginBottom: '25px'
          }}>
            Frequently Asked Questions About Finding Your Twin
          </h2>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ 
              fontSize: '1.25rem', 
              color: '#e0d6ff', 
              marginBottom: '10px',
              fontWeight: '700'
            }}>
              Q: How accurate is the twin matching?
            </h4>
            <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#9d7fe3' }}>
              A: Our AI looks for at least 70% similarity between faces, but keep in mind this is for entertainment purposes only!
            </p>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ 
              fontSize: '1.25rem', 
              color: '#e0d6ff', 
              marginBottom: '10px',
              fontWeight: '700'
            }}>
              Q: What if I don't find my twin right away?
            </h4>
            <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#9d7fe3' }}>
              A: Don't worry! We'll add you to our database, and if someone with a similar face joins later, we'll notify you via email!
            </p>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ 
              fontSize: '1.25rem', 
              color: '#e0d6ff', 
              marginBottom: '10px',
              fontWeight: '700'
            }}>
              Q: Will my photo be public?
            </h4>
            <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#9d7fe3' }}>
              A: Your photo will only be visible to your twin if you match. Otherwise, it's kept securely in our system!
            </p>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ 
              fontSize: '1.25rem', 
              color: '#e0d6ff', 
              marginBottom: '10px',
              fontWeight: '700'
            }}>
              Q: Why do you ask for my parents' names?
            </h4>
            <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#9d7fe3' }}>
              A: We use parent names to make sure we don't accidentally match you with yourself if you come back and scan again!
            </p>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ 
              fontSize: '1.25rem', 
              color: '#e0d6ff', 
              marginBottom: '10px',
              fontWeight: '700'
            }}>
              Q: Can I scan myself more than once?
            </h4>
            <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#9d7fe3' }}>
              A: Yes! But if you use the same name and parent names, we'll recognize it's you and show your existing results.
            </p>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ 
              fontSize: '1.25rem', 
              color: '#e0d6ff', 
              marginBottom: '10px',
              fontWeight: '700'
            }}>
              Q: Is this free?
            </h4>
            <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#9d7fe3' }}>
              A: Yes! Finding your twin on Saptamukha is completely free!
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
            Ready to Find Your Twin?
          </h3>
          <p style={{ lineHeight: '1.7', fontSize: '1.1rem', marginBottom: '20px' }}>
            What are you waiting for? Your twin could be just a scan away!
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
            Find Your Twin Now
          </Link>
        </section>
      </article>
    </div>
  );
}
