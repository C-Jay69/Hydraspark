
import React, { useState, useEffect } from 'react';
import { useBackend } from '../../hooks/useBackend';
import IcebreakerManager from './IcebreakerManager'; 
import UserManagement from './UserManagement'; // Import the new component

interface UserStats {
  totalUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { call } = useBackend();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await call('admin.getUserStats');
        setStats(response);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch admin stats.');
      }
    };

    fetchStats();
  }, [call]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700">Total Users</h2>
            <p className="text-4xl font-bold text-gray-900">{stats.totalUsers}</p>
          </div>
        </div>
      ) : (
        <p>Loading stats...</p>
      )}

      <div className="space-y-8">
        <UserManagement />
        <IcebreakerManager />
      </div>
    </div>
  );
}
