import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { FollowerCount } from '../types/api';

interface FollowerEvolutionChartProps {
  data: FollowerCount[];
}

export const FollowerEvolutionChart = ({ data }: FollowerEvolutionChartProps) => {
  // Transform data for recharts
  const chartData = data.map((item) => ({
    date: format(new Date(item.recorded_at), 'MMM dd'),
    fullDate: format(new Date(item.recorded_at), 'MMM dd, yyyy HH:mm'),
    followers: item.count,
  }));

  // Reverse to show oldest to newest
  const sortedData = [...chartData].reverse();

  if (sortedData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 md:h-64 bg-gray-50 rounded-lg">
        <p className="text-sm md:text-base text-gray-500">No follower count data available</p>
      </div>
    );
  }

  // Responsive chart height: shorter on mobile, taller on desktop
  return (
    <div className="h-64 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={sortedData}
          margin={{
            top: 5,
            right: window.innerWidth < 640 ? 10 : 30,
            left: window.innerWidth < 640 ? 0 : 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            style={{ fontSize: window.innerWidth < 640 ? '10px' : '12px' }}
            tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: window.innerWidth < 640 ? '10px' : '12px' }}
            tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
            width={window.innerWidth < 640 ? 40 : 60}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: window.innerWidth < 640 ? '12px' : '14px',
            }}
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) {
                return payload[0].payload.fullDate;
              }
              return label;
            }}
            formatter={(value: number) => [value.toLocaleString(), 'Followers']}
          />
          <Legend
            wrapperStyle={{ fontSize: window.innerWidth < 640 ? '12px' : '14px' }}
          />
          <Line
            type="monotone"
            dataKey="followers"
            stroke="#3b82f6"
            strokeWidth={window.innerWidth < 640 ? 1.5 : 2}
            dot={{ fill: '#3b82f6', r: window.innerWidth < 640 ? 3 : 4 }}
            activeDot={{ r: window.innerWidth < 640 ? 5 : 6 }}
            name="Followers"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
