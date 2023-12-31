"use client";
import Loading from "@/components/Loading";
import MainNav from "@/components/Main/MainNav";
import SearchBar from "@/components/SearchBar";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <Loading size={"lg"} />
      </div>
    );

  if (!isAuthenticated) {
    return redirect("/");
  }

  return (
    <div className="flex h-full dark:bg-neutral-900">
      <MainNav />
      <main className="h-full flex-1 overflow-y-auto">
        <SearchBar />
        {children}
      </main>
    </div>
  );
}
