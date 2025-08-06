
import { Rocket } from 'lucide-react';
import { SidebarTrigger } from './ui/sidebar';

export function Header() {
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Rocket className="h-7 w-7 text-primary" />
            <h1 className="text-xl font-bold font-headline tracking-tight text-foreground">
                Firebase Pilot
            </h1>
        </div>
      </div>
    </header>
  );
}
