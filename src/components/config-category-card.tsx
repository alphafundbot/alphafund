'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useServiceConfig } from '@/hooks/useServiceConfig';
import { iconMap } from '@/lib/config';
import type { ServiceCategoryConfig } from '@/lib/config-types';
import { SignalIcon } from './SignalIcon';

interface ConfigCategoryCardProps {
  category: string;
}

export function ConfigCategoryCard({ category }: ConfigCategoryCardProps) {
  const config = useServiceConfig(category);

  if (!config) {
    return null; // Return null or a loading indicator if config is not loaded yet
  }

  const { title, description, items } = config as ServiceCategoryConfig; // Assert type after checking for null

  // Look up the icon using the category key
  const Icon = iconMap[category];

  // Determine if the SignalIcon should be disabled (e.g., if there are no items)
  const isDisabled = Object.keys(items).length === 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <SignalIcon Icon={Icon} title={title} disabled={isDisabled} />
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      {/* You can add CardContent here if needed, perhaps iterating over items */}
    </Card>
  );
}

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { FirebaseConfig, ServiceCategoryConfig } from '@/lib/types';

interface ConfigCategoryCardProps {
  categoryKey: keyof FirebaseConfig;
  categoryConfig: ServiceCategoryConfig;
  values: Record<string, boolean>;
  onValueChange: (category: keyof FirebaseConfig, key: string, value: boolean) => void;
}

export function ConfigCategoryCard({
  categoryKey,
  categoryConfig,
  values,
  onValueChange,
}: ConfigCategoryCardProps) {
  const { title, description, icon: Icon, items } = categoryConfig;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
                <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
                <CardTitle className="text-xl font-headline">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(items).map(([key, item]) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
              <Label htmlFor={`${categoryKey}-${key}`} className="flex flex-col gap-1 cursor-pointer">
                <span className="font-medium">{item.name}</span>
                <span className="text-xs text-muted-foreground">{item.description}</span>
              </Label>
              <Switch
                id={`${categoryKey}-${key}`}
                checked={values[key]}
                onCheckedChange={(checked) => onValueChange(categoryKey, key, checked)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
