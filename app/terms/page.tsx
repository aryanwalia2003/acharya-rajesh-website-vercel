import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Acharya Rajesh ',
  description: 'Terms and conditions for using our website and services.',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-brand-paper selection:bg-brand-gold/30">
      <Navbar />
      
      <main className="mx-auto max-w-4xl px-6 py-24 md:py-32">
        <header className="mb-12 border-b border-brand-navy/10 pb-8 text-center">
             <span className="mb-4 inline-block rounded-full bg-brand-navy/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-navy">
                Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          <h1 className="mb-4 font-display text-4xl font-bold text-brand-navy md:text-5xl">Terms of Service</h1>
          <p className="text-brand-navy/60">Please read these terms carefully before using our services.</p>
        </header>

        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-brand-navy prose-a:text-brand-gold prose-a:font-bold prose-strong:text-brand-navy">
          
          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing or using the website of <strong>Acharya Rajesh </strong>, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
          </p>

          <h3>2. Astrology Services Disclaimer</h3>
          <p>
            <strong>For Entertainment & Guidance Purposes Only:</strong> Astrology is an ancient science of guidance. While Acharya Rajesh  strives to provide accurate and helpful predictions based on Vedic principles, these should not be considered as a substitute for professional legal, medical, or financial advice. We do not guarantee specific results. Your life choices and actions (Karma) play a significant role in your future.
          </p>

          <h3>3. Consultations & Payments</h3>
          <ul>
             <li>Consultations are subject to availability and prior booking.</li>
             <li>Fees once paid are for the time and analysis provided by the Astrologer.</li>
            <li>Please respect the scheduled time slots to ensure everyone receives timely guidance.</li>
          </ul>

          <h3>4. User Accounts</h3>
          <p>
            When you create an account with us (via Google Login), you must provide information that is accurate. You are responsible for safeguarding your device and account access.
          </p>

          <h3>5. Intellectual Property</h3>
          <p>
            The content, features, blog posts, logos, and design on this website are the exclusive property of Acharya Rajesh . Unauthorized reproduction is prohibited.
          </p>

          <h3>6. Limitation of Liability</h3>
          <p>
            In no event shall Acharya Rajesh  be liable for any indirect, incidental, special, or consequential damages resulting from your use of the website or reliance on any information provided herein.
          </p>

          <h3>7. Changes to Terms</h3>
          <p>
            We reserve the right to modify these Terms at any time. By continuing to use our Service after revisions become effective, you agree to be bound by the new terms.
          </p>

           <h3>8. Contact Us</h3>
          <p>
            If you have any questions about these Terms, please contact us at <a href="mailto:rajeshacharya1141@gmail.com">rajeshacharya1141@gmail.com</a>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
