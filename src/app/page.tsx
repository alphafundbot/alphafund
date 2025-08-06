
'use client';

import React from "react";
import { useSignalMap } from "@/hooks/use-signal-map";
import { Card as ShadCard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SignalChart } from "@/components/signal-chart";

const StrategistDashboard = () => {
  const { signal, loading } = useSignalMap();

  if (loading) {
    return (
        <div className="grid gap-6 p-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
                <ShadCard key={i}>
                    <CardHeader>
                        <Skeleton className="h-4 w-2/3" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-1/2" />
                    </CardContent>
                </ShadCard>
            ))}
            <ShadCard className="col-span-1 md:col-span-2">
                <CardHeader>
                    <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-48 w-full" />
                </CardContent>
            </ShadCard>
             <ShadCard className="col-span-1 sm:col-span-2 md:col-span-3">
                <CardHeader>
                    <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-24 w-full" />
                </CardContent>
            </ShadCard>
        </div>
    );
  }

  return (
    <div className="grid gap-6 p-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <Card title="Nodes Online" value={signal.cluster1} />
      <Card title="Vault Status" value={signal.vaultStatus} />
      <Card title="Revenue Audit" value={signal.revenueAudit.total} />
      <Chart title="Signal Throughput" />
      <Console title="Memory Feed" feed={[]} />
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

const Chart = ({ title }: { title: string }) => (
    <ShadCard className="col-span-1 md:col-span-2">
        <CardHeader>
            <CardTitle className="text-sm text-muted-foreground font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
           <SignalChart />
        </CardContent>
    </ShadCard>
);

const Console = ({ title, feed }: {title: string; feed: any[]}) => (
    <ShadCard className="col-span-1 sm:col-span-2 md:col-span-3">
        <CardHeader>
            <CardTitle className="text-sm text-muted-foreground font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="p-4 bg-muted rounded-md font-mono text-xs text-foreground whitespace-pre-wrap">
                {feed.length > 0 ? feed.join("\n") : "No memory signals yet"}
            </div>
        </CardContent>
    </ShadCard>
);

export default StrategistDashboard;
