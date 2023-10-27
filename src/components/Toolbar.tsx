"use client";

import { FileSignature, ImageIcon, X } from "lucide-react";
import { Doc } from "../../convex/_generated/dataModel";
import IconPicker from "./IconPicker";
import { Button } from "./ui/button";
import { ElementRef, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import TextareaAutosize from "react-textarea-autosize";
import { useCoverImage } from "@/hooks/useCoverImage";

type Props = {
  initialData: Doc<"notes">;
  preview?: boolean;
};
export default function Toolbar({ initialData, preview }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.title);
  const inputRef = useRef<ElementRef<"textarea">>(null);

  const coverImage = useCoverImage();
  const updateNote = useMutation(api.notes.updateNote);
  const removeIcon = useMutation(api.notes.removeIcon);

  function toggleInput() {
    if (preview) return;

    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData.title);
      inputRef.current?.focus();
    }, 0);
  }

  function disableInput() {
    setIsEditing(false);
  }

  function onInputChanged(value: string) {
    setValue(value);

    updateNote({
      id: initialData._id,
      title: value || "Untitled",
    });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      disableInput();
    }
  }

  function onIconChanged(icon: string) {
    updateNote({
      id: initialData._id,
      icon,
    });
  }

  function onIconRemoved() {
    removeIcon({
      id: initialData._id,
    });
  }

  return (
    <div className="group relative pl-[3.5rem]">
      {!!initialData.icon && !preview && (
        <div className="group/icon flex items-center gap-2 pt-6">
          <IconPicker onChange={onIconChanged}>
            <p className="text-6xl transition hover:opacity-75">{initialData.icon}</p>
          </IconPicker>
          <Button
            onClick={onIconRemoved}
            variant="outline"
            size="icon"
            className="rounded-full text-xs text-muted-foreground opacity-0 transition  group-hover/icon:opacity-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!!initialData.icon && preview && <p className="pt-6 text-6xl">{initialData.icon}</p>}
      <div className="flex items-center gap-1 py-4 opacity-0 group-hover:opacity-100">
        {!initialData.icon && !preview && (
          <IconPicker asChild onChange={onIconChanged}>
            <Button className="text-xs text-muted-foreground" variant="outline" size="sm">
              <FileSignature className="mr-2 h-4 w-4" /> Add Icon
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <Button variant="outline" size="sm" className="text-sm text-muted-foreground" onClick={coverImage.onOpen}>
            <ImageIcon className="mr-2 h-4 w-4" /> Add Cover Image
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onChange={(e) => onInputChanged(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={disableInput}
          value={value}
          className="w-full resize-none break-words bg-transparent text-4xl font-bold text-neutral-800 outline-none dark:text-neutral-100"
        />
      ) : (
        <div className="break-words pb-[0.75rem] text-5xl font-bold text-neutral-800 outline-none dark:text-neutral-100 " onClick={toggleInput}>
          {initialData.title}
        </div>
      )}
    </div>
  );
}
