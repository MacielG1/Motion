"use client";
import { useState } from "react";
import useOrigin from "@/hooks/useOrigin";
import { Doc } from "../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Check, Copy, Globe, Share2 } from "lucide-react";
import toast from "react-hot-toast";

type Props = {
  initialData: Doc<"notes">;
};

export default function Publish({ initialData }: Props) {
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const origin = useOrigin();
  const updateNote = useMutation(api.notes.updateNote);

  const url = `${origin}/preview/${initialData._id}`;

  function onPublish() {
    setIsSubmitting(true);

    const promise = updateNote({
      id: initialData._id,
      isPublished: true,
    }).finally(() => {
      setIsSubmitting(false);
    });

    toast.promise(
      promise,
      {
        loading: "Publishing...",
        success: "Published!",
        error: "Error publishing",
      },
      {
        position: "bottom-right",
      },
    );
  }

  function onUnpublish() {
    setIsSubmitting(true);

    const promise = updateNote({
      id: initialData._id,
      isPublished: false,
    }).finally(() => {
      setIsSubmitting(false);
    });

    toast.promise(
      promise,
      {
        loading: "Unpublishing...",
        success: "Unpublished!",
        error: "Error unpublishing",
      },
      {
        position: "bottom-right",
      },
    );
  }

  function onCopyUrl() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="transition duration-300 dark:hover:bg-neutral-950 dark:hover:ring-1 dark:hover:ring-neutral-500">
          {initialData.isPublished ? "Published" : "Publish"}
          {initialData.isPublished && <Globe className="ml-2 h-4 w-4 text-muted-foreground" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData.isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Share2 className="h-5 w-5 animate-pulse text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">This note is published. You can share the link below with anyone</span>
            </div>
            <div className="flex items-center">
              <input className="h-8 flex-1 truncate rounded-l-md border bg-muted px-2 text-xs focus-visible:outline-none" value={url} disabled />
              <Button onClick={onCopyUrl} disabled={copied} variant="primary" className="h-8 rounded-l-none ">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button onClick={onUnpublish} size="sm" variant="outline" className="w-full text-xs" disabled={isSubmitting}>
              Unpublish
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Share2 className="mb-2 h-7 w-7 text-muted-foreground" />
            <span className="mb-2 text-sm font-medium">Publish this note</span>

            <Button className="w-full text-xs dark:hover:bg-neutral-900" size="sm" variant="outline" disabled={isSubmitting} onClick={onPublish}>
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
