
'use client';

import React from "react";
import { useSystemStatus } from "@/hooks/use-system-status";
import { Card as ShadCard, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SignalChart } from "@/components/signal-chart";
import { CheckCircle, Clock, GanttChart, ShieldAlert, XCircle, Zap } from "lucide-react";
import { pulseVault } from "@/app/actions.server";
import { useToast } from "@/hooks/use-toast";

const StrategistDashboard = () => {
  const { status, loading } = useSystemStatus();
  const { toast } = useToast();

  const handlePulseVault = async () => {
      const result = await pulseVault();
      if (result.status === "vault-pulsed") {
        toast({
          title: "Vault Pulsed",
          description: "Mesh entropy has been successfully synced.",
          variant: "default",
        });
      } else {
        toast({
          title: "Vault Pulse Failed",
          description: `Could not sync mesh entropy. Reason: ${result.reason || 'Unknown'}`,
          variant: "destructive",
        });
      }
  };

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

  return (
    <div className="flex flex-col gap-6">
 <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
 <Card title="Nodes Online" value={status.nodesOnline} />
        <Card title="Revenue Audit" value={status.revenueTotal} />
        <StatusCard title="Mesh Entropy" status={status.meshEntropy} icon={GanttChart} />
        <StatusCard title="Access" status={status.access} icon={ShieldAlert} />
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <VaultStatusCard status={status.credentialStatus} onPulse={handlePulseVault} />
        <StatusCard title="Last Audit" status={new Date(status.lastAudit).toLocaleDateString()} icon={Clock} />
        <ModuleStatusCard modules={status.modules} />
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

const VaultStatusCard = ({ status, onPulse }: { status: string; onPulse: () => void }) => {
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
        <ShadCard className={`text-white flex flex-col ${colorMap[status] || 'bg-gray-500'}`}>
            <CardHeader>
                <CardTitle className="text-sm text-white/80 font-medium">Credential Status</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-2xl font-semibold">{statusTextMap[status] || 'Unknown'}</p>
            </CardContent>
 <CardFooter className="p-0">
 <button className="flex items-center justify-center w-full text-white/80 hover:bg-white/20 hover:text-white py-3" onClick={onPulse}>
                    Pulse Vault
 </button>
            </CardFooter>
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
    <CardContent className="grid grid-cols-2 gap-4 pt-4">
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
