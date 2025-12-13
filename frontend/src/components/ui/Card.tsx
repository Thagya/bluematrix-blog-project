import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
    return (
        <div
            className={cn('bg-white rounded-lg shadow-md p-6', className)}
            {...props}
        >
            {children}
        </div>
    );
}
