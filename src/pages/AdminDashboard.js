import React, { useState } from 'react';
import { useStats } from '../hooks/useStats';
import { usePaginatedActivity } from '../hooks/usePaginatedActivity';
import CreateUserModal from '../components/CreateUserModal';
import {
  UserGroupIcon,
  ServerStackIcon,
  ClockIcon,
  ChartBarIcon,
  UserPlusIcon,
  EyeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';

function timeAgo(date) {
  const now = Date.now();
  const seconds = Math.floor((now - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const actionIconMap = {
  user_registered: UserPlusIcon,
  viewed_users: EyeIcon,
  project_created: DocumentDuplicateIcon,
  project_updated: DocumentDuplicateIcon,
  community_enabled: ServerStackIcon,
  project_duplicated: DocumentDuplicateIcon,
};

export default function AdminDashboard() {
  const { users, projects, uptime, systemStatus, refresh: refreshStats } = useStats();

  const [page, setPage] = useState(1);
  const { logs: activityLogs = [], total = 0, loading: activityLoading, refresh: refreshActivity } = usePaginatedActivity(page, 5);
  const totalPages = Math.max(Math.ceil(total / 5), 1);

  const [isModalOpen, setModalOpen] = useState(false);
  const handleUserCreated = () => {
    refreshStats();
    refreshActivity();
  };

  return (
    <>
      <CreateUserModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onUserCreated={handleUserCreated} />

      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-blue-600 mb-1">Welcome, ultamatthew 👋</h1>
        <p className="text-gray-600 mb-8 text-sm">Last login: May 5, 2025 – 11:43 PM</p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4 hover:shadow-lg transition-transform duration-200">
            <UserGroupIcon className="h-8 w-8 text-blue-500" />
            <div><p className="text-sm text-gray-500">Total Users</p><p className="text-xl font-bold text-gray-800">{users ?? '—'}</p></div>
          </div>
          <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4 hover:shadow-lg transition-transform duration-200">
            <ChartBarIcon className="h-8 w-8 text-indigo-500" />
            <div><p className="text-sm text-gray-500">Projects</p><p className="text-xl font-bold text-gray-800">{projects ?? '—'}</p></div>
          </div>
          <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4 hover:shadow-lg transition-transform duration-200">
            <ClockIcon className="h-8 w-8 text-green-500" />
            <div><p className="text-sm text-gray-500">Backend Uptime</p><p className="text-xl font-bold text-gray-800">{uptime ?? '—'}</p></div>
          </div>
          <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4 hover:shadow-lg transition-transform duration-200">
            <ServerStackIcon className="h-8 w-8 text-rose-500" />
            <div><p className="text-sm text-gray-500">System Status</p><p className={`text-xl font-bold ${systemStatus === 'Operational' ? 'text-green-600' : 'text-red-600'}`}>{systemStatus ?? '—'}</p></div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button onClick={() => setModalOpen(true)} className="bg-blue-600 text-white py-3 px-4 rounded-lg shadow hover:bg-blue-700 transition">➕ Create New User</button>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="bg-white rounded-xl shadow p-6">
            {activityLoading ? <p className="text-gray-500">Loading…</p> : activityLogs.length === 0 ? <p className="text-gray-500">No recent activity yet.</p> : <ul className="divide-y divide-gray-200">
              {activityLogs.map((log, idx) => {
                const Icon = actionIconMap[log.action] || DocumentDuplicateIcon;
                return (
                  <li key={idx} className="py-3 flex items-start gap-3">
                    <Icon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="font-medium text-blue-600">{log.user.username}</span>{' '}
                      <span className="font-semibold">{log.action.replace(/_/g, ' ')}</span>
                      {log.detail && <span className="text-gray-500">: {log.detail}</span>}
                      <div className="text-xs text-gray-400 mt-1">{timeAgo(new Date(log.createdAt))}</div>
                    </div>
                  </li>
                );
              })}
            </ul>}'
            { total > 0 && (
              <div className="flex justify-between items-center mt-4">
                <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Previous</button>
                <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Next</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
