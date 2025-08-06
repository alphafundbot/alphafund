
import {
  Activity,
  ArrowUpRight,
  BrainCircuit,
  CreditCard,
  DollarSign,
  LayoutDashboard,
  ShieldCheck,
  Signal,
  Users,
  Wrench,
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SignalChart } from '@/components/signal-chart';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-4xl font-bold font-headline tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, Strategist. Here's your system overview.</p>
            </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Nodes Online
                </CardTitle>
                <BrainCircuit className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">
                    +2.1% from last hour
                </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Active Signals
                </CardTitle>
                <Signal className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">+4,589</div>
                <p className="text-xs text-muted-foreground">
                    +12.5% from yesterday
                </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security Status</CardTitle>
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold text-green-500">Nominal</div>
                <p className="text-xs text-muted-foreground">
                    No active threats detected
                </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                </p>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle>Signal Activity</CardTitle>
                <CardDescription>
                    A real-time overview of incoming and outgoing signals across the mesh.
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <SignalChart />
              </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Strategist Core</CardTitle>
                    <CardDescription>
                        Direct access to core system configuration and monitoring modules.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Link href="/clusters/system-configurator" className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted">
                        <Wrench className="h-6 w-6 text-primary" />
                        <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">System Configurator</p>
                            <p className="text-sm text-muted-foreground">Adjust global parameters.</p>
                        </div>
                    </Link>
                     <Link href="/clusters/signal-router" className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted">
                        <Signal className="h-6 w-6 text-primary" />
                        <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">Signal Router</p>
                            <p className="text-sm text-muted-foreground">Define signal pathways.</p>
                        </div>
                    </Link>
                     <Link href="/clusters/ai-console" className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted">
                        <BrainCircuit className="h-6 w-6 text-primary" />
                        <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">AI Console</p>
                            <p className="text-sm text-muted-foreground">Interact with the core AI.</p>
                        </div>
                    </Link>
                </CardContent>
            </Card>
        </div>
         <Card>
            <CardHeader>
                <CardTitle>Financial Command Center</CardTitle>
                 <CardDescription>
                    Key modules for monetization and financial orchestration.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/clusters/financial-orchestration" className="block p-4 rounded-lg bg-primary/5 hover:bg-primary/10">
                    <CardTitle className="text-lg">Financial Orchestration</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Manage payment gateways.</p>
                </Link>
                <Link href="/clusters/treasury-dashboard" className="block p-4 rounded-lg bg-primary/5 hover:bg-primary/10">
                    <CardTitle className="text-lg">Treasury Dashboard</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Monitor asset allocation.</p>
                </Link>
                 <Link href="/clusters/subscription-manager" className="block p-4 rounded-lg bg-primary/5 hover:bg-primary/10">
                    <CardTitle className="text-lg">Subscription Manager</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Oversee user subscriptions.</p>
                </Link>
                <Link href="/clusters/revenue-audit" className="block p-4 rounded-lg bg-primary/5 hover:bg-primary/10">
                    <CardTitle className="text-lg">Revenue Audit</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Track and verify income.</p>
                </Link>
            </CardContent>
        </Card>
    </div>
  );
}
