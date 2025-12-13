'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { usePost } from '@/hooks/usePosts';
import { Loading } from '@/components/ui/Loading';
import { formatDate } from '@/lib/utils';

export default function PostPage() {
  const params = useParams();
  const { post, loading, error } = usePost(params.slug as string);

  if (loading) return <Loading />;

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
        <Link href="/" className="text-blue-600 hover:text-blue-700">
          ← Back to home
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/" className="text-blue-600 hover:text-blue-700 mb-6 inline-block">
        ← Back to posts
      </Link>

      <header className="mb-8">
        <div className="mb-4">
          <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-full">
            {post.category?.name}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {post.author?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <span className="font-medium">{post.author?.name}</span>
          </div>
          <span>•</span>
          <time>{formatDate(post.createdAt)}</time>
        </div>
      </header>

      {post.featuredImage && (
        <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}