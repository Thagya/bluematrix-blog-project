'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { categoriesAPI, postsAPI } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/cms/ImageUpload';
import { RichTextEditor } from '@/components/cms/RichTextEditor';
import { Loading } from '@/components/ui/Loading';
import toast from 'react-hot-toast';
import type { Category, Post } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const postId = params.id as string;

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [currentImageUrl, setCurrentImageUrl] = useState<string>('');

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        tags: '',
        status: 'draft' as 'draft' | 'published',
    });

    useEffect(() => {
        const init = async () => {
            try {
                await Promise.all([fetchCategories(), fetchPost()]);
            } catch (error) {
                console.error('Initialization error:', error);
            } finally {
                setInitialLoading(false);
            }
        };
        init();
    }, [postId]);

    const fetchCategories = async () => {
        try {
            const data = await categoriesAPI.getAll();
            setCategories(data);
        } catch (error) {
            toast.error('Failed to load categories');
        }
    };

    const fetchPost = async () => {
        try {
            const post = await postsAPI.getOne(postId);
            if (!post) {
                toast.error('Post not found');
                router.push('/cms/posts');
                return;
            }

            setFormData({
                title: post.title,
                content: post.content,
                excerpt: post.excerpt || '',
                category: typeof post.category === 'object' ? post.category._id : post.category,
                tags: post.tags ? post.tags.join(', ') : '',
                status: post.status,
            });

            if (post.featuredImage) {
                setCurrentImageUrl(post.featuredImage);
            }
        } catch (error) {
            console.error('Error fetching post:', error);
            toast.error('Failed to load post details');
            router.push('/cms/posts');
        }
    };

    const handleImageChange = (file: any) => {
        if (file instanceof File) {
            setImageFile(file);
        } else {
            setImageFile(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.category) {
            toast.error('Please select a category');
            return;
        }

        if (!formData.title.trim()) {
            toast.error('Please enter a title');
            return;
        }

        if (!formData.content.trim()) {
            toast.error('Please enter content');
            return;
        }

        try {
            setLoading(true);

            // If we have a new image file, we need to use FormData
            // If not, we can use JSON for the update if the backend supports it, 
            // OR we can use FormData for everything to be consistent. 
            // Let's use FormData to be safe and consistent with Create.

            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('content', formData.content);
            submitData.append('excerpt', formData.excerpt);
            submitData.append('category', formData.category);
            submitData.append('status', formData.status);

            const tagsArray = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [];
            tagsArray.forEach(tag => submitData.append('tags', tag));

            if (imageFile) {
                submitData.append('featuredImage', imageFile);
            }

            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login first');
                router.push('/auth/login');
                return;
            }

            // Note: The API might expect a PUT request with JSON or FormData. 
            // The `postsAPI.update` in `api.ts` uses JSON. 
            // If we need to upload an image during update, we might need a different API method or modify `update` to handle FormData.
            // Let's check `api.ts` again. It has `createWithFormData` but `update` sends JSON.
            // We should probably create `updateWithFormData` or just use fetch directly here like in `create/page.tsx` but with PUT.

            const response = await fetch(`${API_URL}/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: submitData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || errorData.error || 'Failed to update post');
            }

            const result = await response.json();
            console.log('Post updated:', result);

            toast.success('Post updated successfully!');
            router.push('/cms/posts');
        } catch (error: any) {
            console.error('Update post error:', error);
            toast.error(error.message || 'Failed to update post');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <Loading />;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Post</h1>
                <p className="text-gray-600">Update your blog post</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                <Input
                    label="Title"
                    placeholder="Enter post title..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />

                <RichTextEditor
                    value={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                />

                <Input
                    label="Excerpt (Optional)"
                    placeholder="Brief summary of your post..."
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                />

                <ImageUpload
                    onChange={handleImageChange}
                    value={currentImageUrl}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                    </label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <Input
                    label="Tags (comma separated)"
                    placeholder="e.g., technology, coding, tutorial"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                    </label>
                    <div className="flex space-x-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="status"
                                value="draft"
                                checked={formData.status === 'draft'}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                className="text-blue-600 focus:ring-blue-400"
                            />
                            <span>Draft</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="status"
                                value="published"
                                checked={formData.status === 'published'}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                className="text-blue-600 focus:ring-blue-400"
                            />
                            <span>Published</span>
                        </label>
                    </div>
                </div>

                <div className="flex space-x-4 pt-4">
                    <Button type="submit" variant="primary" isLoading={loading}>
                        {loading ? 'Updating...' : 'Update Post'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/cms/posts')}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
