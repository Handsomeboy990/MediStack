'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { PanelLeft } from 'lucide-react';

import { cn } from '@/lib/utils';

type SidebarContextValue = {
  open: boolean;
  openMobile: boolean;
  isMobile: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);

  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }

  return context;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    const update = () => setIsMobile(mediaQuery.matches);
    update();

    mediaQuery.addEventListener('change', update);

    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return isMobile;
}

function SidebarProvider({
  defaultOpen = true,
  children,
}: React.PropsWithChildren<{ defaultOpen?: boolean }>) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(defaultOpen);
  const [openMobile, setOpenMobile] = React.useState(false);

  const value = React.useMemo<SidebarContextValue>(
    () => ({
      open,
      openMobile,
      isMobile,
      setOpen,
      setOpenMobile,
      toggleSidebar: () => {
        if (isMobile) {
          setOpenMobile((current) => !current);
          return;
        }

        setOpen((current) => !current);
      },
    }),
    [isMobile, open, openMobile],
  );

  return (
    <SidebarContext.Provider value={value}>
      <div
        style={
          {
            '--sidebar-width': '16rem',
            '--sidebar-width-icon': '4rem',
            '--sidebar-width-mobile': '18rem',
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

function Sidebar({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'icon',
  className,
  children,
  ...props
}: React.ComponentProps<'aside'> & {
  side?: 'left' | 'right';
  variant?: 'sidebar' | 'floating' | 'inset';
  collapsible?: 'offcanvas' | 'icon' | 'none';
}) {
  const { open, openMobile, isMobile } = useSidebar();

  if (isMobile) {
    if (!openMobile) {
      return null;
    }

    return (
      <aside
        data-slot="sidebar"
        data-mobile="true"
        className={cn('fixed inset-y-0 z-50 flex w-[var(--sidebar-width-mobile)] flex-col border-r bg-[#004D40] text-white shadow-xl', side === 'right' && 'right-0 border-r-0 border-l', className)}
        {...props}
      >
        {children}
      </aside>
    );
  }

  const collapsed = !open && collapsible === 'icon';

  return (
    <aside
      data-slot="sidebar"
      data-state={open ? 'expanded' : 'collapsed'}
      data-side={side}
      data-variant={variant}
      className={cn(
        'group/sidebar relative hidden min-h-svh flex-col border-r bg-[#004D40] text-white transition-[width] duration-200 ease-linear md:flex',
        side === 'right' && 'border-r-0 border-l',
        collapsed ? 'w-[var(--sidebar-width-icon)]' : 'w-[var(--sidebar-width)]',
        className,
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

function SidebarInset({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sidebar-inset" className={cn('min-h-svh flex-1 bg-background', className)} {...props} />;
}

function SidebarTrigger({ className, ...props }: React.ComponentProps<'button'>) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className={cn('inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition hover:bg-accent hover:text-accent-foreground', className)}
      {...props}
    >
      <PanelLeft className="h-4 w-4 rtl:rotate-180" />
      <span className="sr-only">Basculer la barre latérale</span>
    </button>
  );
}

function SidebarRail({ className, ...props }: React.ComponentProps<'button'>) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      type="button"
      aria-label="Basculer la barre latérale"
      onClick={toggleSidebar}
      className={cn('absolute inset-y-0 -right-4 z-20 hidden w-4 md:flex', className)}
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sidebar-header" className={cn('flex flex-col gap-2 border-b border-white/10 p-4', className)} {...props} />;
}

function SidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sidebar-content" className={cn('flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-4', className)} {...props} />;
}

function SidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sidebar-footer" className={cn('border-t border-white/10 p-4', className)} {...props} />;
}

function SidebarGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sidebar-group" className={cn('flex flex-col gap-2', className)} {...props} />;
}

function SidebarGroupLabel({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sidebar-group-label" className={cn('group-data-[state=collapsed]/sidebar:hidden px-2 text-xs font-semibold uppercase tracking-wide text-white/50', className)} {...props} />;
}

function SidebarGroupContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sidebar-group-content" className={cn('flex flex-col gap-1', className)} {...props} />;
}

function SidebarMenu({ className, ...props }: React.ComponentProps<'ul'>) {
  return <ul data-slot="sidebar-menu" className={cn('flex flex-col gap-1', className)} {...props} />;
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="sidebar-menu-item" className={cn('list-none', className)} {...props} />;
}

function SidebarMenuButton({ className, asChild, isActive, ...props }: React.ComponentProps<'button'> & { asChild?: boolean; isActive?: boolean }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="sidebar-menu-button"
      data-active={isActive ? 'true' : 'false'}
      className={cn(
        'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white data-[active=true]:bg-white/15 data-[active=true]:text-white data-[active=true]:font-semibold',
        className,
      )}
      {...props}
    />
  );
}

function SidebarInsetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex items-center gap-3 border-b px-4 py-3', className)} {...props} />;
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarInsetHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
};