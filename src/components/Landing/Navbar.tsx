'use client';
import { useConvexAuth } from 'convex/react';

import Logo from './Logo';
import { ThemeToggler } from '../ThemeToggler';
import { SignInButton, UserButton } from '@clerk/clerk-react';
import { Button } from '../ui/button';
import Loading from '../Loading';
import Link from 'next/link';

export default function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <header>
      <nav className="z-50 flexColumn bg-background dark:bg-neutral-900 fixed top-0 flex items-center  w-full p-6">
        <Logo />
        <div className="jusCenter justify-end w-full flex items-center gap-3 md:ml-auto">
          {isLoading && (
            <span>
              <Loading />
            </span>
          )}
          {!isLoading && !isAuthenticated && (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button size="sm">Register</Button>
              </SignInButton>
            </>
          )}
          {isAuthenticated && !isLoading && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="ring-1 ring-neutral-400 dark:ring-neutral-800"
              >
                <Link href="/notes">Open</Link>
              </Button>
              <UserButton afterSignOutUrl="/" />
            </>
          )}
          <ThemeToggler />
        </div>
      </nav>
    </header>
  );
}
