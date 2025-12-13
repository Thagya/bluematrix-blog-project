import { useState, useEffect } from 'react';
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

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await postsAPI.getPublished(options);
            setPosts(response.data || []);
            if (response.meta) {
                setMeta(response.meta);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [options.category, options.page, options.limit, options.search]);

    const refetch = () => {
        fetchPosts();
    };

    return { posts, loading, error, refetch, meta };
}

export function usePost(id: string) {
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const response = await postsAPI.getOne(id);
                setPost(response);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch post');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    return { post, loading, error };
}
