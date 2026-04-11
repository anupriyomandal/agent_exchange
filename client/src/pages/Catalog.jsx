import React, { useState, useEffect, useMemo } from 'react';
import AgentTile from '../components/AgentTile';
import { getAgents } from '../lib/api';
import { CATEGORIES, CATEGORY_LABELS } from '../lib/utils';

const ALL_CATEGORIES = [{ value: 'all', label: 'All' }, ...CATEGORIES];

export default function Catalog() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    setLoading(true);
    getAgents({ sort })
      .then((res) => setAgents(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [sort]);

  const filtered = useMemo(() => {
    let list = agents;
    if (activeCategory !== 'all') {
      list = list.filter((a) => a.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.short_description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [agents, activeCategory, search]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#534AB7] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span className="font-bold text-lg text-[#534AB7]">Agent Exchange</span>
            </div>
            <div className="flex-1 max-w-sm">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input pl-9"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Category pills + sort */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.value
                    ? 'bg-[#534AB7] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input w-auto text-sm"
          >
            <option value="newest">Newest</option>
            <option value="likes">Most Liked</option>
          </select>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-400 mb-4">
          {loading ? 'Loading...' : `${filtered.length} agent${filtered.length !== 1 ? 's' : ''}`}
        </p>

        {/* Agent list */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-4 flex items-start gap-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-xl flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium text-gray-500">No agents found</p>
            <p className="text-sm mt-1">Try a different search or category</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((agent) => (
              <AgentTile key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
