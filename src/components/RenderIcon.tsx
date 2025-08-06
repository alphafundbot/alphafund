import React from 'react';
import { LucideIcon, LucideProps } from 'lucide-react';

interface RenderIconProps extends LucideProps {
  Icon: LucideIcon;
  title?: string;
  label?: string;
  className?: string;
}

const RenderIcon: React.FC<RenderIconProps> = ({
  Icon,
  title,
  label,
  className,
  ...props
}) => {
  return (
    <Icon
      title={title}
      aria-label={label}
      className={className}
      {...props}
    />
  );
};

export default RenderIcon;