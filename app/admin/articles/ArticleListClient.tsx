"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { Globe, EyeOff, Eye, Clock, Edit3, Search, X } from 'lucide-react';
import Link from 'next/link';
import { unlistArticle, republishArticle } from '@/app/admin/write/actions';
import { searchAdminArticles } from './actions';
import { VirtualizedList } from '@/components/VirtualizedList';

interface Article {
  id: string;
  title_hindi: string;
  slug: string;
  status: string;
  created_at: Date | string;
  published_at: Date | string | null;
}

interface Props {
  initialArticles: Article[];
  initialCursor: string | null;
  initialHasMore: boolean;
}

export default function ArticleListClient({ 
  initialArticles, 
  initialCursor, 
  initialHasMore 
}: Props) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'PUBLISHED' | 'UNLISTED' | 'DRAFT'>('all');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Article[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length < 2) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchAdminArticles(searchQuery, activeTab);
        setSearchResults(results as Article[]);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, activeTab]);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
  };

  // Load more articles
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (cursor) params.set('cursor', cursor);
      params.set('limit', '20');

      const res = await fetch(`/api/admin/articles?${params}`);
      const result = await res.json();

      setArticles(prev => [...prev, ...result.data]);
      setCursor(result.meta.nextCursor);
      setHasMore(result.meta.hasNextPage);
    } catch (error) {
      console.error('Failed to load more articles:', error);
    } finally {
      setIsLoading(false);
    }
  }, [cursor, hasMore, isLoading]);

  // Filter based on active tab
  const filtered = activeTab === 'all' 
    ? articles 
    : articles.filter(a => a.status === activeTab);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    if (currentStatus === 'PUBLISHED') {
      if (confirm("Are you sure you want to unlist this article? It will be hidden from the homepage.")) {
        const res = await unlistArticle(id);
        if (res.success) {
          setArticles(articles.map(a => 
            a.id === id ? { ...a, status: 'UNLISTED' } : a
          ));
        }
      }
    } else if (currentStatus === 'UNLISTED') {
      const res = await republishArticle(id);
      if (res.success) {
        setArticles(articles.map(a => 
          a.id === id ? { ...a, status: 'PUBLISHED' } : a
        ));
      }
    }
  };

  // Render a single article row
  const renderArticle = (article: Article) => (
    <div key={article.id} className="flex items-center justify-between px-6 py-5 border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <div className="flex flex-col gap-1.5 flex-1">
        <span className="font-hindi text-lg font-bold text-brand-navy">{article.title_hindi}</span>
        <StatusBadge status={article.status} />
      </div>
      <div className="px-6 text-sm text-slate-400 font-medium min-w-[120px]">
        {new Date(article.created_at).toLocaleDateString()}
      </div>
      <div className="flex items-center gap-2">
        <Link href={`/admin/write?edit=${article.id}`} className="p-2 text-slate-400 hover:text-brand-gold">
          <Edit3 size={18} />
        </Link>
        {article.status === 'PUBLISHED' && (
          <button 
            onClick={() => handleToggleStatus(article.id, article.status)} 
            className="p-2 text-slate-400 hover:text-amber-500"
            title="Unlist article"
          >
            <EyeOff size={18} />
          </button>
        )}
        {article.status === 'UNLISTED' && (
          <button 
            onClick={() => handleToggleStatus(article.id, article.status)} 
            className="p-2 text-slate-400 hover:text-emerald-500"
            title="Republish article"
          >
            <Eye size={18} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Tabs and Search */}
      <div className="px-8 py-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
            <button onClick={() => { setActiveTab('all'); clearSearch(); }} className={`px-4 py-1.5 text-xs font-bold uppercase rounded-lg transition-all ${activeTab === 'all' ? 'bg-white text-brand-navy shadow-sm' : 'text-slate-400'}`}>All ({articles.length})</button>
            <button onClick={() => { setActiveTab('PUBLISHED'); clearSearch(); }} className={`px-4 py-1.5 text-xs font-bold uppercase rounded-lg transition-all ${activeTab === 'PUBLISHED' ? 'bg-white text-brand-navy shadow-sm' : 'text-slate-400'}`}>Public</button>
            <button onClick={() => { setActiveTab('UNLISTED'); clearSearch(); }} className={`px-4 py-1.5 text-xs font-bold uppercase rounded-lg transition-all ${activeTab === 'UNLISTED' ? 'bg-white text-brand-navy shadow-sm' : 'text-slate-400'}`}>Unlisted</button>
            <button onClick={() => { setActiveTab('DRAFT'); clearSearch(); }} className={`px-4 py-1.5 text-xs font-bold uppercase rounded-lg transition-all ${activeTab === 'DRAFT' ? 'bg-white text-brand-navy shadow-sm' : 'text-slate-400'}`}>Drafts</button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search titles..."
              className="pl-10 pr-8 py-2 w-64 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20"
            />
            {searchQuery && (
              <button onClick={clearSearch} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            )}
            {isSearching && (
              <div className="absolute right-8 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Virtualized Article List */}
      <div className="flex-1 px-8 pb-12">
        <div className="rounded-2xl border border-brand-navy/5 bg-white overflow-hidden shadow-sm">
          {/* Header */}
          <div className="flex items-center bg-brand-navy/5 text-[10px] font-black uppercase tracking-widest text-slate-500 px-6 py-4">
            <div className="flex-1">Title & Status</div>
            <div className="min-w-[120px] px-6">Date Created</div>
            <div className="w-[100px] text-right">Actions</div>
          </div>

          {/* Virtualized List - use search results if searching */}
          <VirtualizedList
            items={searchResults !== null ? searchResults : filtered}
            renderItem={renderArticle}
            estimatedItemHeight={80}
            onLoadMore={loadMore}
            hasNextPage={searchResults === null && hasMore && activeTab === 'all'}
            isLoading={isLoading}
            className="h-[calc(100vh-300px)]"
            emptyComponent={
              <div className="p-12 text-center text-slate-400">
                {searchResults !== null ? 'No matching articles found' : 'No articles found'}
              </div>
            }
          />
        </div>
      </div>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { icon: React.ReactNode; label: string; styles: string }> = {
    PUBLISHED: { icon: <Globe size={10} />, label: 'Public', styles: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    UNLISTED: { icon: <EyeOff size={10} />, label: 'Unlisted', styles: 'bg-sky-50 text-sky-700 border-sky-100' },
    DRAFT: { icon: <Clock size={10} />, label: 'Draft', styles: 'bg-slate-50 text-slate-600 border-slate-200' },
  };
  const config = configs[status] || configs.DRAFT;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter ${config.styles}`}>
      {config.icon} {config.label}
    </span>
  );
}