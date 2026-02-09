"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Menu, X, PenSquare } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-navy/10 bg-brand-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 overflow-hidden rounded-full border border-brand-gold shadow-sm transition-transform duration-500 group-hover:rotate-6">
            <Image 
              src="/logo_new.webp" 
              alt="Acharya Rajesh Walia" 
              fill
              className="object-cover scale-140"
              sizes="48px"
              priority
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-brand-navy leading-none">
              ACHARYA RAJESH
            </h1>
            <span className="text-[10px] uppercase tracking-[0.2em] text-brand-gold font-bold">
              Vedic Astrologer
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-brand-navy/70">
          <Link href="/journal" className="hover:text-brand-gold transition-colors">Journal</Link>
          <Link href="/about" className="hover:text-brand-gold transition-colors">About</Link>
          <Link href="/contact" className="hover:text-brand-gold transition-colors">Contact</Link>
        </nav>

        {/* Admin Quick Access */}
        {isAdmin && (
          <Link 
            href="/admin/write" 
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-brand-gold/20 text-brand-navy hover:bg-brand-gold/40 transition-all"
            title="Write New Article"
          >
            <PenSquare size={18} />
          </Link>
        )}

        {/* CTA Button (Desktop) */}
        <Link 
          href="/book" 
          className="hidden md:block rounded-full bg-brand-navy px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-brand-gold shadow-lg hover:bg-brand-navy/90 transition-all active:scale-95"
        >
          Book Appointment
        </Link>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-brand-navy p-1"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-brand-paper border-b border-brand-navy/10 shadow-xl py-6 px-6 flex flex-col gap-6 animate-fade-in-down">
          <nav className="flex flex-col gap-4 text-sm font-bold uppercase tracking-widest text-brand-navy/70 text-center">
            <Link 
              href="/journal" 
              className="hover:text-brand-gold transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Journal
            </Link>
            <Link 
              href="/about" 
              className="hover:text-brand-gold transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="hover:text-brand-gold transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
          <Link 
            href="/book" 
            className="w-full text-center rounded-full bg-brand-navy px-5 py-3 text-xs font-bold uppercase tracking-widest text-brand-gold shadow-md hover:bg-brand-navy/90 transition-all"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Book Appointment
          </Link>
        </div>
      )}
    </header>
  );
}