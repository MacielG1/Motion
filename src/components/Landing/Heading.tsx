"use client";
import { useConvexAuth } from "convex/react";

import { ArrowRightCircle } from "lucide-react";
import { Button } from "../ui/button";
import Loading from "../Loading";
import Link from "next/link";
import { SignInButton } from "@clerk/clerk-react";

export default function Heading() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className="max-w-3xl space-y-3">
      <h1 className="text-2xl font-bold leading-8 tracking-wider  sm:text-4xl xl:text-5xl">
        Create, Organize, and Share Your Notes with Maximum Productivity
      </h1>
      <h2 className="text-base sm:text-lg md:text-xl">Motion is a demo and open-source app built with Next.js</h2>
      {isLoading && (
        <p className="flex w-full items-center justify-center">
          <Loading size="lg" />
        </p>
      )}

      {!isLoading && isAuthenticated && (
        <Button asChild>
          <Link href="/notes">
            Open Motion
            <ArrowRightCircle className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      )}
      {!isLoading && !isAuthenticated && (
        <SignInButton mode="modal" afterSignInUrl="/notes">
          <Button size="sm">
            Join Motion Free
            <ArrowRightCircle className="ml-2 h-4 w-4" />
          </Button>
        </SignInButton>
      )}
    </div>
  );
}
