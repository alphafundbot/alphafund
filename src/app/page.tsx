import { LayoutDashboard } from "lucide-react";
import { AppLayout } from "@/components/layout";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="flex items-center gap-4">
        <LayoutDashboard className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your Firebase Pilot dashboard.</p>
        </div>
      </div>
    </AppLayout>
  );
}
