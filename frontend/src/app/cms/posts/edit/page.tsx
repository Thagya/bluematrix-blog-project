'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { RichTextEditor } from '@/components/cms/RichTextEditor';
import { Loading } from '@/components/ui/Loading';
import toast from 'react-hot-toast';
import Image from 'next/image';
import type { Category, Post } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuth();
    const postId = params.id as string;
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [post, setPost] = useState<Post | null>(null);
    const [canEdit, setCanEdit] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        tags: '',
        status: 'draft' as 'draft' | 'published',
    });

    useEffect(() => {
        if (postId && user) {
            fetchData();
        }
    }, [postId, user]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const [postRes, categoriesRes] = await Promise.all([
                fetch(`${API_URL}/posts/${postId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_URL}/categories`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            if (!postRes.ok || !categoriesRes.ok) {
                throw new Error('Failed to load data');
            }

            const postData = await postRes.json();
            const categoriesData = await categoriesRes.json();

            const authorId = typeof postData.author === 'object' 
                ? postData.author._id || postData.author.id 
                : postData.author;
            
            const userCanEdit = authorId === user?.id;
            setCanEdit(userCanEdit);

            if (!userCanEdit) {
                toast.error('You can only edit posts you created');
                router.push('/cms/posts');
                return;
            }

            setPost(postData);
            setCategories(categoriesData);
            
            const categoryId = typeof postData.category === 'object' 
                ? postData.category._id 
                : postData.category;
            
            setFormData({
                title: postData.title || '',
                content: postData.content || '',
                excerpt: postData.excerpt || '',
                category: categoryId || '',
                tags: postData.tags?.join(', ') || '',
                status: postData.status || 'draft',
            });
        } catch (error: any) {
            console.error('Failed to load post:', error);
            toast.error('Failed to load post');
            router.push('/cms/posts');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!canEdit) {
            toast.error('You can only edit posts you created');
            return;
        }

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
            setSaving(true);
            const tagsArray = formData.tags 
                ? formData.tags.split(',').map(t => t.trim()).filter(t => t) 
                : [];

            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: formData.title,
                    content: formData.content,
                    excerpt: formData.excerpt,
                    category: formData.category,
                    tags: tagsArray,
                    status: formData.status,
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to update post');
            }

            toast.success('Post updated successfully!');
            router.push('/cms/posts');
        } catch (error: any) {
            console.error('Update error:', error);
            if (error.message.includes('403') || error.message.includes('Forbidden')) {
                toast.error('You are not authorized to edit this post');
            } else {
                toast.error(error.message || 'Failed to update post');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto py-12">
                <Loading />
            </div>
        );
    }

    if (!post || !canEdit) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
                    <p className="text-gray-600 mb-6">You can only edit posts you created.</p>
                    <Button onClick={() => router.push('/cms/posts')}>
                        Back to My Posts
                    </Button>
                </div>
            </div>
        );
    }

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

                {post.featuredImage && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Featured Image
                        </label>
                        <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100">
                            <Image 
                                src={post.featuredImage} 
                                alt="Featured" 
                                fill
                                className="object-cover"
                                sizes="(max-width: 1200px) 100vw, 1200px"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Note: Image cannot be changed after creation
                        </p>
                    </div>
                )}

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
                    <Button type="submit" variant="primary" isLoading={saving}>
                        {saving ? 'Updating...' : 'Update Post'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/cms/posts')}
                        disabled={saving}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}