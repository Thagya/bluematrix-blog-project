'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Search } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = 'Search...' }: SearchBarProps) {
    const [query, setQuery] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query);
        }, 500);

        return () => clearTimeout(timer);
    }, [query, onSearch]);

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="pl-10"
            />
        </div>
    );
}
