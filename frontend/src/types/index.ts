export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Category {
  _id: string;
  name: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  category: Category;
  tags?: string[];
  status: 'draft' | 'published';
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface PostsResponse {
  data: Post[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}