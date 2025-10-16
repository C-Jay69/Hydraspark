
import React, { useState, useEffect, useMemo } from 'react';
import { useBackend } from '../../hooks/useBackend';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: string;
  email: string;
  name: string | null;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
}

const ROWS_PER_PAGE = 10;

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { call } = useBackend();

  const totalPages = Math.ceil(totalUsers / ROWS_PER_PAGE);

  const fetchUsers = async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const { users: fetchedUsers, count } = await call('admin.listUsers', {
        limit: ROWS_PER_PAGE,
        offset: (page - 1) * ROWS_PER_PAGE,
      });
      setUsers(fetchedUsers);
      setTotalUsers(count);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
      toast({
        title: 'Error',
        description: err.message || 'Failed to fetch users.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleToggleAdmin = async (user: User) => {
    try {
      await call('admin.updateUser', {
        userID: user.id,
        isAdmin: !user.is_admin,
      });
      toast({ description: `User ${user.email} admin status updated.` });
      fetchUsers(currentPage); // Refresh
    } catch (err: any) {
      toast({
        title: 'Error',
        description: `Failed to update ${user.email}.`,
        variant: 'destructive',
      });
    }
  };
  
    const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
      try {
        await call('admin.deleteUser', { userID: userId });
        toast({ description: 'User has been deleted.' });
        fetchUsers(currentPage); // Refresh the list
      } catch (err: any) {
        toast({
          title: 'Error',
          description: 'Failed to delete user.',
          variant: 'destructive',
        });
      }
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">User Management</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan={4} className="text-center py-4">Loading...</td></tr>
            ) : users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Checkbox
                    checked={user.is_admin}
                    onCheckedChange={() => handleToggleAdmin(user)}
                    aria-label={`Toggle admin for ${user.email}`}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => goToPage(1)} disabled={currentPage === 1}>
            First
          </Button>
          <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </Button>
          <Button variant="outline" size="sm" onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>
            Last
          </Button>
        </div>
      </div>
    </div>
  );
}
