import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types';
import { formatDate, truncate, getImageUrl } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const getCleanText = (html: string) => {
    if (typeof window === 'undefined') return '';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  const excerpt = post.excerpt || truncate(getCleanText(post.content), 150);

  const categoryName = (post.category && typeof post.category === 'object' && post.category.name)
    ? post.category.name
    : 'Uncategorized';

  const authorName = (post.author && typeof post.author === 'object' && post.author.name)
    ? post.author.name
    : 'Unknown';

  const imageUrl = getImageUrl(post.featuredImage);

  return (
    <Card className="hover:shadow-xl transition-all duration-300 overflow-hidden p-0">
      <Link href={`/post/${post._id}`} className="block">
        <div className="relative h-48 w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
              onError={(e) => {
                console.error('Image load error:', imageUrl);
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
              <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
              {categoryName}
            </span>
            <span className="text-sm text-gray-500">{formatDate(post.createdAt)}</span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {post.title}
          </h3>

          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {excerpt}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-semibold">
                  {authorName.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-700 font-medium">{authorName}</span>
            </div>

            <span className="text-blue-600 text-sm font-medium group-hover:underline flex items-center gap-1">
              Read more
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}