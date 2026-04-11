import React from 'react';
import { StarDisplay } from './StarRating';
import { timeAgo } from '../lib/utils';

export default function ReviewCard({ review }) {
  return (
    <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-sm text-gray-900">{review.reviewer_name}</span>
        <span className="text-xs text-gray-400">{timeAgo(review.created_at)}</span>
      </div>
      <StarDisplay rating={review.rating} size={14} />
      <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
    </div>
  );
}
