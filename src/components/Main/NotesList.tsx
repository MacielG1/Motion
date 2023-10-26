"use client";

import { useParams, useRouter } from "next/navigation";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Item from "./Item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";
import ItemSkeleton from "../Skeletons/ItemSkeleton";

type DocumentListProps = {
  parentNoteId?: Id<"notes">;
  level?: number;
  data?: Doc<"notes">[];
};

export default function NotesList({ parentNoteId, level = 0 }: DocumentListProps) {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const notes = useQuery(api.notes.getNotes, {
    parentNote: parentNoteId,
  });

  function onExpand(noteId: string) {
    setExpanded((prev) => ({ ...prev, [noteId]: !prev[noteId] }));
  }

  function onRedirect(noteId: string) {
    router.push(`/notes/${noteId}`);
  }

  if (notes === undefined) {
    return (
      <>
        <ItemSkeleton level={level} />
        {level === 0 && (
          <>
            <ItemSkeleton level={level} />
            <ItemSkeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <p
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}
        className={cn("hidden py-[0.2rem] text-sm font-medium text-muted-foreground/80", expanded && "last:block", level === 0 && "hidden")}
      >
        No Notes
      </p>
      {notes.map((note) => (
        <div key={note._id}>
          <Item
            onClick={() => onRedirect(note._id)}
            id={note._id}
            label={note.title}
            noteIcon={note.icon}
            active={params.documentId === note._id}
            Icon={FileIcon}
            level={level}
            expanded={expanded[note._id]}
            onExpand={() => onExpand(note._id)}
          />
          {expanded[note._id] && <NotesList parentNoteId={note._id} level={level + 1} />}
        </div>
      ))}
    </>
  );
}
