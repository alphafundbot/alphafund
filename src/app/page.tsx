
'use client';

import React from "react";
import { useSignalMap } from "@/hooks/use-signal-map";
import { Card as ShadCard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SignalChart } from "@/components/signal-chart";
import { CheckCircle, Clock, GanttChart, ShieldAlert, XCircle } from "lucide-react";

const systemStatus = {
  access: "pending",
  meshEntropy: "inactive",
  modules: {
    signal: false,
    finance: false,
    governance: false,
    planetary: false
  },
  credentialStatus: "notInjected",
  lastAudit: "2025-08-06T08:53:00Z",
  total: 0
};

const StrategistDashboard = () => {
  const { signal, loading } = useSignalMap();

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <ShadCard key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/2" />
              </CardContent>
            </ShadCard>
          ))}
        </div>
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            <ShadCard className="lg:col-span-1">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </ShadCard>
            <ShadCard className="lg:col-span-2">
              <CardHeader>
                <Skeleton className="h-6 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </ShadCard>
        </div>
      </div>
    );
  }

  const revenueTotal = signal.revenueAudit?.total ?? systemStatus.total;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Nodes Online" value={signal.cluster1} />
        <Card title="Vault Status" value={signal.vaultStatus} />
        <Card title="Revenue Audit" value={revenueTotal} />
        <StatusCard title="Mesh Entropy" status={systemStatus.meshEntropy} icon={GanttChart} />
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatusCard title="Access" status={systemStatus.access} icon={ShieldAlert} />
        <VaultSimCard status={systemStatus.credentialStatus} />
        <StatusCard title="Last Audit" status={new Date(systemStatus.lastAudit).toLocaleDateString()} icon={Clock} />
        <ModuleStatusCard modules={systemStatus.modules} />
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <Chart title="Signal Throughput" />
        <div className="lg:col-span-2">
            <Console title="Memory Feed" feed={[]} />
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value }: { title: string; value: any }) => (
    <ShadCard>
        <CardHeader>
            <CardTitle className="text-sm text-muted-foreground font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-2xl font-semibold">{value}</p>
        </CardContent>
    </ShadCard>
);

const VaultSimCard = ({ status }: { status: string }) => {
    const colorMap: { [key: string]: string } = {
        injected: "bg-green-600",
        notInjected: "bg-yellow-400",
        error: "bg-red-600",
    };

    const statusTextMap: { [key: string]: string } = {
        injected: "Injected",
        notInjected: "Not Injected",
        error: "Error",
    }

    return (
        <ShadCard className={`text-white ${colorMap[status] || 'bg-gray-500'}`}>
            <CardHeader>
                <CardTitle className="text-sm text-white/80 font-medium">Credential Status</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-semibold">{statusTextMap[status] || 'Unknown'}</p>
            </CardContent>
        </ShadCard>
    );
};


const StatusCard = ({ title, status, icon: Icon }: { title: string; status: string; icon: React.ElementType }) => (
    <ShadCard>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <p className="text-2xl font-semibold capitalize">{status}</p>
        </CardContent>
    </ShadCard>
);

const ModuleStatusCard = ({ modules }: { modules: Record<string, boolean> }) => (
  <ShadCard>
    <CardHeader>
      <CardTitle className="text-sm font-medium text-muted-foreground">Module Status</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-wrap gap-4">
      {Object.entries(modules).map(([key, value]) => (
        <div key={key} className="flex items-center gap-2">
          {value ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
          <span className="text-sm font-medium capitalize">{key}</span>
        </div>
      ))}
    </CardContent>
  </ShadCard>
);

const Chart = ({ title }: { title: string }) => (
    <ShadCard className="lg:col-span-1">
        <CardHeader>
            <CardTitle className="text-sm text-muted-foreground font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
           <SignalChart />
        </CardContent>
    </ShadCard>
);

const Console = ({ title, feed }: {title: string; feed: any[]}) => (
    <ShadCard>
        <CardHeader>
            <CardTitle className="text-sm text-muted-foreground font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="p-4 bg-muted rounded-md font-mono text-xs text-foreground whitespace-pre-wrap h-48 overflow-y-auto">
                {feed.length > 0 ? feed.join("\n") : "No memory signals yet"}
            </div>
        </CardContent>
    </ShadCard>
);

export default StrategistDashboard;
