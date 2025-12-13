'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { postsAPI, categoriesAPI } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/cms/ImageUpload';
import { RichTextEditor } from '@/components/cms/RichTextEditor';
import toast from 'react-hot-toast';
import type { Category } from '@/types';

export default function CreatePostPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        tags: '',
        featuredImage: '',
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.category) {
            toast.error('Please select a category');
            return;
        }

        try {
            setLoading(true);
            const tagsArray = formData.tags ? formData.tags.split(',').map(t => t.trim()) : [];

            await postsAPI.create({
                ...formData,
                tags: tagsArray,
            });

            toast.success('Post created successfully!');
            router.push('/cms/posts');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to create post');
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

            <form onSubmit={handleSubmit} className="card space-y-6">
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
                    onChange={(url) => setFormData({ ...formData, featuredImage: url })}
                    value={formData.featuredImage}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                    </label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="input-field"
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
                                className="text-purple-600 focus:ring-purple-400"
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
                                className="text-purple-600 focus:ring-purple-400"
                            />
                            <span>Published</span>
                        </label>
                    </div>
                </div>

                <div className="flex space-x-4 pt-4">
                    <Button type="submit" variant="primary" isLoading={loading}>
                        Create Post
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}