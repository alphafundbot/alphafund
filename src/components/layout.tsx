
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Rocket, ChevronDown } from 'lucide-react';
import { navConfig } from '@/lib/nav-config';
import { cn } from '@/lib/utils';
import { SidebarTrigger } from './ui/sidebar';


export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <Sidebar>
        <SidebarHeader className="p-4 border-b">
           <div className="flex items-center gap-2">
             <Rocket className="h-6 w-6 text-primary" />
             <h1 className="text-lg font-semibold font-headline tracking-tight">
                Firebase Pilot
             </h1>
           </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navConfig.topNav.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            
            {navConfig.clusters.map((cluster) => (
              <Collapsible key={cluster.title} className="w-full">
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start gap-2 px-3">
                         <cluster.icon className="h-5 w-5" />
                         <span className="flex-grow text-left text-sm font-medium">{cluster.title}</span>
                         <ChevronDown className="h-4 w-4 shrink-0" />
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {cluster.modules.map((mod) => (
                             <SidebarMenuItem key={mod.href}>
                                <SidebarMenuSubButton asChild isActive={pathname === mod.href}>
                                    <Link href={mod.href}>{mod.title}</Link>
                                </SidebarMenuSubButton>
                             </SidebarMenuItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            ))}

          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
       <div className="flex flex-col sm:pl-[var(--sidebar-width-icon)]">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger className="sm:hidden" />
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
        </main>
      </div>
    </div>
  );
}
