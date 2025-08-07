
import type { LucideIcon } from 'lucide-react';
import type { defaultConfig } from './config';

export type FirebaseConfig = typeof defaultConfig;

export type StatusLevel = 'online' | 'offline' | 'degraded' | 'inactive' | 'pending' | 'injected' | 'notInjected' | 'error' | 'synced';

export interface SystemStatus {
  nodesOnline: number;
  revenueTotal: string;
  meshEntropy: StatusLevel;
  access: StatusLevel;
  credentialStatus: StatusLevel;
  lastAudit: string;
  modules: {
    [key: string]: boolean;
  };
}
