
'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Settings } from 'lucide-react';

import type { FirebaseConfig } from '@/lib/types';
import { serviceConfig } from '@/lib/config';
import { saveConfig, fetchConfig } from '@/app/actions';
import { ConfigCategoryCard } from './config-category-card'; // Corrected import path
import { ConfigAuditor } from './config-auditor'; // Corrected import path
import { runConfigAudit } from '@/app/actions.server';


interface FirebaseConfigClientProps {
  initialConfig: FirebaseConfig;
}

export function FirebaseConfigClient({ initialConfig }: FirebaseConfigClientProps) {
  const [config, setConfig] = useState<FirebaseConfig>(initialConfig);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleValueChange = (
    category: keyof FirebaseConfig,
    key: string,
    value: boolean
  ) => {
    setConfig((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveConfig(config);
      if (result.success) {
        toast({
          title: 'Success!',
          description: result.message,
          variant: 'default',
        });
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
            <Settings className="h-8 w-8 text-primary" />
            <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight">Firebase Settings</h1>
                <p className="text-muted-foreground">Enable or disable Firebase services for your project.</p>
            </div>
        </div>
        <Button onClick={handleSave} disabled={isPending} size="lg">
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Configuration
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Object.entries(serviceConfig).map(([key, category]) => (
          <ConfigCategoryCard
            key={key}
            categoryKey={key as keyof FirebaseConfig}
            categoryConfig={category}
            values={config[key as keyof FirebaseConfig]}
            onValueChange={handleValueChange}
          />
        ))}
      </div>

      <ConfigAuditor config={config} /> {/* Assuming ConfigAuditor expects a prop named 'config' */}
    </div>
  );
}
