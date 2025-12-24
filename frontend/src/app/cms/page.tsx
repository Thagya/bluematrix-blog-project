'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { Post, Category } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function CMSDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalPosts: 0,
        publishedPosts: 0,
        draftPosts: 0,
        totalCategories: 0,
    });
    const [recentPosts, setRecentPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            // Fetch all posts
            const postsResponse = await fetch(`${API_URL}/posts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const postsData = await postsResponse.json();
            const allPosts = postsData.data || postsData || [];
            
            // Filter user's posts
            const myPosts = allPosts.filter((post: Post) => {
                const authorId = typeof post.author === 'object' 
                    ? (post.author as any)._id || (post.author as any).id
                    : post.author;
                return authorId === user?.id;
            });

            // Fetch categories
            const categoriesResponse = await fetch(`${API_URL}/categories`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const categoriesData = await categoriesResponse.json();
            
            // Calculate stats
            const publishedCount = myPosts.filter((p: Post) => p.status === 'published').length;
            const draftCount = myPosts.filter((p: Post) => p.status === 'draft').length;
            
            setStats({
                totalPosts: myPosts.length,
                publishedPosts: publishedCount,
                draftPosts: draftCount,
                totalCategories: categoriesData.length || 0,
            });
            
            // Get recent posts (last 5)
            setRecentPosts(myPosts.slice(0, 5));
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.name}!</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Total Posts</p>
                            <p className="text-3xl font-bold mt-2">{stats.totalPosts}</p>
                        </div>
                        <svg className="w-12 h-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Published</p>
                            <p className="text-3xl font-bold mt-2">{stats.publishedPosts}</p>
                        </div>
                        <svg className="w-12 h-12 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-100 text-sm font-medium">Drafts</p>
                            <p className="text-3xl font-bold mt-2">{stats.draftPosts}</p>
                        </div>
                        <svg className="w-12 h-12 text-yellow-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">Categories</p>
                            <p className="text-3xl font-bold mt-2">{stats.totalCategories}</p>
                        </div>
                        <svg className="w-12 h-12 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    </div>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link 
                        href="/cms/posts/create"
                        className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">New Post</p>
                            <p className="text-sm text-gray-600">Create a blog post</p>
                        </div>
                    </Link>

                    <Link 
                        href="/cms/posts"
                        className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                    >
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">Manage Posts</p>
                            <p className="text-sm text-gray-600">View all your posts</p>
                        </div>
                    </Link>

                    <Link 
                        href="/cms/categories"
                        className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                    >
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">Categories</p>
                            <p className="text-sm text-gray-600">Manage categories</p>
                        </div>
                    </Link>
                </div>
            </Card>

            {/* Recent Posts */}
            <Card>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Recent Posts</h2>
                    <Link href="/cms/posts" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View All →
                    </Link>
                </div>
                
                {recentPosts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No posts yet. Create your first post to get started!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentPosts.map((post) => {
                            const categoryName = post.category && typeof post.category === 'object' && post.category.name
                                ? post.category.name
                                : 'Uncategorized';
                            
                            return (
                                <div key={post._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-1">{post.title}</h3>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                                {categoryName}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                post.status === 'published' 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {post.status}
                                            </span>
                                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <Link 
                                        href={`/cms/posts/edit/${post._id}`}
                                        className="ml-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Edit
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>
        </div>
    );
}