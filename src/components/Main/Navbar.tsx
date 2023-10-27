"use client";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { MenuIcon } from "lucide-react";
import Banner from "./Banner";
import Title from "./Title";
import Publish from "./Publish";
import Menu from "./Menu";

type Props = {
  isCollapsed: boolean;
  onResetWidth(): void;
};

export default function Navbar({ isCollapsed, onResetWidth }: Props) {
  const params = useParams();

  const note = useQuery(api.notes.getNoteById, {
    noteId: params.noteId as Id<"notes">,
  });

  if (note === undefined) return null;
  if (note === null) return null;

  return (
    <>
      <nav className="flex w-full items-center gap-4 bg-background px-3 py-2 dark:bg-neutral-800">
        {isCollapsed && <MenuIcon role="button" onClick={onResetWidth} className="h-6 w-6 text-muted-foreground" />}
        <div className="flex w-full items-center justify-between">
          <Title initialData={note} />
          <div className="flex items-center gap-2">
            <Publish initialData={note} />
            <Menu noteId={note._id} />
          </div>
        </div>
      </nav>
      {note.isArchived && <Banner noteId={note._id} />}
    </>
  );
}
