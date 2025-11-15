import { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Button,
  SearchBar,
  Table,
  ToastContainer,
  Loading,
  EmptyState,
  Input,
  Column
} from '../components';
import { exFollowersService } from '../services/apiService';
import { ExFollower } from '../types/api';
import { useToast } from '../hooks/useToast';
// import { useLanguage } from '../contexts/LanguageContext'; // TODO: Translate this page
import { UserX, Trash2, Calendar } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

type SortField = 'username' | 'unfollowed_at';
type SortDirection = 'asc' | 'desc';

export const ExFollowersPage = () => {
  // const { t } = useLanguage(); // TODO: Translate this page
  const [exFollowers, setExFollowers] = useState<ExFollower[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('unfollowed_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const { toasts, success, error, closeToast } = useToast();

  // Load ex-followers on mount
  useEffect(() => {
    loadExFollowers();
  }, []);

  const loadExFollowers = async () => {
    setLoading(true);
    try {
      const response = await exFollowersService.getAll();
      if (response.success && response.data) {
        setExFollowers(response.data.exFollowers);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to load ex-followers');
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return exFollowers;
    return exFollowers.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [exFollowers, searchQuery]);

  // Filter by date range
  const dateFilteredUsers = useMemo(() => {
    let filtered = filteredUsers;

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(
        (user) => new Date(user.unfollowed_at) >= fromDate
      );
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(
        (user) => new Date(user.unfollowed_at) <= toDate
      );
    }

    return filtered;
  }, [filteredUsers, dateFrom, dateTo]);

  // Sort users
  const sortedUsers = useMemo(() => {
    const sorted = [...dateFilteredUsers];
    sorted.sort((a, b) => {
      let aValue: string | number = a[sortField];
      let bValue: string | number = b[sortField];

      if (sortField === 'unfollowed_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [dateFilteredUsers, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedUsers, currentPage]);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Delete single user
  const handleDeleteUser = async (username: string) => {
    setLoading(true);
    try {
      const response = await exFollowersService.remove(username);
      if (response.success) {
        setExFollowers(prev => prev.filter(u => u.username !== username));
        success(`Removed ${username} from ex-followers`);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to remove user');
    } finally {
      setLoading(false);
    }
  };

  // Clear date filters
  const clearDateFilters = () => {
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Sort indicator
  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  // Table columns
  const columns: Column<ExFollower>[] = [
    {
      key: 'username',
      header: (
        <button
          onClick={() => handleSort('username')}
          className="font-medium hover:text-blue-600"
        >
          Username
          <SortIndicator field="username" />
        </button>
      ) as any,
      render: (row) => <span className="font-medium">{row.username}</span>,
    },
    {
      key: 'unfollowed_at',
      header: (
        <button
          onClick={() => handleSort('unfollowed_at')}
          className="font-medium hover:text-blue-600"
        >
          Unfollowed At
          <SortIndicator field="unfollowed_at" />
        </button>
      ) as any,
      render: (row) => (
        <span className="text-gray-600 text-sm">{formatDate(row.unfollowed_at)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <Button
          size="sm"
          variant="danger"
          onClick={() => handleDeleteUser(row.username)}
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onClose={closeToast} />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Ex-Followers</h1>
        <p className="mt-2 text-gray-600">
          Users who used to follow you but unfollowed
        </p>
      </div>

      {/* Ex-Followers Card */}
      <Card
        title="Ex-Followers List"
        subtitle={`${sortedUsers.length} ex-followers${dateFrom || dateTo ? ' (filtered)' : ''}`}
      >
        {/* Actions Bar */}
        <div className="space-y-4 mb-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search ex-followers..."
          />

          {/* Date Range Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="date"
                label="From Date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="flex-1">
              <Input
                type="date"
                label="To Date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            {(dateFrom || dateTo) && (
              <div className="flex items-end">
                <Button
                  variant="secondary"
                  onClick={clearDateFilters}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-12">
            <Loading text="Loading ex-followers..." />
          </div>
        ) : exFollowers.length === 0 ? (
          <EmptyState
            icon={<UserX className="h-12 w-12 text-gray-400" />}
            title="No ex-followers"
            description="Users moved from non-followers will appear here"
          />
        ) : sortedUsers.length === 0 ? (
          <EmptyState
            icon={<Calendar className="h-12 w-12 text-gray-400" />}
            title="No users found"
            description="Try adjusting your search query or date filters"
          />
        ) : (
          <Table
            columns={columns}
            data={paginatedUsers}
            keyExtractor={(row) => row.username}
            pagination={{
              currentPage,
              totalPages,
              onPageChange: setCurrentPage,
            }}
          />
        )}
      </Card>
    </div>
  );
};
