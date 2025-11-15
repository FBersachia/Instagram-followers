import { useState, useEffect, useMemo } from 'react';
import {
  Card,
  FileUpload,
  Button,
  SearchBar,
  Table,
  ToastContainer,
  Loading,
  EmptyState,
  Column,
  CopyScriptButton
} from '../components';
import { jsonService, whitelistService, nonFollowersService } from '../services/apiService';
import { useToast } from '../hooks/useToast';
import { useLanguage } from '../contexts/LanguageContext';
import { Upload, UserPlus, Shield } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export const UploadPage = () => {
  const { t } = useLanguage();
  const [extractedUsers, setExtractedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const { toasts, success, error, closeToast } = useToast();

  // Load extracted users on mount
  useEffect(() => {
    loadExtractedUsers();
  }, []);

  const loadExtractedUsers = async () => {
    try {
      const response = await jsonService.getExtractedUsers();
      if (response.success && response.data) {
        setExtractedUsers(response.data.usernames);
      }
    } catch (err) {
      console.error('Failed to load extracted users:', err);
    }
  };

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    try {
      const response = await jsonService.uploadJson(file);
      if (response.success && response.data) {
        setExtractedUsers(response.data.usernames);
        setCurrentPage(1);
        setSelectedUsers(new Set());
        success(`Successfully extracted ${response.data.count} usernames`);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to upload JSON file');
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return extractedUsers;
    return extractedUsers.filter((username) =>
      username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [extractedUsers, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

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
      setSelectedUsers(new Set(paginatedUsers));
    }
  };

  // Bulk actions
  const handleAddToWhitelist = async () => {
    if (selectedUsers.size === 0) {
      error('No users selected');
      return;
    }

    setLoading(true);
    try {
      const selectedArray = Array.from(selectedUsers);
      const response = await whitelistService.addBulk(selectedArray);

      const addedUsers = (response.data as any)?.added || [];
      const failedUsers = (response.data as any)?.failed || [];

      if (response.success) {
        // Remove all selected users from the list (whether added or already existed)
        setExtractedUsers(prev => prev.filter(u => !selectedArray.includes(u)));
        setSelectedUsers(new Set());
        setCurrentPage(1);

        if (addedUsers.length > 0 && failedUsers.length === 0) {
          success(`Added ${addedUsers.length} users to whitelist`);
        } else if (addedUsers.length > 0 && failedUsers.length > 0) {
          success(`Added ${addedUsers.length} users, ${failedUsers.length} already existed`);
        } else if (failedUsers.length > 0) {
          success(`All ${failedUsers.length} users already in whitelist`);
        }
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to add users to whitelist');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSingleToWhitelist = async (username: string) => {
    setLoading(true);
    try {
      const response = await whitelistService.addBulk([username]);

      const addedUsers = (response.data as any)?.added || [];
      const failedUsers = (response.data as any)?.failed || [];

      if (response.success) {
        setExtractedUsers(prev => prev.filter(u => u !== username));

        if (addedUsers.length > 0) {
          success(`Added ${username} to whitelist`);
        } else if (failedUsers.length > 0) {
          const failReason = failedUsers[0]?.reason || 'Unknown error';
          if (failReason.includes('already exists')) {
            success(`${username} is already in whitelist`);
          } else {
            error(`Failed to add ${username}: ${failReason}`);
          }
        }
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to add user to whitelist');
    } finally {
      setLoading(false);
    }
  };

  const handleInsertToNonFollowers = async () => {
    if (extractedUsers.length === 0) {
      error('No users to insert');
      return;
    }

    setLoading(true);
    try {
      const response = await nonFollowersService.insert(extractedUsers);
      if (response.success) {
        success(`Inserted non-followers (whitelisted users filtered)`);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to insert non-followers');
    } finally {
      setLoading(false);
    }
  };

  // Wrap usernames in objects for Table component
  const tableData = paginatedUsers.map(username => ({ username }));

  // Table columns
  const columns: Column<{ username: string }>[] = [
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
      header: t.common.username,
      render: (row) => <span className="font-medium">{row.username}</span>,
    },
    {
      key: 'actions',
      header: t.common.actions,
      render: (row) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleAddSingleToWhitelist(row.username)}
          >
            <Shield className="h-3 w-3 mr-1" />
            {t.upload.addToWhitelist}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onClose={closeToast} />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t.upload.title}</h1>
        <p className="mt-2 text-gray-600">
          {t.upload.title}
        </p>
      </div>

      {/* Upload Card */}
      <Card title="Step 1: Get Your Instagram Data">
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">How to get your data:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Go to Instagram and log in to your account</li>
              <li>Open your browser's Developer Console (F12 or Ctrl+Shift+J)</li>
              <li>Type <code>clear()</code> in the console and press Enter</li>
              <li>Paste the script below and press Enter</li>
              <li>Wait for the script to finish and download the JSON file</li>
              <li>Upload the JSON file below</li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 items-start">
            <CopyScriptButton />
            <span className="text-xs text-gray-500 mt-2 sm:mt-0 sm:ml-2 flex items-center">
              Click to copy the Instagram data extraction script
            </span>
          </div>

          <div className="border-t pt-4">
            <FileUpload
              onFileSelect={handleFileUpload}
              accept=".json"
              label="Instagram JSON File"
              helperText="Upload the usersNotFollowingBack.json file generated by the script"
            />
          </div>
        </div>
      </Card>

      {/* Extracted Users Section */}
      {extractedUsers.length > 0 && (
        <>
          <Card
            title={t.upload.extractedUsers}
            subtitle={`${filteredUsers.length} ${t.upload.extractedUsers}`}
          >
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={t.common.search}
              />

              <div className="flex space-x-2">
                {selectedUsers.size > 0 && (
                  <Button
                    variant="secondary"
                    onClick={handleAddToWhitelist}
                    disabled={loading}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    {t.upload.addToWhitelist} ({selectedUsers.size})
                  </Button>
                )}
                <Button
                  onClick={handleInsertToNonFollowers}
                  disabled={loading}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {t.upload.insertToNonFollowers}
                </Button>
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="py-12">
                <Loading text={t.common.loading} />
              </div>
            ) : filteredUsers.length === 0 ? (
              <EmptyState
                icon={<Upload className="h-12 w-12 text-gray-400" />}
                title={t.upload.noUsers}
                description={t.upload.noUsers}
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
        </>
      )}
    </div>
  );
};
