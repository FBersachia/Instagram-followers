import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DistributionChartProps {
  whitelist: number;
  nonFollowers: number;
  exFollowers: number;
}

const COLORS = {
  whitelist: '#3b82f6', // Blue
  nonFollowers: '#f59e0b', // Yellow/Orange
  exFollowers: '#ef4444', // Red
};

export const DistributionChart = ({ whitelist, nonFollowers, exFollowers }: DistributionChartProps) => {
  const data = [
    { name: 'Whitelist', value: whitelist, color: COLORS.whitelist },
    { name: 'Non-Followers', value: nonFollowers, color: COLORS.nonFollowers },
    { name: 'Ex-Followers', value: exFollowers, color: COLORS.exFollowers },
  ].filter(item => item.value > 0); // Only show items with values > 0

  const total = whitelist + nonFollowers + exFollowers;

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-48 md:h-64 bg-gray-50 rounded-lg">
        <p className="text-sm md:text-base text-gray-500">No data to display</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-2 md:p-3 shadow-lg">
          <p className="font-medium text-gray-900 text-sm md:text-base">{data.name}</p>
          <p className="text-xs md:text-sm text-gray-600">
            {data.value.toLocaleString()} users ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = (entry: any) => {
    const percentage = ((entry.value / total) * 100).toFixed(1);
    // Hide labels on mobile if too small, always hide if very small
    const isMobile = window.innerWidth < 640;
    const minPercentage = isMobile ? 10 : 5;
    if (parseFloat(percentage) < minPercentage) return '';
    return `${percentage}%`;
  };

  // Responsive outer radius: smaller on mobile, larger on desktop
  const outerRadius = window.innerWidth < 640 ? 70 : window.innerWidth < 1024 ? 85 : 100;

  return (
    <div className="h-64 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={outerRadius}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ fontSize: window.innerWidth < 640 ? '11px' : '14px' }}
            formatter={(value) => {
              const item = data.find(d => d.name === value);
              // Shorter labels on mobile
              const isMobile = window.innerWidth < 640;
              if (isMobile) {
                const shortValue = value.replace('Non-Followers', 'Non-Fol.').replace('Ex-Followers', 'Ex-Fol.');
                return `${shortValue} (${item?.value || 0})`;
              }
              return `${value} (${item?.value || 0})`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
