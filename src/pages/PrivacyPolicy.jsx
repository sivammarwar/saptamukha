import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function PrivacyPolicy() {
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
              Privacy Policy
            </h1>
            <p className="text-tantrik-stone text-lg">
              Last Updated: June 11, 2026
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-display text-tantrik-gold">1. Introduction</h2>
            <p className="text-tantrik-parchment leading-relaxed">
              Welcome to SAPTAMUKHA ("we," "us," "our"). This Privacy Policy explains how we collect, use, share, and protect your personal information when you use our website, mobile application, and related services (collectively, the "Services").
            </p>
            <p className="text-tantrik-parchment leading-relaxed">
              SAPTAMUKHA was created for research purposes to explore facial recognition technology, human facial diversity, and connections between individuals who share similar facial features (whom we refer to as "soul twins"). We are committed to protecting your privacy and handling your data responsibly.
            </p>
            <p className="text-tantrik-parchment leading-relaxed">
              By using our Services, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with any part of this policy, please do not use our Services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display text-tantrik-gold">2. Research Purpose</h2>
            <p className="text-tantrik-parchment leading-relaxed">
              SAPTAMUKHA is a research project dedicated to:
            </p>
            <ul className="list-disc pl-8 space-y-2 text-tantrik-parchment">
              <li>Understanding human facial diversity and facial recognition algorithms</li>
              <li>Exploring connections between facial geometry and other traits</li>
              <li>Facilitating positive interactions between individuals who share similar facial features</li>
              <li>Contributing to medical research and other fields where facial analysis may provide insights</li>
            </ul>
            <p className="text-tantrik-parchment leading-relaxed">
              We are committed to continuously improving our models, website, and Services over time to enhance our research capabilities and user experience.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display text-tantrik-gold">3. Information We Collect</h2>
            <p className="text-tantrik-parchment leading-relaxed">
              We collect several types of information from and about users of our Services:
            </p>

            <div className="space-y-6 mt-4">
              <div className="bg-tantrik-dark/30 border border-tantrik-gold/20 rounded-lg p-6">
                <h3 className="text-xl font-display text-tantrik-gold mb-3">3.1 Personal Information</h3>
                <p className="text-tantrik-parchment leading-relaxed mb-3">
                  When you use our Services, we may collect the following personal information:
                </p>
                <ul className="list-disc pl-8 space-y-2 text-tantrik-parchment">
                  <li>Full name</li>
                  <li>Age</li>
                  <li>Country of residence</li>
                  <li>Email address</li>
                  <li>Father's full name</li>
                  <li>Mother's full name (including maiden name if provided)</li>
                  <li>Social media handles (if you choose to provide them)</li>
                  <li>Messages you choose to leave for potential soul twins</li>
                </ul>
              </div>

              <div className="bg-tantrik-dark/30 border border-tantrik-gold/20 rounded-lg p-6">
                <h3 className="text-xl font-display text-tantrik-gold mb-3">3.2 Biometric and Facial Data</h3>
                <p className="text-tantrik-parchment leading-relaxed mb-3">
                  When you use our facial scanning features, we collect:
                </p>
                <ul className="list-disc pl-8 space-y-2 text-tantrik-parchment">
                  <li>Images of your face captured via your device's camera or uploaded by you</li>
                  <li>Facial recognition data and geometric features extracted from your images</li>
                  <li>Facial harmony scores and related metrics from our Mukha Darshan feature</li>
                </ul>
              </div>

              <div className="bg-tantrik-dark/30 border border-tantrik-gold/20 rounded-lg p-6">
                <h3 className="text-xl font-display text-tantrik-gold mb-3">3.3 Usage and Technical Data</h3>
                <p className="text-tantrik-parchment leading-relaxed mb-3">
                  We automatically collect certain information when you access or use our Services:
                </p>
                <ul className="list-disc pl-8 space-y-2 text-tantrik-parchment">
                  <li>IP address</li>
                  <li>Device type and operating system</li>
                  <li>Browser type and version</li>
                  <li>Pages visited and time spent on our Services</li>
                  <li>Referring website addresses</li>
                  <li>Other diagnostic data</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display text-tantrik-gold">4. How We Use Your Information</h2>
            <p className="text-tantrik-parchment leading-relaxed">
              We use the information we collect for various purposes:
            </p>
            <ul className="list-disc pl-8 space-y-2 text-tantrik-parchment">
              <li>To provide and maintain our Services</li>
              <li>To improve and optimize our Services, including our AI models and algorithms</li>
              <li>To conduct research on facial diversity, facial recognition, and related topics</li>
              <li>To find and connect potential soul twins</li>
              <li>To communicate with you, including about matches and updates to our Services</li>
              <li>To prevent duplicate records and ensure the integrity of our research</li>
              <li>To detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display text-tantrik-gold">5. Data Sharing and Disclosure</h2>
            <p className="text-tantrik-parchment leading-relaxed">
              We may share your information in the following situations:
            </p>

            <div className="space-y-6 mt-4">
              <div className="bg-tantrik-dark/30 border border-tantrik-gold/20 rounded-lg p-6">
                <h3 className="text-xl font-display text-tantrik-gold mb-3">5.1 With Your Consent</h3>
                <p className="text-tantrik-parchment leading-relaxed">
                  We may share your information with third parties when we have your explicit consent to do so.
                </p>
              </div>

              <div className="bg-tantrik-dark/30 border border-tantrik-gold/20 rounded-lg p-6">
                <h3 className="text-xl font-display text-tantrik-gold mb-3">5.2 With Soul Twins</h3>
                <p className="text-tantrik-parchment leading-relaxed">
                  If we find a potential soul twin match for you, we may share certain information with them, including:
                </p>
                <ul className="list-disc pl-8 space-y-2 text-tantrik-parchment">
                  <li>Your first name</li>
                  <li>Your age</li>
                  <li>Your country</li>
                  <li>Any social media handles or messages you have chosen to share</li>
                  <li>Your facial similarity score</li>
                </ul>
                <p className="text-tantrik-parchment leading-relaxed mt-3">
                  We will never share your full name, parents' names, or email address with other users without your explicit permission.
                </p>
              </div>

              <div className="bg-tantrik-dark/30 border border-tantrik-gold/20 rounded-lg p-6">
                <h3 className="text-xl font-display text-tantrik-gold mb-3">5.3 Service Providers</h3>
                <p className="text-tantrik-parchment leading-relaxed">
                  We may share your information with third-party service providers who help us operate our Services, such as cloud hosting providers, payment processors (if applicable), and analytics services. These providers are contractually required to keep your information confidential and use it only to perform services on our behalf.
                </p>
              </div>

              <div className="bg-tantrik-dark/30 border border-tantrik-gold/20 rounded-lg p-6">
                <h3 className="text-xl font-display text-tantrik-gold mb-3">5.4 Legal Requirements</h3>
                <p className="text-tantrik-parchment leading-relaxed">
                  We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).
                </p>
              </div>

              <div className="bg-tantrik-dark/30 border border-tantrik-gold/20 rounded-lg p-6">
                <h3 className="text-xl font-display text-tantrik-gold mb-3">5.5 Research and Aggregated Data</h3>
                <p className="text-tantrik-parchment leading-relaxed">
                  We may share aggregated, anonymized data for research purposes, academic publications, or to contribute to medical research and other fields. This data will not include any information that can be used to identify you personally.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display text-tantrik-gold">6. Data Security</h2>
            <p className="text-tantrik-parchment leading-relaxed">
              We take reasonable measures to protect your personal information from unauthorized access, use, disclosure, alteration, or destruction. This includes:
            </p>
            <ul className="list-disc pl-8 space-y-2 text-tantrik-parchment">
              <li>Encryption of your images and biometric data at rest</li>
              <li>Use of secure servers and industry-standard security protocols</li>
              <li>Restricted access to personal information by our employees and contractors</li>
              <li>Regular security audits and updates to our systems</li>
            </ul>
            <p className="text-tantrik-parchment leading-relaxed">
              However, please note that no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display text-tantrik-gold">7. Your Rights</h2>
            <p className="text-tantrik-parchment leading-relaxed">
              Depending on your jurisdiction, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc pl-8 space-y-2 text-tantrik-parchment">
              <li><strong>Access:</strong> You can request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> You can request that we correct inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> You can request that we delete your personal information</li>
              <li><strong>Restriction:</strong> You can request that we restrict the processing of your personal information</li>
              <li><strong>Data Portability:</strong> You can request that we provide your personal information in a machine-readable format</li>
              <li><strong>Objection:</strong> You can object to the processing of your personal information</li>
            </ul>
            <p className="text-tantrik-parchment leading-relaxed">
              To exercise any of these rights, please contact us using the information provided in Section 10.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display text-tantrik-gold">8. Data Retention</h2>
            <p className="text-tantrik-parchment leading-relaxed">
              We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
            </p>
            <p className="text-tantrik-parchment leading-relaxed">
              If you request deletion of your data, we will delete your personal information from our active databases, though we may retain certain information in our archives for legal, security, or research purposes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display text-tantrik-gold">9. Entertainment Disclaimer</h2>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
              <p className="text-tantrik-parchment leading-relaxed font-bold">
                IMPORTANT: SAPTAMUKHA IS PROVIDED FOR ENTERTAINMENT AND RESEARCH PURPOSES ONLY.
              </p>
              <p className="text-tantrik-parchment leading-relaxed mt-3">
                Our Services are not intended to be relied upon for any medical, legal, financial, or other professional purposes. The matches, scores, and other information provided by SAPTAMUKHA should not be considered as facts or professional advice.
              </p>
              <p className="text-tantrik-parchment leading-relaxed">
                We make no guarantees, representations, or warranties about the accuracy, reliability, or completeness of any information provided through our Services.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display text-tantrik-gold">10. Contact Us</h2>
            <p className="text-tantrik-parchment leading-relaxed">
              If you have any questions about this Privacy Policy, if you believe we have used your information in a way that violates this policy, or if you have any other concerns, please contact us immediately:
            </p>
            <div className="bg-tantrik-dark/30 border border-tantrik-gold/20 rounded-lg p-6 mt-4">
              <p className="text-tantrik-parchment leading-relaxed">
                <strong>Email:</strong> <a href="mailto:sksb51645@gmail.com" className="text-tantrik-gold hover:underline">sksb51645@gmail.com</a>
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display text-tantrik-gold">11. Changes to This Privacy Policy</h2>
            <p className="text-tantrik-parchment leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
            </p>
            <p className="text-tantrik-parchment leading-relaxed">
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
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
