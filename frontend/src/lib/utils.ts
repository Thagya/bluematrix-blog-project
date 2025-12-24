import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

export function truncate(str: string, length: number): string {
    if (!str) return '';
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
}

export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export function getImageUrl(path: string | undefined | null): string {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;

    // Normalize backslashes to forward slashes
    const normalizedPath = path.replace(/\\/g, '/');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    // Ensure path starts with / if not present
    const cleanPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;

    // Remove trailing slash from API URL if present to avoid double slashes
    const cleanApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    return `${cleanApiUrl}${cleanPath}`;
}
