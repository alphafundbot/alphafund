import React from 'react';
import * as LucideIcons from 'lucide-react';
import { SignalStatus } from '@/lib/config-types';

interface SmartIconProps {
  IconName: keyof typeof LucideIcons;
  title: string;
  status?: SignalStatus;
  latency?: number;
}

export const SmartIcon: React.FC<SmartIconProps> = ({ IconName, title, status, latency }) => {
  const Icon = LucideIcons[IconName] as LucideIcon | undefined;
  const isDegraded = typeof latency === 'number' && latency > 300 || status === 'error';

  return (
    <div className="flex items-center gap-2">
      {Icon && <Icon aria-hidden="true" className={isDegraded ? 'text-red-500' : ''} />}
      <div>
        <span className={`text-sm font-medium ${isDegraded ? 'text-red-500' : ''}`}>
          {title}
        </span>
        {status && (
          <span className={`text-xs ml-1 ${isDegraded ? 'text-red-500' : 'text-muted-foreground'}`}>Status: {status}</span>
        )}
        {typeof latency === 'number' && (
          <span className={`text-xs ml-1 ${isDegraded ? 'text-red-500' : 'text-muted-foreground'}`}>
            {latency}ms
          </span>
        )}
      </div>
    </div>
  );
};