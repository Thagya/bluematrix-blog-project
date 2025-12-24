'use client';

import { useState, useEffect } from 'react';
import { PostList } from '@/components/blog/PostList';
import { SearchBar } from '@/components/blog/SearchBar';
import { CategoryFilter } from '@/components/blog/CategoryFilter';
import { Loading } from '@/components/ui/Loading';
import { Post, Category } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function HomePage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [meta, setMeta] = useState({ total: 0, limit: 10, page: 1 });

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, searchQuery]);

    useEffect(() => {
        fetchPosts();
    }, [selectedCategory, searchQuery, currentPage]);

    const fetchCategories = async () => {
        try {
            setCategoriesLoading(true);
            const response = await fetch(`${API_URL}/categories`);
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setCategoriesLoading(false);
        }
    };

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (selectedCategory) params.append('category', selectedCategory);
            if (searchQuery) params.append('q', searchQuery);
            params.append('page', currentPage.toString());
            params.append('limit', '10');

            console.log('Fetching posts with params:', params.toString());

            const response = await fetch(`${API_URL}/posts?${params.toString()}`);
            const data = await response.json();

            let fetchedPosts = data.data || [];

            // Client-side fallback filtering if backend returns all posts despite category param
            if (selectedCategory && fetchedPosts.length > 0) {
                const isFiltered = fetchedPosts.every((p: Post) => {
                    const catId = p.category && typeof p.category === 'object' ? p.category._id : p.category;
                    return catId === selectedCategory;
                });

                if (!isFiltered) {
                    console.warn('Backend returned unfiltered posts. Applying client-side filter.');
                    fetchedPosts = fetchedPosts.filter((p: Post) => {
                        const catId = p.category && typeof p.category === 'object' ? p.category._id : p.category;
                        return catId === selectedCategory;
                    });
                }
            }

            setPosts(fetchedPosts);
            if (data.meta) {
                setMeta(data.meta);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (categoryId: string | null) => {
        setSelectedCategory(categoryId || '');
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const totalPages = meta.total && meta.limit ? Math.ceil(meta.total / meta.limit) : 1;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Welcome to BlueMatrix Blog
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-100 max-w-3xl">
                        Discover insightful articles, tutorials, and stories from our community
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8 space-y-6">
                    <SearchBar onSearch={handleSearch} />

                    {!categoriesLoading && categories.length > 0 && (
                        <CategoryFilter
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onSelectCategory={handleCategoryChange}
                        />
                    )}
                </div>

                {(selectedCategory || searchQuery) && (
                    <div className="mb-6 flex flex-wrap gap-2">
                        {selectedCategory && (
                            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                <span>
                                    Category: {categories.find(c => c._id === selectedCategory)?.name || 'Unknown'}
                                </span>
                                <button
                                    onClick={() => setSelectedCategory('')}
                                    className="ml-2 hover:text-blue-900"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                        {searchQuery && (
                            <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                <span>Search: "{searchQuery}"</span>
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="ml-2 hover:text-green-900"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <Loading />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No posts found</h3>
                        <p className="mt-2 text-gray-500">
                            {searchQuery || selectedCategory
                                ? 'Try adjusting your filters or search query'
                                : 'Check back later for new content'}
                        </p>
                    </div>
                ) : (
                    <>
                        <PostList posts={posts} />

                        {totalPages > 1 && (
                            <div className="mt-8 flex justify-center items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>

                                <div className="flex gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-4 py-2 border rounded-md text-sm font-medium ${currentPage === page
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}