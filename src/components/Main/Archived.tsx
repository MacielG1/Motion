"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import Loading from "../Loading";
import { Search, Trash, Undo } from "lucide-react";
import { Input } from "../ui/input";
import ConfirmModal from "../modals/ConfirmModal";
import toast from "react-hot-toast";

export default function Archived() {
  const notes = useQuery(api.notes.getArchivedNotes);
  const restoreNote = useMutation(api.notes.restoreNote);
  const deleteNote = useMutation(api.notes.deleteNote);

  const [search, setSearch] = useState("");
  const router = useRouter();
  const params = useParams();

  const filteredNotes = notes?.filter((note) => note.title.toLowerCase().includes(search.toLowerCase()));

  function handleClick(noteId: string) {
    router.push(`/notes/${noteId}`);
  }

  function onRestore(e: React.MouseEvent<HTMLSpanElement, MouseEvent>, noteId: Id<"notes">) {
    e.stopPropagation();
    const promise = restoreNote({ id: noteId });
    toast.promise(promise, {
      loading: "Restoring...",
      success: "Restored!",
      error: "Failed to restore.",
    });
  }
  function onRemove(noteId: Id<"notes">) {
    const promise = deleteNote({ id: noteId });
    toast.promise(promise, {
      loading: "Deleting...",
      success: "Deleted!",
      error: "Failed to delete.",
    });

    if (params.noteId === noteId) {
      router.push("/notes");
    }
  }

  if (notes === undefined) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 bg-secondary px-2 focus-visible:ring-transparent"
          placeholder="Filter Archived Notes"
        />
      </div>
      <div className="mt-2 px-1 pb-2">
        <p className="hidden text-center text-xs text-muted-foreground last:block">No Notes Found</p>
        {filteredNotes?.map((note) => (
          <div
            className="flex w-full items-center justify-between rounded-sm text-sm text-primary hover:bg-primary/5"
            key={note._id}
            role="button"
            onClick={() => handleClick(note._id)}
          >
            <span className="truncate pl-2 ">{note.title}</span>
            <div className="flex items-center">
              <span className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600" role="button" onClick={(e) => onRestore(e, note._id)}>
                <Undo className="h-4 w-4 text-muted-foreground" />
              </span>
              <ConfirmModal onConfirm={() => onRemove(note._id)}>
                <span className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600" role="button">
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </span>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
