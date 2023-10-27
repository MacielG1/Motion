"use client";

import { useCoverImage } from "@/hooks/useCoverImage";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { SingleImageDropzone } from "../ImageDropzone";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "../../../convex/_generated/dataModel";

export default function CoverImageModal() {
  const [image, setImage] = useState<File>();
  const [isUploading, setIsUploading] = useState(false);

  const { edgestore } = useEdgeStore();
  const coverImage = useCoverImage();
  const updateNote = useMutation(api.notes.updateNote);
  const params = useParams();

  function onClose() {
    setIsUploading(false);
    setImage(undefined);
    coverImage.onClose();
  }

  async function onUpload(file?: File) {
    if (!file) return;

    setIsUploading(true);
    setImage(file);

    const img = await edgestore.publicFiles.upload({
      file,
      options: { replaceTargetUrl: coverImage.url },
    });

    await updateNote({
      id: params.noteId as Id<"notes">,
      coverImage: img.url,
    });
    onClose();
  }

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h3 className="text-center text-lg font-semibold">Cover Image</h3>
        </DialogHeader>
        <div>
          <SingleImageDropzone className="w-full outline-none" disabled={isUploading} value={image} onChange={onUpload} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
