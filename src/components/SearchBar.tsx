"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useSearch } from "@/hooks/useSearch";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { File } from "lucide-react";

export default function SearchBar() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const notes = useQuery(api.notes.searchNotes);

  const toggle = useSearch((state) => state.toggle);
  const isOpen = useSearch((state) => state.isOpen);
  const onClose = useSearch((state) => state.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  function handleSelect(id: string) {
    router.push(`/notes/${id}`);
    onClose();
  }

  if (!isMounted) return null;

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder="Search" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Notes">
          {notes?.map((note) => (
            <CommandItem key={note._id} value={`${note._id}-${note.title}`} title={note.title} onSelect={handleSelect}>
              {note?.icon ? <span className="mr-2 text-[1rem]">{note.icon}</span> : <File className="mr-2 h-4 w-4" />}
              <span> {note.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
