"use client";
import { useTheme } from "next-themes";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import { useEdgeStore } from "@/lib/edgestore";

type Props = {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
};

export default function Editor({ onChange, initialContent, editable }: Props) {
  const { edgestore } = useEdgeStore();
  const { resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme === "dark" ? "dark" : "light";

  async function handleImageUpload(file: File) {
    const res = await edgestore.publicFiles.upload({ file });
    return res.url;
  }
  const editor: BlockNoteEditor = useBlockNote({
    initialContent: initialContent ? (JSON.parse(initialContent) as PartialBlock[]) : undefined,
    editable,
    onEditorContentChange: (content) => {
      onChange(JSON.stringify(content.topLevelBlocks, null, 2));
    },
    uploadFile: handleImageUpload,
  });
  return (
    <div>
      <BlockNoteView editor={editor} theme={currentTheme} />
    </div>
  );
}
