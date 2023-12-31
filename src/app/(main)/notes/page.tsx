"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function NotePage() {
  const create = useMutation(api.notes.createNote);
  const router = useRouter();

  function handleCreateNote() {
    const res = create({
      title: "New Note",
    }).then((noteId) => {
      router.push(`/notes/${noteId}`);
    });

    toast.promise(res, {
      loading: "Creating note...",
      success: "Note created",
      error: "Error Creating Note",
    });
  }

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4 ">
      <h2 className="text-xl font-medium tracking-wide">Welcome to Motion</h2>
      <Image src="/empty.png" alt="Empty" width="300" height="300" className="dark:hidden" />
      <Image src="/empty.png" alt="Empty" width="300" height="300" className="hidden invert dark:block" />
      <Button onClick={handleCreateNote}>
        <Plus className="mr-2 h-4 w-4" />
        Create Note
      </Button>
    </div>
  );
}
