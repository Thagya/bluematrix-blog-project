const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const getHeaders = () => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
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
        throw new Error(errorData.message || errorData.error || 'API request failed');
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
            method: 'PATCH',
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
    getPublished: async (params?: { category?: string; page?: number; limit?: number; search?: string }) => {
        const queryParams = new URLSearchParams();
        if (params?.category) queryParams.append('category', params.category);
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.search) queryParams.append('search', params.search);

        const queryString = queryParams.toString();
        const url = `${API_URL}/posts${queryString ? `?${queryString}` : ''}`;

        const res = await fetch(url, {
            headers: getHeaders(),
        });
        return handleResponse(res);
    },
    create: async (data: any) => {
        const res = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },
    getOne: async (id: string) => {
        const res = await fetch(`${API_URL}/posts/${id}`, {
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
