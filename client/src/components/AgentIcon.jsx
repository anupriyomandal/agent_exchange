import React from 'react';

const CATEGORY_COLORS = {
  customer_support: 'bg-blue-50 text-blue-600',
  sales: 'bg-emerald-50 text-emerald-600',
  hr: 'bg-violet-50 text-violet-600',
  marketing: 'bg-pink-50 text-pink-600',
  internal_tools: 'bg-orange-50 text-orange-600',
  operations: 'bg-teal-50 text-teal-600',
  finance: 'bg-amber-50 text-amber-600',
  other: 'bg-gray-100 text-gray-600',
};

export default function AgentIcon({ iconUrl, name, category, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-14 h-14 text-xl',
    xl: 'w-20 h-20 text-2xl',
  };

  const colorClass = CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-600';
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  if (iconUrl) {
    return (
      <img
        src={iconUrl}
        alt={name}
        className={`${sizeClass} rounded-2xl object-cover flex-shrink-0 shadow-sm`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} ${colorClass} rounded-2xl flex items-center justify-center font-extrabold flex-shrink-0`}
    >
      {initial}
    </div>
  );
}
