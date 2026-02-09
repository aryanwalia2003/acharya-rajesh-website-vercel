import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-brand-navy/5 bg-white pt-16 pb-8">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="relative w-12 h-12 overflow-hidden rounded-full border-2 border-brand-gold shadow-sm transition-transform duration-500 group-hover:rotate-6">
                <Image 
                  src="/logo_new.webp" 
                  alt="Acharya Rajesh " 
                  fill
                  className="object-cover scale-140"
                  sizes="48px"
                />
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl font-bold tracking-tight text-brand-navy leading-none">
                  ACHARYA RAJESH
                </h2>
                <span className="text-[10px] uppercase tracking-[0.2em] text-brand-gold font-bold">
                  Vedic Astrologer
                </span>
              </div>
            </Link>
            <p className="text-brand-ink/70 text-sm leading-relaxed max-w-sm">
              Helping you navigate life's journey through the ancient wisdom of Vedic Astrology. 
              Karma and Destiny, aligned.
            </p>
          </div>

          {/* Links Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-navy mb-6">Explore</h3>
            <ul className="space-y-4 text-sm text-brand-ink/70 font-medium">
              <li><Link href="/journal" className="hover:text-brand-gold transition-colors">Journal</Link></li>
              <li><Link href="/about" className="hover:text-brand-gold transition-colors">About Acharya Ji</Link></li>
              <li><Link href="/contact" className="hover:text-brand-gold transition-colors">Contact</Link></li>
              <li><Link href="/book" className="hover:text-brand-gold transition-colors">Book Consultation</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-navy mb-6">Connect</h3>
            <ul className="space-y-4 text-sm text-brand-ink/70 font-medium">
              <li>
                <a href="tel:+919810449333" className="hover:text-brand-gold transition-colors">
                  +91 98104 49333
                </a>
              </li>
              <li>
                <a href="tel:+917982803848" className="hover:text-brand-gold transition-colors">
                  +91 7982803848
                </a>
              </li>
              <li>
                <a href="mailto:rajeshacharya1141@gmail.com" className="hover:text-brand-gold transition-colors">
                  rajeshacharya1141@gmail.com
                </a>
              </li>
              <li className="flex gap-4 pt-2">
                <a href="#" className="text-slate-400 hover:text-brand-gold transition-colors"><Facebook size={20} /></a>
                <a href="https://www.instagram.com/acharyarajesh_in?igsh=MThxazgwcXk2NWtpYw==" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-gold transition-colors"><Instagram size={20} /></a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-brand-navy/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center md:text-left">
          <p>© {new Date().getFullYear()} Acharya Rajesh . All Wisdom Reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-brand-navy transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-navy transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
