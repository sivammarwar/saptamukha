import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-tantrik-bg text-tantrik-parchment py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-tantrik-gold hover:text-tantrik-parchment transition-colors font-mono text-sm uppercase tracking-wider">
            <span className="mr-2">←</span>
            Back to Saptamukha
          </Link>
        </div>

        <div className="space-y-12">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-display text-gradient-gold mb-4">
              Contact Us
            </h1>
            <p className="text-tantrik-stone text-lg">
              We'd love to hear from you
            </p>
          </div>

          <section className="space-y-6">
            <div className="bg-tantrik-dark/30 border border-tantrik-gold/20 rounded-lg p-8">
              <h2 className="text-2xl font-display text-tantrik-gold mb-6">Get in Touch</h2>
              <p className="text-tantrik-parchment leading-relaxed mb-6">
                Whether you have questions about our Services, concerns about privacy, feedback on our research, or you believe there is any issue with our website or content, please don't hesitate to contact us immediately.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-display text-tantrik-gold">Email Us</h3>
                  <div className="bg-tantrik-bg/50 border border-tantrik-gold/10 rounded-lg p-4">
                    <p className="text-tantrik-parchment leading-relaxed">
                      <strong>Primary Contact:</strong>
                    </p>
                    <a href="mailto:sksb51645@gmail.com" className="text-tantrik-gold hover:underline text-lg">
                      sksb51645@gmail.com
                    </a>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-display text-tantrik-gold">When to Contact Us</h3>
                  <ul className="list-disc pl-6 space-y-2 text-tantrik-parchment">
                    <li>Questions about our Privacy Policy or Terms of Service</li>
                    <li>Requests to access, correct, or delete your data</li>
                    <li>Feedback on our Services or research</li>
                    <li>Concerns about any content on our website</li>
                    <li>Reports of intellectual property infringement</li>
                    <li>Any other issues or questions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-tantrik-dark/30 border border-tantrik-gold/20 rounded-lg p-8">
              <h2 className="text-2xl font-display text-tantrik-gold mb-6">Our Commitment</h2>
              <p className="text-tantrik-parchment leading-relaxed">
                We are committed to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-tantrik-parchment">
                <li>Responding to your inquiries in a timely manner</li>
                <li>Addressing your concerns seriously and promptly</li>
                <li>Continuously improving our Services and research</li>
                <li>Maintaining the highest standards of privacy and security</li>
                <li>Being transparent about our practices and policies</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-purple-900/30 to-red-900/20 border border-tantrik-gold/30 rounded-lg p-8">
              <h2 className="text-2xl font-display text-tantrik-gold mb-6">Our Mission</h2>
              <p className="text-tantrik-parchment leading-relaxed mb-4">
                SAPTAMUKHA was created for research purposes to explore facial recognition technology, human facial diversity, and the connections between individuals who share similar facial features (whom we refer to as "soul twins").
              </p>
              <p className="text-tantrik-parchment leading-relaxed mb-4">
                We aim to facilitate positive interactions between users and contribute to medical research and other fields where facial analysis may provide valuable insights.
              </p>
              <p className="text-tantrik-parchment leading-relaxed">
                We are dedicated to continuously upgrading our models, website, and Services over time to enhance our research capabilities and user experience.
              </p>
            </div>
          </section>

          <div className="pt-8 border-t border-tantrik-gold/20 text-center">
            <Link to="/" className="inline-flex items-center justify-center px-8 py-3 bg-tantrik-gold text-tantrik-bg rounded-lg font-mono text-sm uppercase tracking-wider hover:bg-tantrik-gold/80 transition-colors">
              Return to Saptamukha
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
