'use client';

import React from 'react';
import { useServiceConfig } from '@/lib/hooks/useServiceConfig';
import { useMeshRegistry } from '@/lib/hooks/useMeshRegistry';
import { SmartIcon } from '@/components/SmartIcon';
import { iconMap } from '@/lib/config'; // Assuming iconMap is exported from here
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Assuming these exist
import type { ServiceCategoryConfig } from '@/lib/config-types'; // Assuming types are here

const StrategistDashboard = () => {
  const serviceConfig = useServiceConfig('all'); // Assuming 'all' fetches all categories or adjust hook usage
  const meshNodes = useMeshRegistry(); // Assuming this fetches all nodes

  if (!serviceConfig) {
    // Or render a loading state
    return <div>Loading Service Config...</div>;
  }

  if (!meshNodes) {
    // Or render a loading state for nodes
    return <div>Loading Mesh Registry...</div>;
  }

  // Filter service categories based on iconMap keys
  const serviceCategories = Object.keys(iconMap)
    .map(categoryKey => ({
      key: categoryKey,
      config: serviceConfig[categoryKey] as ServiceCategoryConfig | undefined // Type assertion based on expected structure
    }))
    .filter(category => category.config !== undefined); // Only include categories with config

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {serviceCategories.map(({ key, config }) => {
        const Icon = iconMap[key];
        // Find a relevant mesh node for telemetry display (example: first node)
        const relevantNode = meshNodes.length > 0 ? meshNodes[0] : undefined;
        const telemetry = relevantNode?.telemetry;
        // Assuming protocol might be in serviceConfig or derived differently
        const protocol = config?.items ? Object.values(config.items)[0]?.protocol as 'Vault' | 'MQTT' | 'HTTP' | undefined : undefined; // Example of deriving protocol

        if (!Icon) return null; // Don't render if icon not found

        return (
          <Card key={key} className="shadow-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <SmartIcon
                  Icon={Icon}
                  title={config.title}
                  telemetry={telemetry} // Pass telemetry here
                  protocol={protocol} // Pass protocol here
                />
              </div>
              <CardDescription>{config.description}</CardDescription>
            </CardHeader>
            {/* You might want to iterate over config.items here if needed */}
            {/* <CardContent>
              {Object.entries(config.items || {}).map(([itemKey, item]) => (
                <div key={itemKey}>
                  {item.name}
                </div>
              ))}
            </CardContent> */}
          </Card>
        );
      })}
    </div>
  );
};

export default StrategistDashboard;