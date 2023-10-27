import { cn } from "@/lib/utils";
import { ChevronsLeftIcon, MenuIcon, Plus, PlusCircle, Search, Settings, Trash } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ElementRef } from "react";
import { ThemeToggler } from "../ThemeToggler";
import useMediaQuery from "@/hooks/useMediaQuery";
import Navbar from "./Navbar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Item from "./Item";
import { api } from "../../../convex/_generated/api";
import { useMutation } from "convex/react";
import toast from "react-hot-toast";
import NotesList from "./NotesList";
import UserItem from "./User";
import { useSettings } from "@/hooks/useSettings";
import { useSearch } from "@/hooks/useSearch";
import Archived from "./Archived";

export default function MainNav() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const settings = useSettings();
  const search = useSearch();

  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const createNote = useMutation(api.notes.createNote);

  useEffect(() => {
    if (isMobile) {
      collapseSidebar();
    } else {
      resetSidebarWidth();
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapseSidebar();
    }
  }, [pathname, isMobile]);

  function handleMouseMove(e: MouseEvent) {
    if (!isResizingRef.current) return;

    let newWidth = e.clientX;

    if (newWidth < 300) newWidth = 300;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty("width ", `calc(100% - ${newWidth}px)`);
    }
  }
  function handleMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }

  function handleMouseUp() {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }

  function resetSidebarWidth() {
    if (sidebarRef.current && navbarRef.current) {
      setIsResetting(true);
      setIsCollapsed(false);
      const widthValue = isMobile ? "100%" : "300px";
      const leftValue = widthValue;
      const widthCalcValue = isMobile ? "0" : "calc(100% - 300px)";

      sidebarRef.current.style.width = widthValue;
      navbarRef.current.style.left = leftValue;
      navbarRef.current.style.width = widthCalcValue;
    }

    setTimeout(() => {
      setIsResetting(false);
    }, 300);
  }

  function collapseSidebar() {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.left = "0";
      navbarRef.current.style.width = "100%";
    }

    setTimeout(() => {
      setIsResetting(false);
    }, 300);
  }

  function handleCreateNote() {
    const promise = createNote({
      title: "New Note",
    }).then((noteId) => {
      router.push(`/notes/${noteId}`);
    });

    toast.promise(promise, {
      loading: "Creating Note...",
      success: "Created!",
      error: "Error creating note",
    });
  }

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          `group/sidebar relative z-[99999] flex h-full w-60 flex-col  overflow-y-auto bg-secondary`,
          isResetting && "transition-all duration-300 ease-in-out",
          isMobile && "w-0",
        )}
      >
        <div
          className={cn(
            `absolute right-2 top-3 h-6 w-6 rounded-sm text-muted-foreground opacity-0 transition hover:bg-neutral-300 group-hover/sidebar:opacity-100 hover:dark:bg-neutral-600`,
            isMobile && "opacity-100",
          )}
          role="button"
          onClick={collapseSidebar}
        >
          <ChevronsLeftIcon className="h-6 w-6" />
        </div>
        <div>
          <UserItem />
          <Item onClick={search.onOpen} Icon={Search} label="Search" isSearch />
          <Item onClick={settings.onOpen} Icon={Settings} label="Settings" />
          <Item onClick={handleCreateNote} Icon={PlusCircle} label="New Note" />
        </div>
        <div className="py-1">
          <NotesList />
          <Item onClick={handleCreateNote} Icon={Plus} label="Add Note" />
          <Popover>
            <PopoverTrigger className="mt-4 w-full">
              <Item label="Trash" Icon={Trash} />
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0" side={isMobile ? "bottom" : "right"}>
              <Archived />
            </PopoverContent>
          </Popover>
        </div>
        <span className="pl-[0.135rem] text-muted-foreground">
          <ThemeToggler variant="ghost" className="focus-visible:ring-1 focus-visible:ring-inset" />
        </span>

        <div
          onMouseDown={handleMouseDown}
          onClick={resetSidebarWidth}
          className="absolute right-0 top-0 h-full  w-1 cursor-ew-resize bg-primary/10 opacity-0 transition group-hover/sidebar:opacity-100"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute left-60 top-0 z-[99999] w-[calc(100%-240px)] ",
          isResetting && "transition-all ease-in-out",
          isMobile && "left-0 w-full",
        )}
      >
        {!!params.noteId ? (
          <Navbar isCollapsed={isCollapsed} onResetWidth={resetSidebarWidth} />
        ) : (
          <nav className="w-full bg-transparent px-3 py-2">
            {isCollapsed && <MenuIcon onClick={resetSidebarWidth} role="button" className="h-6 w-6" />}
          </nav>
        )}
      </div>
    </>
  );
}
