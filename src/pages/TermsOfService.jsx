import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function TermsOfService() {
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
              Terms of Service
            </h1>
            <p className="text-tantrik-stone text-lg">
              Last Updated: June 11, 2026
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-display text-tantrik-gold">1. Acceptance of Terms</h2>
            <p className="text-tantrik-parchment leading-relaxed">
              Welcome to SAPTAMUKHA ("we," "us," "our"). These Terms of Service ("Terms") govern your access to and use of our website, mobile application, and related services (collectively, the "Services").
            </p>
            <p className="text-tantrik-parchment leading-relaxed">
              By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms or our Privacy Policy, please do not use our Services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display text-tantrik-gold">2. Research Purpose</h2>
            <p className="text-tantrik-parchment leading-relaxed">
              SAPTAMUKHA is a research project with the following goals:
            </p>
            <ul className="list-disc pl-8 space-y-2 text-tantrik-parchment">
              <li>To conduct research on facial recognition technology and human facial diversity</li>
              <li>To explore connections between facial geometry and other personal traits</li>
              <li>To facilitate positive interactions between individuals who share similar facial features</li>
              <li>To contribute to medical research and other fields where facial analysis may provide valuable insights</li>
            </ul>
            <p className="text-tantrik-parchment leading-relaxed">
              We are committed to continuously upgrading our models, website, and Services over time to improve our research capabilities and user experience.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display text-tantrik-gold">3. Eligibility</h2>
            <p className="text-tantrik-parchment leading-relaxed">
              To use our Services, you must be at least 13 years old. If you are under 18, you must have the consent of a parent or legal guardian to use our Services.
            </p>
            <p className="text-tantrik-parchment leading-relaxed">
              By using our Services, you represent and warrant that you meet these eligibility requirements.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display text-tantrik-gold">4. User Accounts and Responsibilities</h2>
            <p className="text-tantrik-parchment leading-relaxed">
              When using our Services, you agree to:
            </p>
            <ul className="list-disc pl-8 space-y-2 text-tantrik-parchment">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the security of your account and any login credentials</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Not use our Services for any illegal or unauthorized purpose</li>
              <li>Not interfere with or disrupt the operation of our Services</li>
              <li>Not attempt to gain unauthorized access to any part of our Services</li>
              <li>Not use our Services to harass, abuse, or harm other users</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display text-tantrik-gold">5. Intellectual Property</h2>
            <p className="text-tantrik-parchment leading-relaxed">
              All content, features, and functionality of our Services, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, and software, are the exclusive property of SAPTAMUKHA or its licensors and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-tantrik-parchment leading-relaxed">
              You may not reproduce, distribute, modify, create derivative works from, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Services without our prior written consent.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display text-tantrik-gold">6. User Content</h2>
            <p className="text-tantrik-parchment leading-relaxed">
              By submitting any content to our Services (including but not limited to images, text, and other materials), you grant us a non-exclusive, worldwide, royalty-free, perpetual, irrevocable, and fully sublicensable license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content in connection with our research and the operation of our Services.
            </p>
            <p className="text-tantrik-parchment leading-relaxed">
              You represent and warrant that you own or have the necessary rights to submit such content and that the content does not violate the rights of any third party.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display text-tantrik-gold">7. Entertainment Disclaimer</h2>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
              <p className="text-tantrik-parchment leading-relaxed font-bold">
                IMPORTANT DISCLAIMER: SAPTAMUKHA IS PROVIDED FOR ENTERTAINMENT AND RESEARCH PURPOSES ONLY.
              </p>
              <p className="text-tantrik-parchment leading-relaxed mt-3">
                Our Services are not a substitute for professional advice, including but not limited to medical, legal, financial, or psychological advice. Always consult with a qualified professional for any such matters.
              </p>
              <p className="text-tantrik-parchment leading-relaxed">
                We do not guarantee the accuracy, reliability, or completeness of any information, matches, scores, or other content provided through our Services. All such content is provided "as is" without any warranties of any kind.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display text-tantrik-gold">8. Limitation of Liability</h2>
            <p className="text-tantrik-parchment leading-relaxed">
              TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT SHALL SAPTAMUKHA, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS, BE LIABLE TO YOU FOR ANY INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES WHATSOEVER, INCLUDING WITHOUT LIMITATION, DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATED TO YOUR USE OF OR INABILITY TO USE OUR SERVICES.
            </p>
            <p className="text-tantrik-parchment leading-relaxed">
              IN NO EVENT SHALL OUR TOTAL AGGREGATE LIABILITY TO YOU FOR ALL DAMAGES, LOSSES, AND CAUSES OF ACTION EXCEED THE AMOUNT YOU HAVE PAID TO US, IF ANY, IN THE TWELVE (12) MONTHS PRIOR TO THE EVENT GIVING RISE TO THE LIABILITY.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display text-tantrik-gold">9. Indemnification</h2>
            <p className="text-tantrik-parchment leading-relaxed">
              You agree to indemnify, defend, and hold harmless SAPTAMUKHA, its officers, directors, employees, and agents from and against any and all claims, damages, obligations, losses, liabilities, costs, debt, and expenses (including but not limited to attorney's fees) arising from:
            </p>
            <ul className="list-disc pl-8 space-y-2 text-tantrik-parchment">
              <li>Your use of and access to our Services</li>
              <li>Your violation of any term of these Terms</li>
              <li>Your violation of any third-party right, including without limitation any copyright, property, or privacy right</li>
              <li>Any claim that your user content caused damage to a third party</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display text-tantrik-gold">10. Termination</h2>
            <p className="text-tantrik-parchment leading-relaxed">
              We reserve the right to terminate or suspend your access to our Services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.
            </p>
            <p className="text-tantrik-parchment leading-relaxed">
              Upon termination, your right to use our Services will immediately cease. If you wish to terminate your account, you may simply discontinue using our Services or contact us to request deletion of your data.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display text-tantrik-gold">11. Governing Law</h2>
            <p className="text-tantrik-parchment leading-relaxed">
              These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which SAPTAMUKHA is established, without regard to its conflict of law provisions.
            </p>
            <p className="text-tantrik-parchment leading-relaxed">
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in full effect.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display text-tantrik-gold">12. Contact Us</h2>
            <p className="text-tantrik-parchment leading-relaxed">
              If you have any questions about these Terms, if you believe there is any issue with our Services, or if you have any other concerns, please contact us immediately:
            </p>
            <div className="bg-tantrik-dark/30 border border-tantrik-gold/20 rounded-lg p-6 mt-4">
              <p className="text-tantrik-parchment leading-relaxed">
                <strong>Email:</strong> <a href="mailto:sksb51645@gmail.com" className="text-tantrik-gold hover:underline">sksb51645@gmail.com</a>
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display text-tantrik-gold">13. Changes to Terms</h2>
            <p className="text-tantrik-parchment leading-relaxed">
              We reserve the right to modify or replace these Terms at any time at our sole discretion. We will notify you of any changes by posting the new Terms on this page and updating the "Last Updated" date at the top of these Terms.
            </p>
            <p className="text-tantrik-parchment leading-relaxed">
              Your continued use of our Services after any such changes constitutes your acceptance of the new Terms. If you do not agree to the new Terms, please stop using our Services.
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
