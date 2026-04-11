import React from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    navigate('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#534AB7] rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span className="font-bold text-sm text-[#534AB7]">Agent Exchange</span>
              <span className="text-gray-300">|</span>
              <span className="text-xs text-gray-500">Admin</span>
            </div>
            <nav className="flex items-center gap-1">
              <NavLink
                to="/admin/agents"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-[#EEF0FF] text-[#534AB7]' : 'text-gray-600 hover:bg-gray-100'}`
                }
              >
                Agents
              </NavLink>
              <NavLink
                to="/admin/reviews"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-[#EEF0FF] text-[#534AB7]' : 'text-gray-600 hover:bg-gray-100'}`
                }
              >
                Reviews
              </NavLink>
              <NavLink
                to="/"
                className="px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors"
              >
                ↗ View catalog
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">{user?.name}</span>
            <button onClick={handleSignOut} className="btn-secondary text-xs py-1 px-2">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
