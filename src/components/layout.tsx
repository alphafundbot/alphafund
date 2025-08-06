// src/components/layout.tsx
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
  SidebarTrigger,
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


export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full flex-col">
       <Sidebar>
        <SidebarHeader className="p-4">
           <div className="flex items-center gap-2">
             <Rocket className="h-7 w-7 text-primary" />
             <h1 className="text-xl font-bold font-headline tracking-tight text-foreground">
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
                    className={cn(pathname === item.href && "bg-primary/10 text-primary hover:text-primary")}
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
                    <Button variant="ghost" className="w-full justify-start gap-2 px-2">
                         <cluster.icon className="h-5 w-5" />
                         <span className="flex-grow text-left">{cluster.title}</span>
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
       <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger className="sm:hidden" />
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
        </main>
      </div>
    </div>
  );
}
