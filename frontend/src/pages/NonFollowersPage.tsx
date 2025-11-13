import { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Button,
  SearchBar,
  Table,
  ToastContainer,
  Loading,
  EmptyState,
  Modal,
  Column
} from '../components';
import { nonFollowersService, exFollowersService } from '../services/apiService';
import { NonFollower } from '../types/api';
import { useToast } from '../hooks/useToast';
import { Users, UserMinus, Trash2, ArrowRight } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

type SortField = 'username' | 'created_at';
type SortDirection = 'asc' | 'desc';

export const NonFollowersPage = () => {
  const [nonFollowers, setNonFollowers] = useState<NonFollower[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showMoveModal, setShowMoveModal] = useState(false);
  const { toasts, success, error, closeToast } = useToast();

  // Load non-followers on mount
  useEffect(() => {
    loadNonFollowers();
  }, []);

  const loadNonFollowers = async () => {
    setLoading(true);
    try {
      const response = await nonFollowersService.getAll();
      if (response.success && response.data) {
        setNonFollowers(response.data.nonFollowers);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to load non-followers');
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return nonFollowers;
    return nonFollowers.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [nonFollowers, searchQuery]);

  // Sort users
  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers];
    sorted.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'created_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredUsers, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedUsers, currentPage]);

  // Toggle selection
  const toggleSelection = (username: string) => {
    setSelectedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(username)) {
        newSet.delete(username);
      } else {
        newSet.add(username);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedUsers.size === paginatedUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(paginatedUsers.map(u => u.username)));
    }
  };

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Delete single user (move to ex-followers)
  const handleDeleteUser = async (username: string) => {
    setLoading(true);
    try {
      const response = await exFollowersService.add(username);
      if (response.success) {
        setNonFollowers(prev => prev.filter(u => u.username !== username));
        success(`Moved ${username} to ex-followers`);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to move user to ex-followers');
    } finally {
      setLoading(false);
    }
  };

  // Move to ex-followers (bulk)
  const handleMoveToExFollowers = async () => {
    if (selectedUsers.size === 0) {
      error('No users selected');
      return;
    }

    setLoading(true);
    try {
      const selectedArray = Array.from(selectedUsers);
      const response = await exFollowersService.addBulk(selectedArray);

      if (response.success) {
        // Remove moved users from the list
        setNonFollowers(prev => prev.filter(u => !selectedArray.includes(u.username)));
        setSelectedUsers(new Set());
        setShowMoveModal(false);
        setCurrentPage(1);
        success(`Moved ${selectedArray.length} users to ex-followers`);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to move users to ex-followers');
    } finally {
      setLoading(false);
    }
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
  const columns: Column<NonFollower>[] = [
    {
      key: 'select',
      header: (
        <input
          type="checkbox"
          checked={selectedUsers.size === paginatedUsers.length && paginatedUsers.length > 0}
          onChange={toggleSelectAll}
          className="rounded border-gray-300"
        />
      ) as any,
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedUsers.has(row.username)}
          onChange={() => toggleSelection(row.username)}
          className="rounded border-gray-300"
        />
      ),
    },
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
      key: 'created_at',
      header: (
        <button
          onClick={() => handleSort('created_at')}
          className="font-medium hover:text-blue-600"
        >
          Added At
          <SortIndicator field="created_at" />
        </button>
      ) as any,
      render: (row) => (
        <span className="text-gray-600 text-sm">{formatDate(row.created_at)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => handleDeleteUser(row.username)}
        >
          <ArrowRight className="h-3 w-3 mr-1" />
          Move to Ex-Followers
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onClose={closeToast} />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Non-Followers</h1>
        <p className="mt-2 text-gray-600">
          Users who don't follow you back (excluding whitelisted users)
        </p>
      </div>

      {/* Non-Followers Card */}
      <Card
        title="Non-Followers List"
        subtitle={`${sortedUsers.length} non-followers`}
      >
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search non-followers..."
          />

          {selectedUsers.size > 0 && (
            <Button
              variant="secondary"
              onClick={() => setShowMoveModal(true)}
              disabled={loading}
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Move {selectedUsers.size} to Ex-Followers
            </Button>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-12">
            <Loading text="Loading non-followers..." />
          </div>
        ) : nonFollowers.length === 0 ? (
          <EmptyState
            icon={<Users className="h-12 w-12 text-gray-400" />}
            title="No non-followers"
            description="Upload a JSON file and insert data to see users who don't follow you back"
          />
        ) : sortedUsers.length === 0 ? (
          <EmptyState
            icon={<Users className="h-12 w-12 text-gray-400" />}
            title="No users found"
            description="Try adjusting your search query"
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

      {/* Move to Ex-Followers Confirmation Modal */}
      <Modal
        isOpen={showMoveModal}
        onClose={() => setShowMoveModal(false)}
        title="Move to Ex-Followers"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to move <strong>{selectedUsers.size}</strong> user(s) to ex-followers?
          </p>
          <p className="text-sm text-gray-600">
            This action will remove them from the non-followers list and add them to the ex-followers list.
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => setShowMoveModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleMoveToExFollowers} disabled={loading}>
              <ArrowRight className="h-4 w-4 mr-2" />
              Move to Ex-Followers
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
