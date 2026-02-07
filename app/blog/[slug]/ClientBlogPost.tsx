"use client";

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import ImportantDates from '@/components/ImportantDates';
import { Share2, Bookmark } from 'lucide-react';

interface BlogPostProps {
  post: {
    title: string;
    content: string;
    date: string;
    category: string;
    slug: string;
    importantDates: any[];
  };
}

export default function ClientBlogPost({ post }: BlogPostProps) {
  const [view, setView] = useState<'hindi' | 'english' | 'summary'>('hindi');

  return (
    <div className="min-h-screen bg-brand-paper">
      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 z-[60] h-1 w-full bg-brand-navy/10">
        <div className="h-full bg-brand-gold w-1/3 transition-all duration-300"></div>
      </div>

      <Navbar />

      <main className="mx-auto max-w-3xl px-6 py-12 md:py-20">
        {/* Article Header */}
        <header className="mb-12 text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold">
            {post.category}
          </span>
          <h1 className="mt-4 font-hindi text-4xl md:text-5xl font-black leading-tight text-brand-navy">
            {post.title}
          </h1>
          <p className="mt-4 text-sm italic text-slate-400">Published on {post.date} • By Acharya Rajesh Walia</p>
          
          {/* Language Switcher */}
          <div className="mt-8 flex justify-center gap-1 border-b border-brand-navy/10 text-xs font-bold uppercase tracking-widest">
            <button 
              onClick={() => setView('hindi')}
              className={`px-4 py-2 transition-all ${view === 'hindi' ? 'border-b-2 border-brand-gold text-brand-navy' : 'text-slate-400'}`}
            >
              Hindi
            </button>
            <button 
              onClick={() => setView('english')}
              className={`px-4 py-2 transition-all ${view === 'english' ? 'border-b-2 border-brand-gold text-brand-navy' : 'text-slate-400'}`}
            >
              English
            </button>
            <button 
              onClick={() => setView('summary')}
              className={`px-4 py-2 transition-all ${view === 'summary' ? 'border-b-2 border-brand-gold text-brand-navy' : 'text-slate-400'}`}
            >
              Summary
            </button>
          </div>
        </header>

        {/* Article Content */}
        <article className={`prose prose-lg max-w-none text-brand-ink leading-relaxed transition-all duration-500 ${view === 'hindi' ? 'select-none' : ''}`}>
          {view === 'hindi' && (
            <div className="font-hindi text-xl md:text-2xl space-y-8 opacity-100" dangerouslySetInnerHTML={{ __html: post.content }}>
            </div>
          )}

          {view === 'english' && (
            <div className="font-display text-lg md:text-xl space-y-8 animate-fade-in">
              <p>English translation is coming soon...</p>
            </div>
          )}

          {view === 'summary' && (
            <div className="rounded-lg bg-brand-navy/5 p-8 italic font-display text-lg animate-pulse-subtle">
              <h4 className="mb-4 font-bold uppercase tracking-widest text-brand-gold">Executive Summary</h4>
              <p>Summary is coming soon...</p>
            </div>
          )}
        </article>

        {/* Key Dates Component */}
        <ImportantDates dates={post.importantDates} />

        {/* Bottom Actions */}
        <footer className="mt-16 flex items-center justify-between border-t border-brand-navy/10 pt-8">
          <div className="flex gap-4">
            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-brand-gold">
              <Share2 size={16} /> Share
            </button>
            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-brand-gold">
              <Bookmark size={16} /> Save
            </button>
          </div>
          <a href="/book" className="text-sm font-bold text-brand-gold underline underline-offset-4 decoration-brand-gold/30 hover:decoration-brand-gold">
            Book an appointment →
          </a>
        </footer>
      </main>
    </div>
  );
}
