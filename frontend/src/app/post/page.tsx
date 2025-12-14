'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePost } from '@/hooks/usePosts';
import { Loading } from '@/components/ui/Loading';
import { formatDate } from '@/lib/utils';

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { post, loading, error } = usePost(resolvedParams.id);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Loading />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-lg shadow-md p-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
          <p className="text-gray-600 mb-6">The post you're looking for doesn't exist or has been removed.</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/" className="text-blue-600 hover:text-blue-700 mb-6 inline-flex items-center font-medium">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to posts
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {post.featuredImage && (
          <div className="relative h-96 w-full bg-gray-100">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              onError={(e) => {
                console.error('Image failed to load:', post.featuredImage);
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="p-8">
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-full">
                {post.category?.name || 'Uncategorized'}
              </span>
              <span className="text-sm text-gray-500">
                {formatDate(post.createdAt)}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-6">
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {post.author?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{post.author?.name || 'Unknown Author'}</p>
                <p className="text-sm text-gray-500">{post.author?.email}</p>
              </div>
            </div>
          </header>

          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}