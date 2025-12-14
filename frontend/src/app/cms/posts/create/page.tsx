'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { categoriesAPI } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/cms/ImageUpload';
import { RichTextEditor } from '@/components/cms/RichTextEditor';
import toast from 'react-hot-toast';
import type { Category } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function CreatePostPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        tags: '',
        status: 'draft' as 'draft' | 'published',
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await categoriesAPI.getAll();
            setCategories(data);
        } catch (error) {
            toast.error('Failed to load categories');
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
            
            // Create FormData for multipart upload
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('content', formData.content);
            submitData.append('excerpt', formData.excerpt);
            submitData.append('category', formData.category);
            submitData.append('status', formData.status);
            
            // Add tags
            const tagsArray = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [];
            submitData.append('tags', JSON.stringify(tagsArray));

            // Add image if selected
            if (imageFile) {
                submitData.append('featuredImage', imageFile);
            }

            // Get token
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login first');
                router.push('/auth/login');
                return;
            }

            // Make API call
            const response = await fetch(`${API_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: submitData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || errorData.error || 'Failed to create post');
            }

            const result = await response.json();
            console.log('Post created:', result);

            toast.success('Post created successfully!');
            router.push('/cms/posts');
        } catch (error: any) {
            console.error('Create post error:', error);
            toast.error(error.message || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Post</h1>
                <p className="text-gray-600">Share your thoughts with the world</p>
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
                    value=""
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
                        {loading ? 'Creating...' : 'Create Post'}
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