import { useState, useEffect, useMemo } from 'react';
import { Card, Loading, Input, Button, ToastContainer, FollowerEvolutionChart, DistributionChart, DateRangeSelector } from '../components';
import { statsService, followerCountsService } from '../services/apiService';
import { Stats, FollowerCount } from '../types/api';
import { Users, UserX, UserMinus, Shield, TrendingUp, Download } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '../hooks/useToast';
import { exportToCSV, exportToJSON } from '../utils/exportData';

export const DashboardPage = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [followerCount, setFollowerCount] = useState('');
  const [recentCounts, setRecentCounts] = useState<FollowerCount[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const { toasts, success, error, closeToast } = useToast();

  useEffect(() => {
    loadStats();
    loadRecentCounts();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await statsService.get();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentCounts = async () => {
    try {
      const response = await followerCountsService.getAll(30); // Load more for better chart visualization
      if (response.success && response.data) {
        setRecentCounts(response.data.followerCounts);
      }
    } catch (err) {
      console.error('Failed to load recent counts:', err);
    }
  };

  const handleSubmitCount = async () => {
    if (!followerCount || followerCount.trim() === '') {
      error('Please enter a follower count');
      return;
    }

    const count = parseInt(followerCount);
    if (isNaN(count) || count < 0) {
      error('Please enter a valid number');
      return;
    }

    setSubmitting(true);
    try {
      const response = await followerCountsService.add(count);
      if (response.success) {
        success(`Recorded ${count} followers`);
        setFollowerCount('');
        loadRecentCounts();
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to record follower count');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter follower counts by date range
  const filteredCounts = useMemo(() => {
    if (!startDate && !endDate) {
      return recentCounts;
    }

    return recentCounts.filter(record => {
      const recordDate = new Date(record.recorded_at);

      if (startDate && endDate) {
        return recordDate >= new Date(startDate) && recordDate <= new Date(endDate + 'T23:59:59');
      } else if (startDate) {
        return recordDate >= new Date(startDate);
      } else if (endDate) {
        return recordDate <= new Date(endDate + 'T23:59:59');
      }

      return true;
    });
  }, [recentCounts, startDate, endDate]);

  const handleClearDateRange = () => {
    setStartDate('');
    setEndDate('');
  };

  const handleExport = () => {
    if (!stats) {
      error('No data to export');
      return;
    }

    try {
      if (exportFormat === 'csv') {
        exportToCSV(stats, filteredCounts);
        success('Statistics exported to CSV');
      } else {
        exportToJSON(stats, filteredCounts);
        success('Statistics exported to JSON');
      }
    } catch (err) {
      error('Failed to export statistics');
    }
  };

  if (loading) {
    return <Loading fullScreen text="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onClose={closeToast} />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Overview of your Instagram follower tracking
        </p>
      </div>

      {/* Record Follower Count */}
      <Card title="Record Follower Count" subtitle="Track your follower growth over time">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="number"
              label="Current Follower Count"
              value={followerCount}
              onChange={(e) => setFollowerCount(e.target.value)}
              placeholder="Enter your current follower count"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSubmitCount();
                }
              }}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleSubmitCount} disabled={submitting}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Record Count
            </Button>
          </div>
        </div>

        {/* Recent Counts */}
        {recentCounts.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Records</h3>
            <div className="space-y-2">
              {recentCounts.slice(0, 5).map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-900">
                    {record.count.toLocaleString()} followers
                  </span>
                  <span className="text-sm text-gray-500">
                    {format(new Date(record.recorded_at), 'MMM dd, yyyy HH:mm')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Export Statistics */}
      <Card title="Export Statistics" subtitle="Download your data in CSV or JSON format">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as 'csv' | 'json')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="csv">CSV (Excel Compatible)</option>
              <option value="json">JSON</option>
            </select>
          </div>
          <Button onClick={handleExport} disabled={!stats}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card padding="md" hoverable>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Whitelist</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.whitelist.count || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md" hoverable>
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <UserX className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Non-Followers</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.nonFollowers.count || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md" hoverable>
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <UserMinus className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ex-Followers</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.exFollowers.count || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md" hoverable>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tracked</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalTracked || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution Chart */}
        <Card title="Distribution" subtitle="Breakdown of tracked users">
          <DistributionChart
            whitelist={stats?.whitelist.count || 0}
            nonFollowers={stats?.nonFollowers.count || 0}
            exFollowers={stats?.exFollowers.count || 0}
          />
        </Card>

        {/* Follower Evolution Chart */}
        <Card title="Follower Evolution" subtitle="Track your follower growth over time">
          <div className="mb-4">
            <DateRangeSelector
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onClear={handleClearDateRange}
            />
          </div>
          <FollowerEvolutionChart data={filteredCounts} />
        </Card>
      </div>

      {/* Recent Ex-Followers */}
      {stats && stats.exFollowers.recent.length > 0 && (
        <Card title="Recent Ex-Followers" subtitle="Users who recently unfollowed">
          <div className="space-y-3">
            {stats.exFollowers.recent.map((exFollower) => (
              <div
                key={exFollower.username}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium text-gray-900">
                  @{exFollower.username}
                </span>
                <span className="text-sm text-gray-500">
                  {format(new Date(exFollower.unfollowed_at), 'MMM dd, yyyy')}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
