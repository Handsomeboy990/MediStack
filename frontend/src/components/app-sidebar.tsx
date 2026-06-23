'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Bell, LogOut, UserCircle2 } from 'lucide-react';

import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarInsetHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider,
  SidebarRail, SidebarTrigger,
} from '@/components/ui/sidebar';
import { roleNavConfig, roleOrder, getCurrentRole } from '@/components/sidebar-nav-config';

function AppSidebar() {
  const pathname = usePathname();
  const currentRole = getCurrentRole(pathname);
  const config = currentRole ? roleNavConfig[currentRole] : null;

  return (
    <Sidebar collapsible="icon" className="h-screen md:sticky md:top-0 bg-primary text-primary-foreground">
      <SidebarHeader className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-3 px-1 pt-1">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/20">
            <Image
              src="/logo-icone.png"
              alt="MediTrace"
              width={48}
              height={48}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <div className="group-data-[state=collapsed]/sidebar:hidden overflow-hidden">
            <p className="truncate text-lg font-extrabold tracking-tight text-white">MediTrace</p>
            <p className="truncate text-sm font-medium text-white/80">{config?.label ?? 'Gestion clinique'}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {config ? (
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {config.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === currentRole
                      ? pathname === item.href
                      : pathname.startsWith(item.href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.href}>
                          <Icon className="h-5 w-5 shrink-0" />
                          <span className="group-data-[state=collapsed]/sidebar:hidden">{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          <SidebarGroup>
            <SidebarGroupLabel>Espaces</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {roleOrder.map((roleHref) => {
                  const cfg = roleNavConfig[roleHref];
                  const Icon = cfg.icon;
                  return (
                    <SidebarMenuItem key={roleHref}>
                      <SidebarMenuButton asChild isActive={false}>
                        <Link href={roleHref}>
                          <Icon className="h-5 w-5 shrink-0" />
                          <span className="group-data-[state=collapsed]/sidebar:hidden">{cfg.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 pt-4">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
            U
          </div>
          <div className="group-data-[state=collapsed]/sidebar:hidden min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-primary-foreground">Utilisateur</p>
            <p className="truncate text-xs text-primary-foreground/60">Connecté</p>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const appRoutesWithSidebar = ['/profil', '/notifications'];
  const showSidebar =
    roleOrder.some((r) => pathname.startsWith(r)) ||
    appRoutesWithSidebar.some((route) => pathname.startsWith(route));

  if (!showSidebar) return <>{children}</>;

  const currentRole = getCurrentRole(pathname);
  const config = currentRole ? roleNavConfig[currentRole] : null;
  const currentItem = config?.items.find((item) =>
    item.href === currentRole ? pathname === item.href : pathname.startsWith(item.href),
  );
  const staticTitles: Record<string, string> = {
    '/profil': 'Profil',
    '/notifications': 'Notifications',
  };
  const staticTitle = Object.entries(staticTitles).find(([route]) => pathname.startsWith(route))?.[1];
  const pageTitle = currentItem?.label ?? staticTitle ?? config?.label ?? 'MediTrace';

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <SidebarInsetHeader className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
            <SidebarTrigger />
            <h2 className="text-sm font-semibold text-foreground">{pageTitle}</h2>
            <div className="ml-auto flex items-center gap-2">
              <Link
                href="/notifications"
                aria-label="Notifications"
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
              </Link>
              <Link
                href="/profil"
                aria-label="Profil"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
              >
                <UserCircle2 className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                aria-label="Déconnexion"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
              >
                <LogOut className="h-4 w-4" />
              </Link>
            </div>
          </SidebarInsetHeader>
          <div className="bg-background p-4 sm:p-6 lg:p-8">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export { AppSidebar, AppShell };
