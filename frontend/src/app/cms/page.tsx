'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { postsAPI, categoriesAPI } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileText, FolderOpen, PlusCircle, TrendingUp } from 'lucide-react';

export default function CMSDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ posts: 0, categories: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [postsData, categoriesData] = await Promise.all([
        postsAPI.getPublished(),
        categoriesAPI.getAll(),
      ]);
      setStats({
        posts: postsData.meta.total,
        categories: categoriesData.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600">Manage your blog posts and categories from here.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Posts</p>
              <p className="text-3xl font-bold text-gray-900">{stats.posts}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Categories</p>
              <p className="text-3xl font-bold text-gray-900">{stats.categories}</p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Performance</p>
              <p className="text-3xl font-bold text-gray-900">Growing</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/cms/posts/create">
            <Button variant="primary" className="w-full">
              <PlusCircle className="w-5 h-5 mr-2" />
              Create New Post
            </Button>
          </Link>
          <Link href="/cms/categories">
            <Button variant="secondary" className="w-full">
              <FolderOpen className="w-5 h-5 mr-2" />
              Manage Categories
            </Button>
          </Link>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Getting Started</h2>
        <ul className="space-y-3 text-gray-600">
          <li className="flex items-start space-x-3">
            <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">1</span>
            <span>Create categories for your blog posts</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">2</span>
            <span>Write your first blog post with images</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">3</span>
            <span>Publish and share your content with the world</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}