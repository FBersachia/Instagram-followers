import { ReactNode } from 'react';

export interface MobileCardItem {
  id: string | number;
  title: string;
  subtitle?: string;
  metadata?: Array<{ label: string; value: ReactNode }>;
  actions?: ReactNode;
}

export interface MobileCardListProps {
  items: MobileCardItem[];
  loading?: boolean;
  emptyMessage?: string;
}

export const MobileCardList = ({
  items,
  loading = false,
  emptyMessage = 'No data available'
}: MobileCardListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin h-8 w-8 border-3 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow touch-manipulation"
        >
          {/* Title and Subtitle */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 truncate">
                {item.title}
              </h3>
              {item.subtitle && (
                <p className="text-sm text-gray-500 mt-1">
                  {item.subtitle}
                </p>
              )}
            </div>
            {item.actions && (
              <div className="ml-3 flex-shrink-0">
                {item.actions}
              </div>
            )}
          </div>

          {/* Metadata */}
          {item.metadata && item.metadata.length > 0 && (
            <div className="mt-3 space-y-2">
              {item.metadata.map((meta, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{meta.label}:</span>
                  <span className="font-medium text-gray-900">{meta.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
