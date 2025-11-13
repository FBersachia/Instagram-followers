import { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export const Card = ({
  children,
  title,
  subtitle,
  className = '',
  padding = 'md',
  hoverable = false
}: CardProps) => {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8'
  };

  const hoverStyle = hoverable ? 'hover:shadow-lg transition-shadow' : '';

  return (
    <div className={`bg-white rounded-lg shadow border border-gray-200 ${hoverStyle} ${className}`}>
      {(title || subtitle) && (
        <div className={`border-b border-gray-200 ${paddingStyles[padding]}`}>
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
        </div>
      )}
      <div className={title || subtitle ? paddingStyles[padding] : paddingStyles[padding]}>
        {children}
      </div>
    </div>
  );
};
