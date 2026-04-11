import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminGetAgents, adminDeleteAgent, adminUpdateStatus } from '../lib/api';
import AgentIcon from '../components/AgentIcon';
import { CATEGORY_LABELS, STATUS_LABELS, STATUS_COLORS, timeAgo } from '../lib/utils';

export default function AdminAgents() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  async function fetchAgents() {
    try {
      const res = await adminGetAgents();
      setAgents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await adminDeleteAgent(id);
      setAgents((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert('Failed to delete agent');
    } finally {
      setDeletingId(null);
    }
  }

  async function handleStatusChange(id, status) {
    try {
      const res = await adminUpdateStatus(id, status);
      setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, status: res.data.status } : a)));
    } catch {
      alert('Failed to update status');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Agents</h1>
        <button onClick={() => navigate('/admin/agents/new')} className="btn-primary">
          + Add new agent
        </button>
      </div>

      {loading ? (
        <div className="card divide-y divide-gray-100">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-xl" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/6" />
              </div>
            </div>
          ))}
        </div>
      ) : agents.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <p className="font-medium text-gray-500 mb-1">No agents yet</p>
          <p className="text-sm">Add your first agent to get started.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          {/* Table header — hidden on mobile */}
          <div className="hidden md:grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 items-center px-4 py-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
            <span className="w-10" />
            <span>Name</span>
            <span>Category</span>
            <span>Status</span>
            <span>Likes</span>
            <span>Actions</span>
          </div>
          <div className="divide-y divide-gray-100">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="flex flex-col md:grid md:grid-cols-[auto_1fr_auto_auto_auto_auto] gap-2 md:gap-4 items-start md:items-center px-4 py-3"
              >
                {/* Icon */}
                <AgentIcon iconUrl={agent.icon_url} name={agent.name} category={agent.category} size="sm" />

                {/* Name + date */}
                <div className="min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{agent.name}</p>
                  <p className="text-xs text-gray-400">{timeAgo(agent.created_at)}</p>
                </div>

                {/* Category */}
                <span className="text-xs text-gray-500 hidden md:block">
                  {CATEGORY_LABELS[agent.category] || agent.category}
                </span>

                {/* Status badge + dropdown */}
                <div className="flex items-center gap-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[agent.status]}`}>
                    {STATUS_LABELS[agent.status]}
                  </span>
                  <select
                    value={agent.status}
                    onChange={(e) => handleStatusChange(agent.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-[#534AB7]"
                  >
                    <option value="draft">Draft</option>
                    <option value="pending_review">Pending Review</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {/* Likes */}
                <span className="text-sm text-gray-500 hidden md:block">{agent.likes_count}</span>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/admin/agents/${agent.id}/edit`)}
                    className="text-xs btn-secondary py-1 px-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(agent.id, agent.name)}
                    disabled={deletingId === agent.id}
                    className="text-xs btn-danger py-1 px-2"
                  >
                    {deletingId === agent.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
