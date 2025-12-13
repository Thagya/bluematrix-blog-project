'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CMSSidebar } from '@/components/layout/CMSSidebar';

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      <CMSSidebar />
      <div className="flex-1 bg-gray-50">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}