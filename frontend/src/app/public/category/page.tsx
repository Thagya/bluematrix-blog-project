'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { PostCard } from '@/components/blog/PostCard';
import { Loading } from '@/components/ui/Loading';
import { usePosts } from '@/hooks/usePosts';
import { useCategories } from '@/hooks/useCategories';

export default function CategoryPage() {
  const params = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  
  const { posts, loading, meta } = usePosts({
    category: params.id as string,
    page: currentPage,
  });

  const { categories } = useCategories();
  const currentCategory = categories.find(cat => cat._id === params.id);

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Back to all posts
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {currentCategory?.name || 'Category'}
        </h1>
        <p className="text-gray-600">
          {meta.total} {meta.total === 1 ? 'post' : 'posts'} in this category
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No posts found</h3>
          <p className="mt-2 text-gray-500">This category doesn't have any posts yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {meta.total > meta.limit && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Page {currentPage} of {Math.ceil(meta.total / meta.limit)}
              </span>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage >= Math.ceil(meta.total / meta.limit)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}