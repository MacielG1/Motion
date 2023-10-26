'use client';
import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { MenuIcon } from 'lucide-react';

type Props = {
  isCollapsed: boolean;
  onResetWidth(): void;
};

export default function Navbar({ isCollapsed, onResetWidth }: Props) {
  const params = useParams();

  const note = useQuery(api.notes.getNoteById, {
    noteId: params.noteId as Id<'notes'>,
  });

  if (note === undefined) return null;
  if (note === null) return null;

  return (
    <>
      <nav className="bg-background dark:bg-neutral-800 px-3 py-2 w-full flex items-center gap-4">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="h-6 w-6 text-muted-foreground"
          />
        )}
        Navbar Items
      </nav>
    </>
  );
}
