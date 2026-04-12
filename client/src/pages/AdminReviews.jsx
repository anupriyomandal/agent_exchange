import React, { useState, useEffect } from 'react';
import { adminGetReviews, adminDeleteReview, adminGetAgents } from '../lib/api';
import { StarDisplay } from '../components/StarRating';
import { timeAgo } from '../lib/utils';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAgent, setFilterAgent] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    Promise.all([
      adminGetReviews(),
      adminGetAgents(),
    ])
      .then(([reviewsRes, agentsRes]) => {
        setReviews(reviewsRes.data);
        setAgents(agentsRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    if (!confirm('Delete this review?')) return;
    setDeletingId(id);
    try {
      await adminDeleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert('Failed to delete review');
    } finally {
      setDeletingId(null);
    }
  }

  const filtered = filterAgent
    ? reviews.filter((r) => r.agent_id === filterAgent)
    : reviews;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Reviews</h1>
        <select
          value={filterAgent}
          onChange={(e) => setFilterAgent(e.target.value)}
          className="input w-auto text-sm"
        >
          <option value="">All agents</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="card divide-y divide-gray-100">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-1/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <p className="font-medium text-gray-500">No reviews found</p>
        </div>
      ) : (
        <div className="card divide-y divide-gray-100">
          {filtered.map((review) => (
            <div key={review.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-medium text-sm text-gray-900">{review.reviewer_name}</span>
                    <span className="text-xs text-gray-400">on</span>
                    <span className="text-xs font-medium text-[#1B3C8C]">{review.agent?.name}</span>
                    <span className="text-xs text-gray-400">{timeAgo(review.created_at)}</span>
                  </div>
                  <StarDisplay rating={review.rating} size={13} />
                  <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                </div>
                <button
                  onClick={() => handleDelete(review.id)}
                  disabled={deletingId === review.id}
                  className="btn-danger text-xs py-1 px-2 flex-shrink-0"
                >
                  {deletingId === review.id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
