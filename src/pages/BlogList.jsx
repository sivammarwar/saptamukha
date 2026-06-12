import React from 'react';
import { Link } from 'react-router-dom';

function BlogList() {
  const posts = [
    {
      id: 1,
      title: "How to Find Your Twin: Step-by-Step Guide",
      excerpt: "Have you ever wondered if someone, somewhere has your exact face? Here's exactly how Saptamukha finds your twin stranger.",
      date: "June 12, 2026",
      slug: "how-to-find-your-twin",
      readTime: "8 min read"
    },
    {
      id: 2,
      title: "How to Find Your Celebrity Look-Alike: Step-by-Step Guide",
      excerpt: "Ever wondered which celebrity you look like? Our step-by-step guide shows you exactly how to find your famous twin with facial recognition technology.",
      date: "June 12, 2026",
      slug: "how-to-find-your-celebrity-look-alike",
      readTime: "5 min read"
    },
    {
      id: 3,
      title: "What is Facial Harmony? The Science Behind Attractive Faces",
      excerpt: "Discover the mathematical principles that make certain faces aesthetically pleasing and how our harmony analysis works.",
      date: "June 11, 2026",
      slug: "what-is-facial-harmony",
      readTime: "7 min read"
    },
    {
      id: 4,
      title: "The Fascinating History of Doppelgangers: From Myth to Modern Science",
      excerpt: "Explore the ancient myths, cultural significance, and modern scientific explanations behind the concept of doppelgangers.",
      date: "June 10, 2026",
      slug: "history-of-doppelgangers",
      readTime: "10 min read"
    }
  ];

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '40px 20px', 
      color: '#e0d6ff',
      fontFamily: 'Crimson Pro, serif'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        fontSize: '3rem', 
        marginBottom: '10px',
        color: '#d4b8ff'
      }}>
        Saptamukha Blog
      </h1>
      <p style={{ 
        textAlign: 'center', 
        fontSize: '1.2rem', 
        color: '#9d7fe3',
        marginBottom: '50px'
      }}>
        Discover insights on facial recognition, doppelgangers, celebrity look-alikes, and facial harmony
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '30px' 
      }}>
        {posts.map(post => (
          <div key={post.id} style={{ 
            backgroundColor: '#1a1a2e', 
            borderRadius: '12px', 
            padding: '25px',
            border: '1px solid #2a2a4a',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}>
            <p style={{ 
              fontSize: '0.9rem', 
              color: '#7f5af0',
              fontFamily: 'Space Mono, monospace',
              marginBottom: '10px'
            }}>
              {post.date} · {post.readTime}
            </p>
            <h2 style={{ 
              fontSize: '1.5rem', 
              marginBottom: '12px',
              color: '#e0d6ff'
            }}>
              {post.title}
            </h2>
            <p style={{ 
              color: '#9d7fe3', 
              marginBottom: '20px',
              lineHeight: '1.6'
            }}>
              {post.excerpt}
            </p>
            <Link 
              to={`/blog/${post.slug}`}
              style={{ 
                color: '#7f5af0',
                textDecoration: 'none',
                fontWeight: '600',
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.9rem',
                borderBottom: '1px solid #7f5af0'
              }}
            >
              Read More →
            </Link>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '60px', textAlign: 'center' }}>
        <Link to="/" style={{ 
          color: '#7f5af0',
          textDecoration: 'none',
          fontFamily: 'Space Mono, monospace',
          fontSize: '0.9rem',
          borderBottom: '1px solid #7f5af0'
        }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default BlogList;
