"use client";

import { useRouter } from "next/navigation";
import { Id } from "../../../convex/_generated/dataModel";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, Trash } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import toast from "react-hot-toast";

type Props = {
  noteId: Id<"notes">;
};
export default function Menu({ noteId }: Props) {
  const router = useRouter();
  const { user } = useUser();

  const archive = useMutation(api.notes.archiveNote);

  function onArchive() {
    const promise = archive({ id: noteId });

    toast.promise(promise, {
      loading: "Archiving...",
      success: "Archived",
      error: "Error",
    });

    router.push("/notes");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end" alignOffset={8} forceMount>
        <DropdownMenuItem onClick={onArchive} className="cursor-pointer">
          <Trash className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="p-2 text-xs text-muted-foreground">
          Last edited by: <span className="font-semibold">{user?.fullName}</span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-10 w-10" />;
};
