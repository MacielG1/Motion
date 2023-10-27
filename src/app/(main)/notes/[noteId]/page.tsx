"use client";
import { useMutation, useQuery } from "convex/react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";
import Toolbar from "@/components/Toolbar";
import CoverImage from "@/components/Main/CoverImage";
import dynamic from "next/dynamic";
import { useMemo } from "react";

type Props = {
  params: {
    noteId: Id<"notes">;
  };
};
export default function NoteIdPage({ params }: Props) {
  const note = useQuery(api.notes.getNoteById, {
    noteId: params.noteId,
  });
  const update = useMutation(api.notes.updateNote);

  const Editor = useMemo(
    () =>
      dynamic(() => import("@/components/Main/Editor"), {
        ssr: false,
      }),
    [],
  );

  if (note === undefined) {
    // is loading
    return null;
  }

  if (note === null) {
    return (
      <div>
        <span>Not Found</span>
      </div>
    );
  }

  function onChange(content: string) {
    update({
      id: params.noteId,
      content,
    });
  }

  return (
    <section className="pb-40">
      <CoverImage url={note?.coverImage} />
      <div className="mx-auto md:max-w-3xl lg:max-w-4xl">
        <Toolbar initialData={note} />
        <Editor onChange={onChange} initialContent={note.content} />
      </div>
    </section>
  );
}
