import { getAdminArticlesPaginated } from "./data";
import { isAdmin } from "@/lib/auth-utils";
import { redirect } from 'next/navigation';
import ArticleListClient from "./ArticleListClient";
import Link from "next/link";
import Image from "next/image";
import { Plus, LayoutDashboard, FileText } from "lucide-react";

// Force dynamic rendering to ensure searchParams are processed correctly
export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminArticlesPage({ searchParams }: PageProps) {
  // 1. Protection
  const authorized = await isAdmin();
  if (!authorized) {
    redirect('/unauthorized');
  }

  const resolvedParams = await searchParams;
  const status = (resolvedParams.status as 'PUBLISHED' | 'UNLISTED' | 'DRAFT') || null;
  console.log('AdminArticlesPage searchParams:', resolvedParams, 'Resolved Status:', status);

  // 2. Fetch first page of paginated data
  const { data: initialArticles, meta } = await getAdminArticlesPaginated(null, 20, status);

  return (
    <div className="flex h-screen bg-brand-paper overflow-hidden">
      {/* SIDEBAR */}
      <aside className="hidden w-64 flex-col border-r border-brand-navy/10 bg-white lg:flex">
        <div className="p-6 border-b border-brand-navy/5">
          <Link href="/" className="flex items-center gap-3 text-brand-navy font-bold group">
            <div className="relative w-8 h-8 overflow-hidden rounded-full border border-brand-gold">
              <Image 
                src="/logo_new.webp" 
                alt="Logo" 
                fill
                className="object-cover scale-140"
                sizes="32px"
              />
            </div>
            Admin Dashboard
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/write" className="flex items-center gap-3 rounded-lg bg-brand-navy px-3 py-2 text-sm font-bold text-brand-gold shadow-lg hover:bg-brand-navy/90 transition-all mb-6">
            <Plus size={18} /> New Article
          </Link>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 mb-2">Content</p>
          <div className="flex w-full items-center gap-3 rounded-lg bg-brand-navy/5 px-3 py-2 text-sm font-bold text-brand-navy cursor-default">
            <FileText size={18} /> All Articles
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-brand-navy/5 bg-white px-8">
          <h1 className="text-xl font-bold text-brand-navy uppercase tracking-tight font-display italic">Article Management</h1>
        </header>

        {/* Pass paginated data to the Client */}
        <ArticleListClient 
          initialArticles={initialArticles} 
          initialCursor={meta.nextCursor}
          initialHasMore={meta.hasNextPage}
        />
      </main>
    </div>
  );
}
