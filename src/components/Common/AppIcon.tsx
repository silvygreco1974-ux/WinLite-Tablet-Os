import React from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface AppIconProps extends LucideProps {
  name: string;
  className?: string;
  color?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({ name, className = 'w-5 h-5', color, ...props }) => {
  // If it's a URL or image source
  if (name.startsWith('http') || name.startsWith('data:') || name.startsWith('/')) {
    return (
      <img
        src={name}
        alt="icon"
        className={`${className} object-contain rounded-md`}
        referrerPolicy="no-referrer"
        onError={(e) => {
          // Fallback to globe icon if image fails
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
    );
  }

  // Lookup in Lucide icons
  const IconComponent = (LucideIcons as Record<string, any>)[name] || LucideIcons.AppWindow;

  return <IconComponent className={className} style={color ? { color } : undefined} {...props} />;
};
