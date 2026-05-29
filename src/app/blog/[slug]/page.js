import Link from 'next/link';
import { blogPosts } from '@/utils/blogData';
import { BookOpen } from 'lucide-react';
import PostClient from './post-client';
import { getMetadata, getJsonLdSchema } from '@/utils/seo';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) {
    return {
      title: 'Blog Post Not Found | SQL Beast',
    };
  }
  return getMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${slug}`,
    ogType: 'article',
    publishedTime: post.publishedAt,
  });
}

export default async function BlogPostDetail({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="py-24 text-center space-y-4 max-w-md mx-auto animate-pulse">
        <BookOpen size={48} className="text-gray-600 mx-auto" />
        <h2 className="text-lg font-black">Blog Post Not Found</h2>
        <p className="text-xs text-gray-500">The article you are searching for might have been moved or removed.</p>
        <Link href="/blog" className="inline-block text-xs font-bold text-brand-primary hover:underline">
          Return to Blog Directory
        </Link>
      </div>
    );
  }

  // Get other posts for related suggestions
  const relatedPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 2);

  // Generate structured schema
  const schema = getJsonLdSchema('BlogPosting', post);

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <PostClient post={post} relatedPosts={relatedPosts} />
    </>
  );
}
