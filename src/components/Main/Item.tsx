import { ChevronDownIcon, ChevronRightIcon, LucideIcon, MoreHorizontal, Plus, Trash } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast/headless";

type ItemProps = {
  onClick?: () => void;
  Icon: LucideIcon;
  label: string;
  id?: Id<"notes">;
  noteIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
};

export default function Item({ onClick, Icon, label, id, noteIcon, active, expanded, isSearch, level, onExpand }: ItemProps) {
  const router = useRouter();
  const ChevronIcon = expanded ? ChevronDownIcon : ChevronRightIcon;
  const { user } = useUser();

  const createNote = useMutation(api.notes.createNote);
  const archiveNote = useMutation(api.notes.archiveNote);

  function handleExpand(e: React.MouseEvent) {
    e.stopPropagation();
    onExpand?.();
  }

  function onCreate(e: React.MouseEvent) {
    e.stopPropagation();
    if (!id) return;
    const promise = createNote({ parentNote: id, title: "Untitled" }).then((noteId) => {
      if (!expanded) {
        onExpand?.();
      }
      router.push(`/notes/${noteId}`);
    });
    toast.promise(promise, {
      loading: "Creating new note...",
      success: "New note created!",
      error: "Error creating note",
    });
  }

  function onArchive(e: React.MouseEvent) {
    e.stopPropagation();
    if (!id) return;

    const res = archiveNote({ id }).then(() => {
      router.push(`/notes`);
    });

    toast.promise(res, {
      loading: "Moving to trash...",
      success: "Moved to trash!",
      error: "Error moving to trash",
    });
  }

  return (
    <div
      className={cn(
        `group flex min-h-[2rem] w-full items-center py-1 pr-3 text-sm font-medium text-muted-foreground hover:bg-primary/5`,
        active && "bg-primary/5 text-primary",
      )}
      onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
    >
      {id && (
        <span role="button" className="mr-1 h-full rounded-sm hover:bg-neutral-300 hover:dark:bg-neutral-600 " onClick={handleExpand}>
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </span>
      )}
      {noteIcon ? (
        <span className="mr-2 shrink-0 text-[1.2rem]">{noteIcon}</span>
      ) : (
        <Icon className="mr-2 h-[1.2rem] w-[1.2rem] shrink-0 text-muted-foreground" />
      )}

      <span className="truncate">{label}</span>

      {isSearch && (
        <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[0.7rem] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">{/Mac|iPod|iPhone|iPad/.test(navigator.userAgent) ? <span>⌘</span> : <span>CTRL</span>}</span>K
        </kbd>
      )}

      {id && (
        <div className="ml-auto flex items-center gap-x-2" role="button" onClick={onCreate}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <div
                role="button"
                className="ml-auto h-full rounded-sm p-[0.15rem] opacity-0 hover:bg-neutral-300 group-hover:opacity-100 hover:dark:bg-neutral-600"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60" align="start" side="right" forceMount>
              <DropdownMenuItem onClick={onArchive} className="cursor-pointer">
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="p-2 text-sm text-muted-foreground">
                Last edited by:
                <span className="font-medium">{user?.fullName}</span>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="ml-auto flex h-full items-center justify-center rounded-sm p-[0.15rem] opacity-0 hover:bg-neutral-300 group-hover:opacity-100 hover:dark:bg-neutral-600">
            <Plus className="h-4 w-4 text-muted-foreground" />
          </span>
        </div>
      )}
    </div>
  );
}
