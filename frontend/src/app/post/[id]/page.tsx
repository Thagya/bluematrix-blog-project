'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { usePost } from '@/hooks/usePosts';
import { Loading } from '@/components/ui/Loading';
import { formatDate, getImageUrl } from '@/lib/utils';

export default function PostPage() {
  const params = useParams();
  const postId = params.id as string;
  const { post, loading, error } = usePost(postId);

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
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
        <Link href="/" className="text-blue-600 hover:text-blue-700">
          ← Back to home
        </Link>
      </div>
    );
  }

  const categoryName = (post.category && typeof post.category === 'object' && post.category.name)
    ? post.category.name
    : 'Uncategorized';

  const authorName = (post.author && typeof post.author === 'object' && post.author.name)
    ? post.author.name
    : 'Unknown Author';

  const authorInitial = authorName.charAt(0).toUpperCase();

  const imageUrl = getImageUrl(post.featuredImage);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/" className="text-blue-600 hover:text-blue-700 mb-6 inline-block">
        ← Back to Blog
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {categoryName}
          </span>
          <span className="text-gray-500 text-sm">{formatDate(post.createdAt)}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {authorInitial}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{authorName}</p>
            <p className="text-gray-500 text-sm">Author</p>
          </div>
        </div>
      </header>

      {imageUrl && (
        <div className="relative h-96 mb-8 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            unoptimized
            onError={(e) => {
              console.error('Image load error:', imageUrl);
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}

      {post.excerpt && (
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
          <p className="text-lg text-gray-700 italic">{post.excerpt}</p>
        </div>
      )}

      <div className="prose prose-lg max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => {
              // Clean up tag string - remove brackets and quotes if present
              const cleanTag = typeof tag === 'string'
                ? tag.replace(/[\[\]"]/g, '').trim()
                : String(tag);

              return cleanTag ? (
                <span
                  key={index}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                >
                  #{cleanTag}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </article>
  );
}