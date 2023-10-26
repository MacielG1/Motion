import { Skeleton } from "../ui/skeleton";

export default function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div className="flex gap-x-2 py-[0.2rem]" style={{ paddingLeft: level ? `${level * 12 + 25}px` : "12px" }}>
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
}
