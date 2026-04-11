import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './components/RequireAuth';
import AdminLayout from './components/AdminLayout';

import Catalog from './pages/Catalog';
import AgentDetail from './pages/AgentDetail';
import AdminLogin from './pages/AdminLogin';
import AdminAgents from './pages/AdminAgents';
import AgentForm from './pages/AgentForm';
import AdminReviews from './pages/AdminReviews';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Catalog />} />
          <Route path="/agent/:slug" element={<AgentDetail />} />

          {/* Admin auth */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Navigate to="/admin/agents" replace />} />

          {/* Admin protected */}
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route path="agents" element={<AdminAgents />} />
            <Route path="agents/new" element={<AgentForm />} />
            <Route path="agents/:id/edit" element={<AgentForm />} />
            <Route path="reviews" element={<AdminReviews />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
