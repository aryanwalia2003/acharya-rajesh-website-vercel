"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import BlogCard from "./BlogCard";
import { getLatestPosts, searchPosts, Post } from "@/app/actions";

type BlogFeedProps = {
  initialPosts: Post[];
  initialHasMore: boolean;
  initialNextCursor: string | null;
};

export default function BlogFeed({
  initialPosts,
  initialHasMore,
  initialNextCursor,
}: BlogFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
  const [isLoading, setIsLoading] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Ref for the sentinel element
  const sentinelRef = useRef<HTMLDivElement>(null);

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
        const results = await searchPosts(searchQuery);
        setSearchResults(results);
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
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
  };

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore || !nextCursor || searchResults !== null) return;

    setIsLoading(true);
    try {
      const result = await getLatestPosts(10, nextCursor);
      setPosts((prev) => [...prev, ...result.posts]);
      setHasMore(result.hasMore);
      setNextCursor(result.nextCursor);
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, nextCursor, searchResults]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || searchResults !== null) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoading, loadMore, searchResults]);

  const displayPosts = searchResults !== null ? searchResults : posts;

  return (
    <>
      {/* Search Input */}
      <div className="mb-12">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="खोजें... (Search articles)"
            className="w-full pl-12 pr-10 py-3 text-base border border-brand-navy/10 rounded-full bg-white focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all"
          />
          {searchQuery && (
            <button onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>
          )}
          {isSearching && (
            <div className="absolute right-12 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
            </div>
          )}
        </div>
        {searchResults !== null && (
          <p className="text-center text-sm text-slate-400 mt-3">
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
          </p>
        )}
      </div>

      <div className="flex flex-col">
        {displayPosts.length > 0 ? (
          displayPosts.map((blog) => <BlogCard key={blog.slug} {...blog} />)
        ) : (
          <div className="text-center py-12 text-slate-400">
            {searchResults !== null ? (
              <p className="text-sm">No articles found matching your search.</p>
            ) : (
              <>
                <p className="text-sm">No articles published yet.</p>
                <p className="text-xs mt-2">Come back soon for astrological insights.</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Sentinel element for intersection observer (only when not searching) */}
      {searchResults === null && <div ref={sentinelRef} className="h-4" />}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 animate-pulse">
            Loading more entries...
          </div>
        </div>
      )}

      {/* End of content indicator */}
      {!hasMore && displayPosts.length > 0 && searchResults === null && (
        <div className="mt-8 flex justify-center border-t border-brand-navy/5 pt-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">
            You&apos;ve reached the end
          </p>
        </div>
      )}
    </>
  );
}

