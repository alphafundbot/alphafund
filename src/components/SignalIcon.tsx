'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SignalIconProps {
  Icon: LucideIcon;
  title?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const SignalIcon: React.FC<SignalIconProps> = ({
  Icon,
  title,
  label,
  disabled = false,
  className,
}) => {
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <div className={`flex items-center gap-2 ${disabledClass} ${className ?? ''}`} aria-label={label}>
      <Icon aria-hidden="true" />
      {title && <span className="text-xs text-muted-foreground">{title}</span>}
    </div>
  );
};