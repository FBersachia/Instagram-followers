import { Input, Button } from './';
import { X } from 'lucide-react';

interface DateRangeSelectorProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

export const DateRangeSelector = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClear,
  disabled = false,
}: DateRangeSelectorProps) => {
  const hasFilters = startDate || endDate;

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end">
      <div className="flex-1">
        <Input
          type="date"
          label="From"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          disabled={disabled}
        />
      </div>
      <div className="flex-1">
        <Input
          type="date"
          label="To"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          disabled={disabled}
        />
      </div>
      {hasFilters && (
        <Button
          variant="ghost"
          onClick={onClear}
          disabled={disabled}
        >
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      )}
    </div>
  );
};
