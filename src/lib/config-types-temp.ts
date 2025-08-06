
export type SignalStatus = 'active' | 'inactive' | 'error';

export interface StrategistNode {
  id: string;
  region: string;
  latency: number;
  status: SignalStatus;
  category: string;
}

export interface ServiceConfig {
  category: string;
  title: string;
  icon: string;
  description?: string;
  nodes: StrategistNode[];
  isMonetized?: boolean;
  auditEnabled?: boolean;
}