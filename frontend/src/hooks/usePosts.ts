import { useState, useEffect, useCallback } from 'react';
import { postsAPI } from '@/lib/api';
import { Post } from '@/types';

interface UsePostsOptions {
    category?: string;
    page?: number;
    limit?: number;
    search?: string;
}

export function usePosts(options: UsePostsOptions = {}) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [meta, setMeta] = useState({ total: 0, limit: 10, page: 1, pages: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await postsAPI.getPublished(options);
            setPosts(response.data || []);
            if (response.meta) {
                setMeta(response.meta);
            }
        } catch (err: any) {
            console.error('Error fetching posts:', err);
            setError(err.message || 'Failed to fetch posts');
            setPosts([]);
        } finally {
            setLoading(false);
        }
    }, [options.category, options.page, options.limit, options.search]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const refetch = useCallback(() => {
        fetchPosts();
    }, [fetchPosts]);

    return { posts, loading, error, refetch, meta };
}

export function usePost(id: string) {
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            if (!id) {
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                setError(null);
                const response = await postsAPI.getOne(id);
                setPost(response);
            } catch (err: any) {
                console.error('Error fetching post:', err);
                setError(err.message || 'Failed to fetch post');
                setPost(null);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    return { post, loading, error };
}