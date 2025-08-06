import { LucideIcon } from 'lucide-react';

export interface SignalConfig {
  id: string;
  label: string;
  protocol: 'http' | 'https' | 'tcp' | 'udp' | 'icmp';
  timeout?: number;
}

export interface MeshNode {
  nodeId: string;
  region: string;
  telemetry?: {
    [key: string]: any; // Consider replacing 'any' with a more specific type if possible
  };
}

export interface IconMap {
  [key: string]: LucideIcon;
}