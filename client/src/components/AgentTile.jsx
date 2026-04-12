import React from 'react';
import { useNavigate } from 'react-router-dom';
import AgentIcon from './AgentIcon';
import ChannelBadge from './ChannelBadge';
import { StarDisplay } from './StarRating';

export default function AgentTile({ agent }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/agent/${agent.slug}`)}
      className="card p-5 flex items-start gap-4 cursor-pointer hover:shadow-card-hover hover:border-[#1B3C8C]/30 transition-all duration-200 group"
    >
      <AgentIcon iconUrl={agent.icon_url} name={agent.name} category={agent.category} size="lg" />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-gray-900 group-hover:text-[#1B3C8C] transition-colors">
            {agent.name}
          </h3>
          {agent.avg_rating && (
            <span className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0 bg-gray-50 px-2 py-1 rounded-full">
              <StarDisplay rating={agent.avg_rating} size={12} />
              <span className="font-medium">{agent.avg_rating}</span>
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{agent.short_description}</p>

        <div className="flex items-center justify-between mt-3">
          <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              />
            </svg>
            {agent.likes_count}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {(agent.channels || []).slice(0, 3).map((ch) => (
              <ChannelBadge key={ch} channel={ch} />
            ))}
            {(agent.channels || []).length > 3 && (
              <span className="text-xs text-gray-400 font-medium">+{agent.channels.length - 3}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
