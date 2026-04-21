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
    if (activeCategory !== 'all') list = list.filter((a) => a.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) => a.name.toLowerCase().includes(q) || a.short_description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [agents, activeCategory, search]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Sticky header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-5">
          {/* Top bar */}
          <div className="pt-5 pb-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold text-[#1B3C8C] uppercase tracking-widest mb-0.5">
                  CEAT
                </p>
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tighter leading-none">
                  AI Agents
                </h1>
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-[13px] text-[#1B3C8C] font-semibold bg-transparent border-none outline-none cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="likes">Most Liked</option>
              </select>
            </div>

            {/* Search */}
            <div className="relative mt-3">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search agents…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#F2F2F7] rounded-xl pl-9 pr-4 py-2 text-[15px] placeholder:text-gray-400
                           focus:outline-none focus:ring-2 focus:ring-[#1B3C8C]/20 transition-all"
              />
            </div>
          </div>

          {/* Category pills — horizontal scroll */}
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-1 px-1">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-150 ${
                  activeCategory === cat.value
                    ? 'bg-[#1B3C8C] text-white'
                    : 'bg-[#F2F2F7] text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-5 pt-2 pb-10">
        {/* Count */}
        <p className="text-[12px] text-gray-400 font-medium py-3">
          {loading ? 'Loading…' : `${filtered.length} agent${filtered.length !== 1 ? 's' : ''}`}
        </p>

        {/* List */}
        {loading ? (
          <div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`flex items-center gap-4 py-3.5 animate-pulse ${i < 3 ? 'border-b border-gray-100' : ''}`}>
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-3.5 bg-gray-100 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
                <div className="w-14 h-7 bg-gray-100 rounded-full flex-shrink-0" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-5xl mb-4">🔍</p>
            <p className="font-semibold text-gray-500 text-lg">No agents found</p>
            <p className="text-sm mt-1">Try a different search or category</p>
          </div>
        ) : (
          <div>
            {filtered.map((agent, i) => (
              <AgentTile key={agent.id} agent={agent} isLast={i === filtered.length - 1} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-[11px] text-gray-300 pb-8 pt-2">
        Made by Anupriyo Mandal
      </footer>
    </div>
  );
}
