'use client';

import { useState, useEffect } from 'react';
import { usePosts } from '@/hooks/usePosts';
import { useCategories } from '@/hooks/useCategories';
import { PostList } from '@/components/blog/PostList';
import { SearchBar } from '@/components/blog/SearchBar';
import { CategoryFilter } from '@/components/blog/CategoryFilter';
import { Loading } from '@/components/ui/Loading';

export default function HomePage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);

    const { posts, loading, meta, refetch } = usePosts({
        category: selectedCategory,
        page: currentPage,
        search: searchQuery,
    });

    const { categories, loading: categoriesLoading } = useCategories();

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, searchQuery]);

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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
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

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Search and Filter Section */}
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

                {/* Active Filters Display */}
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

                {/* Posts List */}
                {loading ? (
                    <Loading />
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

                        {/* Pagination */}
                        {meta.pages > 1 && (
                            <div className="mt-8 flex justify-center items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>

                                <div className="flex gap-1">
                                    {Array.from({ length: meta.pages }, (_, i) => i + 1).map((page) => (
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
                                    disabled={currentPage === meta.pages}
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
