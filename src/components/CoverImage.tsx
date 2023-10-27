"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/useCoverImage";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { useEdgeStore } from "@/lib/edgestore";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";

type Props = {
  url?: string;
  preview?: string;
};

export default function CoverImage({ url, preview }: Props) {
  const coverImage = useCoverImage();
  const removeCoverImage = useMutation(api.notes.removeCoverImage);
  const params = useParams();
  const { edgestore } = useEdgeStore();

  async function handleRemove() {
    if (url) {
      await edgestore.publicFiles.delete({ url });
    }
    removeCoverImage({
      id: params.noteId as Id<"notes">,
    });
  }

  return (
    <div className={cn("group relative h-[30vh] w-full", url && "bg-muted", !url && "h-[10vh]")}>
      {!!url && <Image src={url} fill alt="coverImage" className="object-cover" />}
      {url && !preview && (
        <div className="absolute bottom-5 right-5 flex items-center gap-2 opacity-0 group-hover:opacity-100">
          <Button onClick={() => coverImage.onReplace(url)} className="text-xs text-muted-foreground" variant="outline" size="sm">
            <ImageIcon className="mr-1 h-4 w-4" />
            Change cover
          </Button>
          <Button onClick={handleRemove} className="text-xs text-muted-foreground" variant="outline" size="sm">
            <X className="mr-1 h-4 w-4" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}
