
'use client';

import React, { useState, useEffect } from 'react';
import { fetchConfig } from '@/app/actions';
import { FirebaseConfigClient } from '@/components/firebase-config-client';
import type { FirebaseConfig } from '@/lib/types';
import { defaultConfig } from '@/lib/config';
import { Skeleton } from '@/components/ui/skeleton';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  const [config, setConfig] = useState<FirebaseConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      setLoading(true);
      try {
        const fetchedConfig = await fetchConfig();
        setConfig(fetchedConfig);
      } catch (error) {
        console.error("Failed to fetch config", error);
        setConfig(defaultConfig);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  if (loading || !config) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Settings className="h-8 w-8 text-muted-foreground" />
                    <div>
                        <Skeleton className="h-8 w-64 mb-2" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                </div>
                <Skeleton className="h-11 w-48" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="p-6 border rounded-lg bg-card">
                        <Skeleton className="h-8 w-48 mb-4" />
                        <Skeleton className="h-4 w-full mb-6" />
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  }

  return (
    <FirebaseConfigClient initialConfig={config} />
  );
}
