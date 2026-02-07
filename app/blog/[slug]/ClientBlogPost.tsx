"use client";

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import ImportantDates from '@/components/ImportantDates';
import { Share2, Bookmark, Sparkles } from 'lucide-react';

interface ExtractedDate {
  date: string;
  title_hi: string;
  title_en: string;
  type: string;
}

interface BlogPostProps {
  post: {
    title: string;
    content: string;
    date: string;
    category: string;
    slug: string;
    englishTranslation: string | null;
    englishSummary: string | null;
    importantDates: ExtractedDate[];
  };
}

export default function ClientBlogPost({ post }: BlogPostProps) {
  const [view, setView] = useState<'hindi' | 'english' | 'summary'>('hindi');

  const hasTranslation = !!post.englishTranslation;
  const hasSummary = !!post.englishSummary;
  const hasDates = post.importantDates && post.importantDates.length > 0;

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
              disabled={!hasTranslation}
              className={`px-4 py-2 transition-all flex items-center gap-1 ${view === 'english' ? 'border-b-2 border-brand-gold text-brand-navy' : 'text-slate-400'} ${!hasTranslation ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              English {hasTranslation && <Sparkles size={12} className="text-brand-gold" />}
            </button>
            <button 
              onClick={() => setView('summary')}
              disabled={!hasSummary}
              className={`px-4 py-2 transition-all flex items-center gap-1 ${view === 'summary' ? 'border-b-2 border-brand-gold text-brand-navy' : 'text-slate-400'} ${!hasSummary ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              Summary {hasSummary && <Sparkles size={12} className="text-brand-gold" />}
            </button>
          </div>
        </header>

        {/* Article Content */}
        <article className={`prose prose-lg max-w-none text-brand-ink leading-relaxed transition-all duration-500`}>
          {view === 'hindi' && (
            <div className="font-hindi text-xl md:text-2xl space-y-8 opacity-100" dangerouslySetInnerHTML={{ __html: post.content }}>
            </div>
          )}

          {view === 'english' && (
            <div className="font-display text-lg md:text-xl space-y-8 animate-fade-in">
              {hasTranslation ? (
                <div dangerouslySetInnerHTML={{ __html: post.englishTranslation! }} />
              ) : (
                <p className="text-slate-400 italic">English translation is not available yet.</p>
              )}
            </div>
          )}

          {view === 'summary' && (
            <div className="rounded-lg bg-brand-navy/5 p-8 font-display text-lg">
              <h4 className="mb-4 font-bold uppercase tracking-widest text-brand-gold flex items-center gap-2">
                <Sparkles size={16} /> Executive Summary
              </h4>
              {hasSummary ? (
                <p className="leading-relaxed">{post.englishSummary}</p>
              ) : (
                <p className="text-slate-400 italic">Summary is not available yet.</p>
              )}
            </div>
          )}
        </article>

        {/* Key Dates Component - Only show if dates exist */}
        {hasDates && <ImportantDates dates={post.importantDates} />}

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

