import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogFeed from '@/components/BlogFeed';
import { getLatestPosts } from '../actions';

// Force dynamic rendering (no caching)
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Journal | Acharya Rajesh ',
  description: 'Explore the complete collection of Vedic Astrology articles, daily horoscopes, and spiritual insights.',
};

export default async function JournalPage() {
  const { posts, hasMore, nextCursor } = await getLatestPosts(10);

  return (
    <div className="min-h-screen bg-brand-paper selection:bg-brand-gold/30">
      <Navbar />
      
      <main className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        {/* Header */}
        <section className="mb-12 text-center">
          <p className="mb-4 text-sm italic text-brand-gold font-medium">
            The Complete Archive
          </p>
          <h1 className="text-4xl md:text-5xl font-normal tracking-tight text-brand-navy">
            Vedic Journal
          </h1>
          <div className="mx-auto mt-8 h-px w-24 bg-brand-gold/40"></div>
        </section>

        {/* Blog Feed with Infinite Scroll */}
        <BlogFeed
          initialPosts={posts}
          initialHasMore={hasMore}
          initialNextCursor={nextCursor}
        />
      </main>

      <Footer />
    </div>
  );
}
