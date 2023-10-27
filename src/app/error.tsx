"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Error() {
  return (
    <section className="flex h-full flex-col items-center justify-center gap-4">
      <Image src="/error.jpg" width="300" height="300" alt="Error" />
      <p className="text-xl font-semibold">An Error Occurred</p>
      <Button asChild>
        <Link href="/notes">Return</Link>
      </Button>
    </section>
  );
}
