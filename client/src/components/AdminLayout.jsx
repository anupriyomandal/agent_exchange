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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Top nav */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#1B3C8C] rounded-xl flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span className="font-extrabold text-sm text-[#1B3C8C] tracking-tight">CEAT AI Agent Exchange</span>
              <span className="text-gray-200">|</span>
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Admin</span>
            </div>
            <nav className="flex items-center gap-1">
              <NavLink
                to="/admin/agents"
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${isActive ? 'bg-[#E8EEF8] text-[#1B3C8C]' : 'text-gray-600 hover:bg-gray-100'}`
                }
              >
                Agents
              </NavLink>
              <NavLink
                to="/admin/reviews"
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${isActive ? 'bg-[#E8EEF8] text-[#1B3C8C]' : 'text-gray-600 hover:bg-gray-100'}`
                }
              >
                Reviews
              </NavLink>
              <NavLink
                to="/"
                className="px-3.5 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-all duration-200 font-medium"
              >
                View catalog
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block font-medium">{user?.name}</span>
            <button onClick={handleSignOut} className="btn-secondary text-xs py-1.5 px-3">
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
