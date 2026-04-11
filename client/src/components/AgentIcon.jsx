import React from 'react';

const CATEGORY_COLORS = {
  customer_support: 'bg-blue-100 text-blue-700',
  sales: 'bg-green-100 text-green-700',
  hr: 'bg-purple-100 text-purple-700',
  marketing: 'bg-pink-100 text-pink-700',
  internal_tools: 'bg-orange-100 text-orange-700',
  operations: 'bg-teal-100 text-teal-700',
  finance: 'bg-yellow-100 text-yellow-700',
  other: 'bg-gray-100 text-gray-700',
};

export default function AgentIcon({ iconUrl, name, category, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-20 h-20 text-2xl',
  };

  const colorClass = CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-700';
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  if (iconUrl) {
    return (
      <img
        src={iconUrl}
        alt={name}
        className={`${sizeClass} rounded-xl object-cover flex-shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} ${colorClass} rounded-xl flex items-center justify-center font-bold flex-shrink-0`}
    >
      {initial}
    </div>
  );
}
