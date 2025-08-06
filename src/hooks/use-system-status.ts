import { useEffect, useState } from 'react';
import { useSignalMap } from '@/hooks/use-signal-map';
import { getStatusSnapshot } from '@vault/telemetry'; // Strategist-grade vault feed

export type StatusLevel = 'online' | 'offline' | 'degraded';

interface SystemStatus {
 nodesOnline: number;
 revenueTotal: string;
 meshEntropy: StatusLevel;
 access: StatusLevel;
}



export function useSystemStatus(): SystemStatus {
  const [status, setStatus] = useState<SystemStatus>({
    nodesOnline: 0,
    revenueTotal: '$0.00',
    meshEntropy: 'online',
    access: 'online',
  });

  useEffect(() => {
    const interval = setInterval(() => {
 setStatus({
 nodesOnline: Math.floor(Math.random() * 1000),
 revenueTotal: `$${(Math.random() * 1000000).toFixed(2)}`,
 meshEntropy: STATUS_LEVELS[Math.floor(Math.random() * STATUS_LEVELS.length)],
 access: STATUS_LEVELS[Math.floor(Math.random() * STATUS_LEVELS.length)],
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

 return status;
}
