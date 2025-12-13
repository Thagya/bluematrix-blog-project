'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/cms/ImageUpload';
import { Category } from '@/types';

interface PostFormProps {
    initialData?: {
        title: string;
        content: string;
        excerpt: string;
        category: string;
        tags: string;
        status: 'draft' | 'published';
    };
    categories: Category[];
    onSubmit: (data: any, imageFile: File | null) => Promise<void>;
    onCancel: () => void;
    submitLabel?: string;
}

export function PostForm({
    initialData,
    categories,
    onSubmit,
    onCancel,
    submitLabel = 'Create Post'
}: PostFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        content: initialData?.content || '',
        excerpt: initialData?.excerpt || '',
        category: initialData?.category || '',
        tags: initialData?.tags || '',
        status: (initialData?.status || 'draft') as 'draft' | 'published',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await onSubmit(formData, imageFile);
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}

            <Input
                label="Post Title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter an engaging title for your post"
            />

            <Textarea
                label="Content"
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your post content here... You can use HTML tags for formatting."
                rows={12}
            />

            <Textarea
                label="Excerpt (Optional)"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="A brief summary that will appear on the blog listing page"
                rows={3}
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                </label>
                <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                label="Tags (Optional, comma-separated)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="technology, web development, tutorial"
            />

            {!initialData && (
                <ImageUpload
                    value=""
                    onChange={(file: any) => setImageFile(file)}
                />
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Publication Status
                </label>
                <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                    <option value="draft">Draft - Only visible to you</option>
                    <option value="published">Published - Visible on the blog</option>
                </select>
            </div>

            <div className="flex gap-4 pt-4">
                <Button type="submit" isLoading={loading}>
                    {submitLabel}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}