'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Category } from '@/types';

interface CategoryFormProps {
    initialData?: Category;
    onSubmit: (data: { name: string }) => Promise<void>;
    isLoading?: boolean;
}

export function CategoryForm({ initialData, onSubmit, isLoading }: CategoryFormProps) {
    const [name, setName] = useState(initialData?.name || '');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit({ name });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Category Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g., Technology"
            />
            <Button type="submit" isLoading={isLoading}>
                {initialData ? 'Update Category' : 'Create Category'}
            </Button>
        </form>
    );
}
