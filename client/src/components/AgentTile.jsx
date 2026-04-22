import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AgentIcon from './AgentIcon';
import { CATEGORY_LABELS } from '../lib/utils';

export default function AgentTile({ agent, isLast }) {
  const navigate = useNavigate();
  const [nameZoom, setNameZoom] = useState(false);
  const [hovered, setHovered] = useState(false);

  function handleNameClick() {
    setNameZoom(true);
    setTimeout(() => setNameZoom(false), 350);
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hairline divider — hides on hover */}
      {!isLast && (
        <div
          className="absolute bottom-0 right-0 left-14 h-px bg-gray-100 transition-opacity duration-200"
          style={{ opacity: hovered ? 0 : 1 }}
        />
      )}

      {/* Tile */}
      <div
        className="relative flex items-center gap-4 py-3.5 px-3 -mx-3 rounded-2xl transition-all duration-200"
        style={{
          background: hovered
            ? 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(240,244,250,0.75) 100%)'
            : 'transparent',
          backdropFilter: hovered ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: hovered ? 'blur(12px)' : 'none',
          boxShadow: hovered
            ? '0 2px 20px 0 rgba(27,60,140,0.08), 0 0 0 1px rgba(255,255,255,0.7)'
            : 'none',
        }}
      >
        {/* Icon */}
        <AgentIcon iconUrl={agent.icon_url} name={agent.name} category={agent.category} size="lg" />

        {/* Info */}
        <div className="flex-1 min-w-0 cursor-default" onClick={handleNameClick}>
          <p
            className="text-[15px] font-semibold text-gray-900 truncate leading-snug transition-transform duration-200 origin-left inline-block"
            style={{ transform: nameZoom ? 'scale(1.08)' : 'scale(1)' }}
          >
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

        {/* Open button — only this navigates */}
        <button
          onClick={() => navigate(`/agent/${agent.slug}`)}
          className="flex-shrink-0 px-4 py-1.5 rounded-full bg-[#F2F2F7] text-[#1B3C8C] text-[13px] font-semibold
                     hover:bg-[#1B3C8C] hover:text-white transition-all duration-150"
        >
          Open
        </button>
      </div>
    </div>
  );
}
