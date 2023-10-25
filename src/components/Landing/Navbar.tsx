'use client';

import Logo from './Logo';

import { Button } from '../ui/button';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header>
      <nav className="z-50 flexColumn bg-background dark:bg-neutral-900 fixed top-0 flex items-center  w-full p-6">
        <Logo />
        <div className="jusCenter justify-end w-full flex items-center gap-3 md:ml-auto">
          {/* Login and Signup */}
          <>
            <Button
              variant="ghost"
              size="sm"
              className="ring-1 ring-neutral-400 dark:ring-neutral-800"
            >
              <Link href="/documents">Open</Link>
            </Button>
          </>
        </div>
      </nav>
    </header>
  );
}
