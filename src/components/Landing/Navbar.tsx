"use client";
import { useConvexAuth } from "convex/react";

import Logo from "./Logo";
import { ThemeToggler } from "../ThemeToggler";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "../ui/button";
import Loading from "../Loading";
import Link from "next/link";

export default function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <header>
      <nav className="flexColumn fixed top-0 z-50 flex w-full items-center bg-background  p-6 dark:bg-neutral-900">
        <Logo />
        <div className="jusCenter flex w-full items-center justify-end gap-3 md:ml-auto">
          {isLoading && (
            <span>
              <Loading />
            </span>
          )}
          {!isLoading && !isAuthenticated && (
            <>
              <SignInButton mode="modal" afterSignInUrl="/notes">
                <Button
                  variant="ghost"
                  size="sm"
                  className="min-w-[5rem] ring-1 ring-neutral-400 dark:bg-black dark:ring-1 dark:ring-neutral-800 dark:hover:bg-neutral-800"
                >
                  Login
                </Button>
              </SignInButton>
              <SignInButton mode="modal" afterSignInUrl="/notes">
                <Button size="sm">Register</Button>
              </SignInButton>
            </>
          )}
          {isAuthenticated && !isLoading && (
            <>
              <Button variant="ghost" size="sm" className="min-w-[5rem]  ring-1 ring-neutral-400 dark:ring-neutral-800">
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
