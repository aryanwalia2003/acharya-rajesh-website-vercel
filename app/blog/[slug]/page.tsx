import { getPostBySlug } from '@/app/actions';
import Navbar from '@/components/Navbar';
import ImportantDates from '@/components/ImportantDates';
import { Share2, Bookmark } from 'lucide-react';
import { notFound } from 'next/navigation';
import ClientBlogPost from './ClientBlogPost';

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Pass data to a client component for interactive features (language switching)
  return <ClientBlogPost post={post} />;
}