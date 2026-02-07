import Navbar from '@/components/Navbar';
import BlogCard from '@/components/BlogCard';
import { getLatestPosts } from './actions';

export default async function Home() {
  const featuredBlogs = await getLatestPosts(10);

  return (
    <div className="min-h-screen bg-brand-paper selection:bg-brand-gold/30">
      <Navbar />
      
      <main className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        {/* Intro Header */}
        <section className="mb-20 text-center">
          <p className="mb-4 text-sm italic text-brand-gold font-medium">
            Ancient Wisdom for the Modern Seeker
          </p>
          <h1 className="text-4xl md:text-5xl font-normal tracking-tight text-brand-navy">
            The Vedic Scholar
          </h1>
          <div className="mx-auto mt-8 h-px w-24 bg-brand-gold/40"></div>
        </section>

        {/* Blog Feed */}
        <div className="flex flex-col">
          {featuredBlogs.length > 0 ? (
            featuredBlogs.map((blog) => (
              <BlogCard key={blog.slug} {...blog} />
            ))
          ) : (
             <div className="text-center py-12 text-slate-400">
                <p className="text-sm">No articles published yet.</p>
                <p className="text-xs mt-2">Come back soon for astrological insights.</p>
             </div>
          )}
        </div>

        {/* Load More */}
        {featuredBlogs.length >= 10 && (
          <div className="mt-12 flex justify-center border-t border-brand-navy/5 pt-12">
            <button className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-brand-gold transition-colors">
              View Older Entries
            </button>
          </div>
        )}
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-brand-navy/5 py-12 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          © {new Date().getFullYear()} Acharya Rajesh Walia. All Wisdom Reserved.
        </p>
      </footer>
    </div>
  );
}