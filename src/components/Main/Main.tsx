import { cn } from '@/lib/utils';
import { ChevronsLeftIcon, MenuIcon } from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ElementRef } from 'react';
import { ThemeToggler } from '../ThemeToggler';
import useMediaQuery from '@/hooks/useMediaQuery';

export default function Main() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const navbarRef = useRef<ElementRef<'div'>>(null);

  const pathname = usePathname();
  const params = useParams();

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
      navbarRef.current.style.setProperty('left', `${newWidth}px`);
      navbarRef.current.style.setProperty(
        'width ',
        `calc(100% - ${newWidth}px)`
      );
    }
  }
  function handleMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  function handleMouseUp() {
    isResizingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }

  function resetSidebarWidth() {
    if (sidebarRef.current && navbarRef.current) {
      setIsResetting(true);
      setIsCollapsed(false);
      const widthValue = isMobile ? '100%' : '300px';
      const leftValue = widthValue;
      const widthCalcValue = isMobile ? '0' : 'calc(100% - 300px)';

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

      sidebarRef.current.style.width = '0';
      navbarRef.current.style.left = '0';
      navbarRef.current.style.width = '100%';
    }

    setTimeout(() => {
      setIsResetting(false);
    }, 300);
  }

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          `group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60  flex-col z-[99999]`,
          isResetting && 'transition-all ease-in-out duration-300',
          isMobile && 'w-0'
        )}
      >
        <div
          className={cn(
            `h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 hover:dark:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition`,
            isMobile && 'opacity-100'
          )}
          role="button"
          onClick={collapseSidebar}
        >
          <ChevronsLeftIcon className="h-6 w-6" />
        </div>
        <span className="pl-[0.135rem] text-muted-foreground">
          <ThemeToggler
            variant="ghost"
            className="focus-visible:ring-inset focus-visible:ring-1"
          />
        </span>

        <div
          onMouseDown={handleMouseDown}
          onClick={resetSidebarWidth}
          className="cursor-ew-resize opacity-0 group-hover/sidebar:opacity-100 transition  absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          'absolute top-0 z-[99999] left-60 w-[calc(100%-240px)] ',
          isResetting && 'transition-all ease-in-out',
          isMobile && 'left-0 w-full'
        )}
      >
        {!!params.documentId ? (
          // Navbar
          <></>
        ) : (
          <nav className="bg-transparent px-3 py-2 w-full">
            {isCollapsed && (
              <MenuIcon
                onClick={resetSidebarWidth}
                role="button"
                className="h-6 w-6"
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
}
