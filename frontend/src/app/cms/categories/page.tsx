'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useCategories } from '@/hooks/useCategories';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Loading } from '@/components/ui/Loading';
import { generateSlug } from '@/lib/utils';
import { Category } from '@/types';
import toast from 'react-hot-toast';

export default function CategoriesPage() {
  const { categories, loading, refetch } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '' });

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, slug: category.slug || '' });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', slug: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', slug: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const slug = formData.slug || generateSlug(formData.name);
      if (editingCategory) {
        await api.updateCategory(editingCategory._id, { name: formData.name, slug });
        toast.success('Category updated successfully');
      } else {
        await api.createCategory({ name: formData.name, slug });
        toast.success('Category created successfully');
      }
      refetch();
      handleCloseModal();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    setDeleting(id);
    try {
      await api.deleteCategory(id);
      toast.success('Category deleted successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete category');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
          <p className="text-gray-600">Organize your posts by categories</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No categories yet</h3>
          <p className="mt-2 text-gray-500">Create your first category to organize posts</p>
          <button onClick={() => handleOpenModal()} className="mt-6">
            <Button>Create Category</Button>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category._id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
              {category.slug && (
                <p className="text-sm text-gray-500 mb-4">Slug: {category.slug}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(category)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
                  disabled={deleting === category._id}
                  className="text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                >
                  {deleting === category._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCategory ? 'Edit Category' : 'New Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Category name"
          />

          <Input
            label="Slug (Optional)"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="category-slug"
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" isLoading={saving}>
              {editingCategory ? 'Update' : 'Create'}
            </Button>
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}