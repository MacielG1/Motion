'use client';
import { useConvexAuth } from 'convex/react';

import { ArrowRightCircle } from 'lucide-react';
import { Button } from '../ui/button';
import Loading from '../Loading';
import Link from 'next/link';
import { SignInButton } from '@clerk/clerk-react';

export default function Heading() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className="max-w-3xl space-y-3">
      <h1 className="text-2xl sm:text-4xl tracking-wider leading-8  xl:text-5xl font-bold">
        Create, Organize, and Share Your Documents with Maximum Productivity
      </h1>
      <h2 className="text-base sm:text-lg md:text-xl">
        Motion is a demo and open-source app built with Next.js
      </h2>
      {isLoading && (
        <p className="w-full flex items-center justify-center">
          <Loading size="lg" />
        </p>
      )}

      {!isLoading && isAuthenticated && (
        <Button asChild>
          <Link href="/documents">
            Open Motion
            <ArrowRightCircle className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      )}
      {!isLoading && !isAuthenticated && (
        <SignInButton mode="modal">
          <Button variant="ghost" size="sm">
            Join Motion Free
            <ArrowRightCircle className="ml-2 h-4 w-4" />
          </Button>
        </SignInButton>
      )}
    </div>
  );
}
