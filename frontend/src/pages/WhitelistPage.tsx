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
import { useLanguage } from '../contexts/LanguageContext';
import { Shield, Trash2, UserPlus } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export const WhitelistPage = () => {
  const { t } = useLanguage();
  const [whitelistedUsers, setWhitelistedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const { toasts, success, error, closeToast} = useToast();

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
      header: t.common.username,
      render: (row) => <span className="font-medium">{row.username}</span>,
    },
    {
      key: 'actions',
      header: t.common.actions,
      render: (row) => (
        <Button
          size="sm"
          variant="danger"
          onClick={() => confirmDelete(row.username)}
        >
          <Trash2 className="h-3 w-3 mr-1" />
          {t.common.remove}
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
          <h1 className="text-3xl font-bold text-gray-900">{t.whitelist.title}</h1>
          <p className="mt-2 text-gray-600">
            {t.whitelist.description}
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          {t.whitelist.addUser}
        </Button>
      </div>

      {/* Whitelist Card */}
      <Card
        title={t.whitelist.title}
        subtitle={`${filteredUsers.length} ${t.whitelist.title}`}
      >
        {/* Search Bar */}
        <div className="mb-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t.common.search}
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-12">
            <Loading text={t.common.loading} />
          </div>
        ) : whitelistedUsers.length === 0 ? (
          <EmptyState
            icon={<Shield className="h-12 w-12 text-gray-400" />}
            title={t.whitelist.emptyState}
            description={t.whitelist.emptyDescription}
            action={{
              label: t.whitelist.addUser,
              onClick: () => setShowAddModal(true)
            }}
          />
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            icon={<Shield className="h-12 w-12 text-gray-400" />}
            title={t.whitelist.emptyState}
            description={t.whitelist.emptyDescription}
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
        title={t.whitelist.addUser}
      >
        <div className="space-y-4">
          <Input
            label={t.common.username}
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder={t.whitelist.enterUsername}
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
              {t.common.cancel}
            </Button>
            <Button onClick={handleAddUser} disabled={loading}>
              {t.whitelist.addButton}
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
        title={t.common.confirm}
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            {t.whitelist.removeConfirm}
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setUserToDelete(null);
              }}
            >
              {t.common.cancel}
            </Button>
            <Button variant="danger" onClick={handleDeleteUser} disabled={loading}>
              {t.common.remove}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
