"use client";

import { useRouter } from "next/navigation";
import { Id } from "../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

import { Button } from "../ui/button";
import ConfirmModal from "../modals/ConfirmModal";
import toast from "react-hot-toast";

type Props = {
  noteId: Id<"notes">;
};

export default function Banner({ noteId }: Props) {
  const router = useRouter();
  const deleteNote = useMutation(api.notes.deleteNote);
  const restoreNote = useMutation(api.notes.restoreNote);

  function onRemove() {
    const promise = deleteNote({ id: noteId });
    toast.promise(promise, {
      loading: "Deleting...",
      success: "Deleted",
      error: "Error",
    });
    router.push("/notes");
  }
  function onRestore() {
    const promise = restoreNote({ id: noteId });
    toast.promise(promise, {
      loading: "Restoring...",
      success: "Restored",
      error: "Error",
    });
    router.push("/");
  }

  return (
    <div className="flex w-full items-center justify-center gap-x-2 bg-rose-500 p-2 text-center text-sm text-white">
      <p className="mx-1">This page is in the Trash</p>
      <Button
        size="sm"
        onClick={onRestore}
        variant="outline"
        className="h-auto border-white bg-neutral-200 p-1 px-3 font-normal text-black transition duration-300 hover:bg-neutral-300 hover:text-black"
      >
        Restore
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          size="sm"
          variant="destructive"
          className="h-auto border border-white bg-transparent p-1 px-2  font-normal text-white transition duration-300 hover:bg-transparent/10 hover:text-white"
        >
          Delete Forever
        </Button>
      </ConfirmModal>
    </div>
  );
}
