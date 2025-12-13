import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types';
import { formatDate, truncate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <Link href={`/post/${post._id}`}>
        <div className="relative h-48 bg-gray-200">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
              <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
              {post.category?.name || 'Uncategorized'}
            </span>
            <span className="text-sm text-gray-500">{formatDate(post.createdAt)}</span>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {post.title}
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {post.excerpt || truncate(post.content.replace(/<[^>]*>/g, ''), 150)}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {post.author?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <span className="text-sm text-gray-700">{post.author?.name || 'Unknown'}</span>
            </div>
            
            <span className="text-blue-600 text-sm font-medium hover:underline">
              Read more →
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}