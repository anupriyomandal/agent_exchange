export function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)} weeks ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
  return `${Math.floor(diff / 31536000)} years ago`;
}

export const CATEGORY_LABELS = {
  customer_support: 'Customer Support',
  sales: 'Sales',
  hr: 'HR',
  marketing: 'Marketing',
  internal_tools: 'Internal Tools',
  operations: 'Operations',
  finance: 'Finance',
  other: 'Other',
};

export const CATEGORIES = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }));

export const STATUS_LABELS = {
  draft: 'Draft',
  pending_review: 'Pending Review',
  published: 'Published',
  archived: 'Archived',
};

export const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-600',
  pending_review: 'bg-amber-100 text-amber-700',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-red-100 text-red-600',
};
