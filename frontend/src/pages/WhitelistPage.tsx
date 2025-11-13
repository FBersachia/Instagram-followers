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
  Input,
  Column
} from '../components';
import { whitelistService } from '../services/apiService';
import { useToast } from '../hooks/useToast';
import { Shield, Trash2, UserPlus } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export const WhitelistPage = () => {
  const [whitelistedUsers, setWhitelistedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const { toasts, success, error, closeToast } = useToast();

  // Load whitelist on mount
  useEffect(() => {
    loadWhitelist();
  }, []);

  const loadWhitelist = async () => {
    setLoading(true);
    try {
      const response = await whitelistService.getAll();
      if (response.success && response.data) {
        setWhitelistedUsers(response.data.usernames);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to load whitelist');
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return whitelistedUsers;
    return whitelistedUsers.filter((username) =>
      username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [whitelistedUsers, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  // Add user
  const handleAddUser = async () => {
    if (!newUsername.trim()) {
      error('Username cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const response = await whitelistService.add(newUsername.trim());
      if (response.success) {
        setWhitelistedUsers(prev => [newUsername.trim(), ...prev]);
        setNewUsername('');
        setShowAddModal(false);
        setCurrentPage(1);
        success(`Added ${newUsername} to whitelist`);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to add user to whitelist');
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const confirmDelete = (username: string) => {
    setUserToDelete(username);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setLoading(true);
    try {
      const response = await whitelistService.remove(userToDelete);
      if (response.success) {
        setWhitelistedUsers(prev => prev.filter(u => u !== userToDelete));
        setShowDeleteModal(false);
        setUserToDelete(null);
        success(`Removed ${userToDelete} from whitelist`);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to remove user from whitelist');
    } finally {
      setLoading(false);
    }
  };

  // Wrap usernames in objects for Table component
  const tableData = paginatedUsers.map(username => ({ username }));

  // Table columns
  const columns: Column<{ username: string }>[] = [
    {
      key: 'username',
      header: 'Username',
      render: (row) => <span className="font-medium">{row.username}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <Button
          size="sm"
          variant="danger"
          onClick={() => confirmDelete(row.username)}
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onClose={closeToast} />

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Whitelist</h1>
          <p className="mt-2 text-gray-600">
            Manage users that should never appear in non-followers list
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Whitelist Card */}
      <Card
        title="Whitelisted Users"
        subtitle={`${filteredUsers.length} users whitelisted`}
      >
        {/* Search Bar */}
        <div className="mb-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search whitelisted users..."
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-12">
            <Loading text="Loading whitelist..." />
          </div>
        ) : whitelistedUsers.length === 0 ? (
          <EmptyState
            icon={<Shield className="h-12 w-12 text-gray-400" />}
            title="No whitelisted users"
            description="Add users to whitelist to exclude them from non-followers analysis"
            action={
              <Button onClick={() => setShowAddModal(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add First User
              </Button>
            }
          />
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            icon={<Shield className="h-12 w-12 text-gray-400" />}
            title="No users found"
            description="Try adjusting your search query"
          />
        ) : (
          <Table
            columns={columns}
            data={tableData}
            keyExtractor={(row) => row.username}
            pagination={{
              currentPage,
              totalPages,
              onPageChange: setCurrentPage,
            }}
          />
        )}
      </Card>

      {/* Add User Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setNewUsername('');
        }}
        title="Add User to Whitelist"
      >
        <div className="space-y-4">
          <Input
            label="Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Enter username"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddUser();
              }
            }}
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddModal(false);
                setNewUsername('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddUser} disabled={loading}>
              Add to Whitelist
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setUserToDelete(null);
        }}
        title="Confirm Removal"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to remove <strong>{userToDelete}</strong> from the whitelist?
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setUserToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteUser} disabled={loading}>
              Remove
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
