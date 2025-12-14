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
    const [meta, setMeta] = useState({ total: 0, limit: 10, page: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Only pass category if it's not empty
            const params: any = {
                page: options.page || 1,
                limit: options.limit || 10,
            };
            
            if (options.category && options.category !== '') {
                params.category = options.category;
            }
            
            if (options.search && options.search.trim() !== '') {
                params.search = options.search.trim();
            }
            
            const response = await postsAPI.getPublished(params);
            
            // Handle response format
            if (response.data && Array.isArray(response.data)) {
                setPosts(response.data);
                if (response.meta) {
                    setMeta({
                        total: response.meta.total || 0,
                        limit: response.meta.limit || 10,
                        page: response.meta.page || 1,
                    });
                }
            } else if (Array.isArray(response)) {
                setPosts(response);
                setMeta({
                    total: response.length,
                    limit: options.limit || 10,
                    page: options.page || 1,
                });
            } else {
                console.error('Unexpected response format:', response);
                setPosts([]);
            }
        } catch (err: any) {
            console.error('Fetch posts error:', err);
            setError(err.message || 'Failed to fetch posts');
            setPosts([]);
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
                console.error('Fetch post error:', err);
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