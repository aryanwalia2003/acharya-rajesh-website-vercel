import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getLatestPosts } from './actions';
import { ArrowRight, Star, Moon, Sun, Calendar } from 'lucide-react';

export default async function Home() {
  // Fetch only top 3 posts for the teaser section
  const { posts } = await getLatestPosts(3);

  return (
    <div className="min-h-screen bg-brand-paper selection:bg-brand-gold/30">
      <Navbar />
      
      <main>
        {/* HERO SECTION */}
        <section className="relative px-6 py-20 md:py-32 text-center overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-gold/5 rounded-full blur-3xl -z-10"></div>
          
          <div className="mx-auto max-w-4xl relative z-10">
            <span className="inline-block mb-6 rounded-full border border-brand-gold/30 bg-brand-gold/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-navy">
              Vedic Astrology & Spiritual Guidance
            </span>
            <h1 className="mb-8 text-5xl md:text-7xl font-display font-medium text-brand-navy leading-tight">
              Align Your Life with <br/>
              <span className="italic text-brand-gold">Cosmic Wisdom</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-brand-navy/70 leading-relaxed font-hindi">
              Discover clarity in chaos through ancient Vedic insights. Acharya Rajesh brings you precise predictions, remedial measures, and spiritual counseling to navigate life's journey.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Link 
                href="/book" 
                className="rounded-full bg-brand-navy px-8 py-4 text-sm font-bold uppercase tracking-widest text-brand-gold shadow-xl hover:bg-brand-navy/90 transition-all hover:scale-105 active:scale-95"
              >
                Book Consultation
              </Link>
              <Link 
                href="/journal" 
                className="flex items-center gap-2 text-brand-navy font-bold text-sm uppercase tracking-widest hover:text-brand-gold transition-colors"
              >
                Read the Journal <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* SERVICES TEASER */}
        <section className="px-6 py-20 bg-brand-navy/5 border-y border-brand-navy/5">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-display text-brand-navy mb-4">Holistic Services</h2>
              <div className="h-1 w-12 bg-brand-gold mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Service 1 */}
              <div className="bg-brand-paper p-8 rounded-2xl border border-brand-navy/5 hover:border-brand-gold/30 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-brand-navy rounded-full flex items-center justify-center mb-6 text-brand-gold group-hover:scale-110 transition-transform">
                  <Moon size={24} />
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-3">Horoscope Analysis</h3>
                <p className="text-brand-navy/60 mb-6 text-sm leading-relaxed">
                  Deep dive into your birth chart (Kundli) to understand your personality, destiny, and life path.
                </p>
                <Link href="/services/kundli" className="text-xs font-bold uppercase tracking-widest text-brand-gold hover:text-brand-navy transition-colors">Learn More &rarr;</Link>
              </div>

              {/* Service 2 */}
              <div className="bg-brand-paper p-8 rounded-2xl border border-brand-navy/5 hover:border-brand-gold/30 hover:shadow-lg transition-all group">
                 <div className="w-12 h-12 bg-brand-navy rounded-full flex items-center justify-center mb-6 text-brand-gold group-hover:scale-110 transition-transform">
                  <Sun size={24} />
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-3">Karam Kaand</h3>
                <p className="text-brand-navy/60 mb-6 text-sm leading-relaxed">
                  Comprehensive compatibility analysis (Gun Milan) for a harmonious and prosperous marital life.
                </p>
                <Link href="/services/match-making" className="text-xs font-bold uppercase tracking-widest text-brand-gold hover:text-brand-navy transition-colors">Learn More &rarr;</Link>
              </div>

              {/* Service 3 */}
              <div className="bg-brand-paper p-8 rounded-2xl border border-brand-navy/5 hover:border-brand-gold/30 hover:shadow-lg transition-all group">
                 <div className="w-12 h-12 bg-brand-navy rounded-full flex items-center justify-center mb-6 text-brand-gold group-hover:scale-110 transition-transform">
                  <Star size={24} />
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-3">Vastu</h3>
                <p className="text-brand-navy/60 mb-6 text-sm leading-relaxed">
                  Identify the most auspicious times to start new ventures, investments, or important life events.
                </p>
                <Link href="/services/muhurat" className="text-xs font-bold uppercase tracking-widest text-brand-gold hover:text-brand-navy transition-colors">Learn More &rarr;</Link>
              </div>
            </div>
          </div>
        </section>

        {/* LATEST FROM JOURNAL */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-4xl">
             <div className="flex items-center justify-between mb-12">
               <div>
                  <h2 className="text-3xl font-display text-brand-navy">Latest Insights</h2>
                  <p className="text-sm text-brand-navy/50 mt-2">Updates from the Vedic Journal</p>
               </div>
               <Link href="/journal" className="hidden md:flex text-xs font-bold uppercase tracking-widest text-brand-navy hover:text-brand-gold transition-colors items-center gap-2">
                 View All <ArrowRight size={14} />
               </Link>
            </div>

            <div className="space-y-8">
              {posts.map((post) => (
                <Link 
                  key={post.slug} 
                  href={`/blog/${post.slug}`}
                  className="block group"
                >
                  <article className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-white border border-brand-navy/5 hover:border-brand-gold/30 hover:shadow-md transition-all">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                         <span className="px-2 py-1 rounded bg-brand-navy/5 text-[10px] font-bold uppercase tracking-wider text-brand-navy/70">
                            {post.category}
                         </span>
                         <span className="text-[10px] uppercase tracking-wider text-brand-navy/40 font-bold flex items-center gap-1">
                            <Calendar size={10} /> {post.date}
                         </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-brand-navy mb-3 font-hindi group-hover:text-brand-gold transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-brand-navy/60 text-sm leading-relaxed line-clamp-2 md:line-clamp-3 font-hindi">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="md:self-center">
                       <span className="text-xs font-bold uppercase tracking-widest text-brand-gold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                         Read Article <ArrowRight size={14} />
                       </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center md:hidden">
               <Link href="/journal" className="inline-block rounded-full border border-brand-navy/10 px-6 py-3 text-xs font-bold uppercase tracking-widest text-brand-navy hover:bg-brand-navy hover:text-brand-gold transition-colors">
                 View All Articles
               </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}