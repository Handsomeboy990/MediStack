'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Bell, LogOut } from 'lucide-react';

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
    <Sidebar collapsible="icon" className="bg-primary text-primary-foreground">
      <SidebarHeader className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-3 px-1 pt-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/15">
            <Image
              src="/logo-icone.png"
              alt="MediTrace"
              width={36}
              height={36}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <div className="group-data-[state=collapsed]/sidebar:hidden overflow-hidden">
            <p className="truncate text-sm font-bold text-primary-foreground">MediTrace</p>
            <p className="truncate text-xs text-primary-foreground/60">{config?.label ?? 'Gestion clinique'}</p>
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
                          <Icon className="h-4 w-4 shrink-0" />
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
                          <Icon className="h-4 w-4 shrink-0" />
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
          <div className="group-data-[state=collapsed]/sidebar:hidden flex gap-1">
            <Link href="/notifications" className="rounded-md p-1.5 text-primary-foreground/60 hover:bg-white/10 hover:text-primary-foreground">
              <Bell className="h-3.5 w-3.5" />
            </Link>
            <Link href="/login" className="rounded-md p-1.5 text-primary-foreground/60 hover:bg-white/10 hover:text-primary-foreground">
              <LogOut className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = roleOrder.some((r) => pathname.startsWith(r));

  if (!showSidebar) return <>{children}</>;

  const currentRole = getCurrentRole(pathname);
  const config = currentRole ? roleNavConfig[currentRole] : null;
  const currentItem = config?.items.find((item) =>
    item.href === currentRole ? pathname === item.href : pathname.startsWith(item.href),
  );
  const pageTitle = currentItem?.label ?? config?.label ?? 'MediTrace';

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <SidebarInsetHeader className="border-b bg-white">
            <SidebarTrigger />
            <h2 className="text-sm font-semibold text-foreground">{pageTitle}</h2>
          </SidebarInsetHeader>
          <div className="bg-background p-4 sm:p-6 lg:p-8">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export { AppSidebar, AppShell };
