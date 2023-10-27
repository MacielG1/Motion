"use client";

import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

type Props = {
  initialData: Doc<"notes">;
};

export default function Title({ initialData }: Props) {
  const update = useMutation(api.notes.updateNote);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialData.title || "New Note");
  const inputRef = useRef<HTMLInputElement>(null);

  function toggleInput() {
    setTitle(initialData.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  }

  function disableInput() {
    setIsEditing(false);
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
    update({
      id: initialData._id,
      title: e.target.value || "New Note",
    });
  }
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      disableInput();
    }
  }

  return (
    <div className="flex items-center gap-x-1 ">
      {!!initialData.icon && <span>{initialData.icon}</span>}
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={toggleInput}
          onBlur={disableInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={title}
          className="h-7 px-2 focus-visible:ring-transparent"
        />
      ) : (
        <Button onClick={toggleInput} variant="ghost" size="sm" className="h-auto p-1 font-normal">
          <span className="truncate">{initialData.title}</span>
        </Button>
      )}
    </div>
  );
}

Title.Scheleton = function TitleScheleton() {
  return <Skeleton className="h-8 w-28 rounded-md" />;
};
