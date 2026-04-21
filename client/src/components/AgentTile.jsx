import React from 'react';
import { useNavigate } from 'react-router-dom';
import AgentIcon from './AgentIcon';
import { CATEGORY_LABELS } from '../lib/utils';

export default function AgentTile({ agent, isLast }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/agent/${agent.slug}`)}
      className={`flex items-center gap-4 py-3.5 cursor-pointer group ${!isLast ? 'border-b border-gray-100' : ''}`}
    >
      {/* Icon */}
      <AgentIcon iconUrl={agent.icon_url} name={agent.name} category={agent.category} size="lg" />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold text-gray-900 truncate leading-snug">
          {agent.name}
        </p>
        <p className="text-[13px] text-gray-400 truncate mt-0.5 leading-snug">
          {agent.short_description}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] font-medium text-gray-400">
            {CATEGORY_LABELS[agent.category] || agent.category}
          </span>
          {agent.avg_rating && (
            <>
              <span className="text-gray-200">·</span>
              <span className="text-[11px] text-gray-400">★ {agent.avg_rating}</span>
            </>
          )}
          {agent.likes_count > 0 && (
            <>
              <span className="text-gray-200">·</span>
              <span className="text-[11px] text-gray-400">{agent.likes_count} likes</span>
            </>
          )}
        </div>
      </div>

      {/* Open button */}
      <button
        className="flex-shrink-0 px-4 py-1.5 rounded-full bg-[#F2F2F7] text-[#1B3C8C] text-[13px] font-semibold
                   group-hover:bg-[#1B3C8C] group-hover:text-white transition-all duration-150"
      >
        Open
      </button>
    </div>
  );
}
