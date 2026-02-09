import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Acharya Rajesh ',
  description: 'Privacy Policy and Data Collection practices.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-brand-paper selection:bg-brand-gold/30">
      <Navbar />
      
      <main className="mx-auto max-w-4xl px-6 py-24 md:py-32">
        <header className="mb-12 border-b border-brand-navy/10 pb-8 text-center">
            <span className="mb-4 inline-block rounded-full bg-brand-navy/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-navy">
                Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          <h1 className="mb-4 font-display text-4xl font-bold text-brand-navy md:text-5xl">Privacy Policy</h1>
          <p className="text-brand-navy/60">Your privacy is critically important to us.</p>
        </header>

        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-brand-navy prose-a:text-brand-gold prose-strong:text-brand-navy">
          <p>
            Welcome to the official website of <strong>Acharya Rajesh </strong>. We respect your privacy and are committed to protecting personally identifiable information you may provide us through the Website.
          </p>

          <h3>1. Information We Collect</h3>
          <p>
            We only collect information that is necessary for us to provide you with the best astrological guidance and user experience.
          </p>
          <ul>
            <li><strong>Personal Information:</strong> Includes your Name and Email address when you sign in via Google Authentication or fill out a contact form.</li>
            <li><strong>Birth Details:</strong> When booking a consultation, we may ask for birth date, time, and place. This is strictly used for horoscope calculation and is never shared with third parties.</li>
            <li><strong>Usage Data:</strong> We may collect non-personal information about how you access and use the website (e.g., browser type, pages visited) to improve our services.</li>
          </ul>

          <h3>2. How We Use Your Information</h3>
          <ul>
            <li>To provide and maintain our Service (e.g., logging you in).</li>
            <li>To contact you regarding your consultation bookings or inquiries.</li>
            <li>To improve the functionality and content of our website.</li>
          </ul>

          <h3>3. Data Security</h3>
          <p>
            The security of your Personal Information is important to us. We use commercially acceptable means to protect your Personal Information, including secure database storage and encrypted connections (SSL). However, remember that no method of transmission over the Internet is 100% secure.
          </p>

          <h3>4. Cookies</h3>
          <p>
            We use cookies to maintain your session when you log in. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service (like logging in).
          </p>

          <h3>5. Third-Party Services</h3>
          <p>
            <strong>Google Auth:</strong> We use Google Authentication for secure sign-in. Please refer to Google's Privacy Policy for more information on how they handle your data.
          </p>

          <h3>6. Contact Us</h3>
          <p>
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul>
            <li>By email: <a href="mailto:rajeshacharya1141@gmail.com">rajeshacharya1141@gmail.com</a></li>
            <li>By phone: +91 98104 49333 / +91 7982803848</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
