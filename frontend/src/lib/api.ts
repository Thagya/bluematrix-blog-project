const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const getHeaders = (isFormData = false) => {
    const headers: HeadersInit = {};
    
    // Don't set Content-Type for FormData - browser will set it with boundary
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }
    
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return headers;
};

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
};

export const api = {
    login: async (data: any) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },
    register: async (data: any) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },
    getCategories: async () => {
        const res = await fetch(`${API_URL}/categories`, {
            headers: getHeaders(),
        });
        return handleResponse(res);
    },
    createCategory: async (data: any) => {
        const res = await fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },
    updateCategory: async (id: string, data: any) => {
        const res = await fetch(`${API_URL}/categories/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },
    deleteCategory: async (id: string) => {
        const res = await fetch(`${API_URL}/categories/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(res);
    },
};

export const postsAPI = {
    // Get all published posts (public)
    getPublished: async (params?: { category?: string; page?: number; limit?: number; search?: string }) => {
        const queryParams = new URLSearchParams();
        if (params?.category) queryParams.append('category', params.category);
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.search) queryParams.append('q', params.search);

        const queryString = queryParams.toString();
        const url = `${API_URL}/posts${queryString ? `?${queryString}` : ''}`;

        const res = await fetch(url, {
            headers: getHeaders(),
        });
        return handleResponse(res);
    },

    // Get user's own posts (authenticated)
    getMyPosts: async () => {
        const res = await fetch(`${API_URL}/posts`, {
            headers: getHeaders(),
        });
        const data = await handleResponse(res);
        // If the response has a 'data' property, return it, otherwise return the response as is
        return data.data ? data : { data: data };
    },

    // Create post with FormData (for file upload)
    createWithFormData: async (formData: FormData) => {
        const res = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: getHeaders(true), // true indicates FormData
            body: formData,
        });
        return handleResponse(res);
    },

    // Create post with JSON (no file)
    create: async (data: any) => {
        const res = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },

    // Get single post
    getOne: async (id: string) => {
        const res = await fetch(`${API_URL}/posts/${id}`, {
            headers: getHeaders(),
        });
        return handleResponse(res);
    },

    // Update post
    update: async (id: string, data: any) => {
        const res = await fetch(`${API_URL}/posts/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },

    // Delete post
    delete: async (id: string) => {
        const res = await fetch(`${API_URL}/posts/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(res);
    },
};

export const categoriesAPI = {
    getAll: async () => {
        const res = await fetch(`${API_URL}/categories`, {
            headers: getHeaders(),
        });
        return handleResponse(res);
    },
};