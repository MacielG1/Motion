'use client';
import Loading from '@/components/Loading';
import Main from '@/components/Main/Main';
import { useConvexAuth } from 'convex/react';
import { redirect } from 'next/navigation';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading)
    return (
      <div className="h-full flex items-center justify-center">
        <Loading size={'lg'} />
      </div>
    );

  if (!isAuthenticated) {
    return redirect('/');
  }

  return (
    <div className="h-full flex dark:bg-neutral-900">
      <Main />
      <main className="flex-1 h-full overflow-y-auto">{children}</main>
    </div>
  );
}
