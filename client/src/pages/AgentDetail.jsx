import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AgentIcon from '../components/AgentIcon';
import ChannelBadge from '../components/ChannelBadge';
import ReviewCard from '../components/ReviewCard';
import { StarDisplay, StarPicker } from '../components/StarRating';
import { getAgent, likeAgent, submitReview } from '../lib/api';
import { CATEGORY_LABELS } from '../lib/utils';

export default function AgentDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    getAgent(slug)
      .then((res) => { setAgent(res.data); setLikes(res.data.likes_count); })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleLike() {
    setLikeLoading(true);
    setLikes((l) => l + 1);
    try {
      const res = await likeAgent(slug);
      setLikes(res.data.likes_count);
    } catch {
      setLikes((l) => l - 1);
    } finally {
      setLikeLoading(false);
    }
  }

  async function handleReviewSubmit(e) {
    e.preventDefault();
    if (!reviewName || !reviewRating || !reviewComment) {
      setReviewError('Please fill in all fields and select a rating.');
      return;
    }
    setReviewLoading(true);
    setReviewError('');
    try {
      const res = await submitReview(slug, { reviewer_name: reviewName, rating: reviewRating, comment: reviewComment });
      setAgent((a) => ({ ...a, reviews: [res.data, ...a.reviews], review_count: a.review_count + 1 }));
      setReviewName(''); setReviewRating(0); setReviewComment('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch {
      setReviewError('Failed to submit review. Please try again.');
    } finally {
      setReviewLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-300 text-sm">Loading…</div>
      </div>
    );
  }

  if (!agent) return null;

  const channelLinks = agent.channel_links || {};

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-5">

        {/* Back nav */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-xl z-10 py-4 -mx-5 px-5 border-b border-gray-100">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-[15px] font-semibold text-[#1B3C8C] hover:opacity-70 transition-opacity"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Agents
          </button>
        </div>

        {/* Hero — App Store style */}
        <div className="pt-6 pb-5 border-b border-gray-100">
          <div className="flex items-start gap-5">
            <AgentIcon iconUrl={agent.icon_url} name={agent.name} category={agent.category} size="xl" />
            <div className="flex-1 min-w-0 pt-1">
              <h1 className="text-[22px] font-extrabold text-gray-900 tracking-tighter leading-tight">
                {agent.name}
              </h1>
              {agent.created_by_name && (
                <p className="text-[13px] text-[#1B3C8C] font-semibold mt-0.5">
                  {agent.created_by_name}
                </p>
              )}
              <p className="text-[13px] text-gray-400 mt-0.5">
                {CATEGORY_LABELS[agent.category] || agent.category}
              </p>
            </div>
          </div>

          {/* Like button — App Store GET style */}
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className="mt-5 px-8 py-2 rounded-full bg-[#1B3C8C] text-white text-[15px] font-bold
                       hover:bg-[#122B66] active:scale-95 transition-all duration-150 disabled:opacity-60"
          >
            👍 Like · {likes}
          </button>
        </div>

        {/* Info strip — ratings / channels */}
        <div className="flex items-center gap-6 py-4 border-b border-gray-100 overflow-x-auto">
          {agent.avg_rating && (
            <div className="flex-shrink-0 text-center">
              <p className="text-[22px] font-extrabold text-gray-800 leading-none tracking-tighter">
                {agent.avg_rating}
              </p>
              <StarDisplay rating={agent.avg_rating} size={11} />
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-1 font-semibold">
                Rating
              </p>
            </div>
          )}

          {agent.avg_rating && (agent.channels || []).length > 0 && (
            <div className="w-px h-10 bg-gray-100 flex-shrink-0" />
          )}

          {(agent.channels || []).length > 0 && (
            <div className="flex-shrink-0">
              <div className="flex flex-wrap gap-1.5">
                {agent.channels.map((ch) => (
                  <ChannelBadge key={ch} channel={ch} href={channelLinks[ch]} size="sm" />
                ))}
              </div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-1.5 font-semibold">
                Available on
              </p>
            </div>
          )}

          <div className="w-px h-10 bg-gray-100 flex-shrink-0" />
          <div className="flex-shrink-0 text-center">
            <p className="text-[22px] font-extrabold text-gray-800 leading-none tracking-tighter">
              {likes}
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-1 font-semibold">
              Likes
            </p>
          </div>
        </div>

        {/* Short description */}
        <div className="py-5 border-b border-gray-100">
          <p className="text-[15px] text-gray-600 leading-relaxed">{agent.short_description}</p>
        </div>

        {/* About */}
        <div className="py-5 border-b border-gray-100">
          <h2 className="text-[17px] font-bold text-gray-900 tracking-tight mb-3">About</h2>
          <div className="prose prose-sm max-w-none text-[13px] leading-relaxed
            prose-headings:text-gray-800 prose-headings:font-semibold prose-headings:tracking-tight
            prose-h1:text-base prose-h2:text-sm prose-h3:text-xs
            prose-p:text-gray-500 prose-p:text-[13px]
            prose-li:text-gray-500 prose-li:text-[13px]
            prose-strong:text-gray-700
            prose-a:text-[#1B3C8C] prose-a:no-underline hover:prose-a:underline
            prose-code:text-[12px] prose-code:bg-gray-50 prose-code:px-1 prose-code:rounded
            prose-table:text-[12px] prose-th:text-gray-700 prose-td:text-gray-500">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{agent.long_description}</ReactMarkdown>
          </div>
        </div>

        {/* Reviews */}
        <div className="py-5 border-b border-gray-100">
          <h2 className="text-[17px] font-bold text-gray-900 tracking-tight mb-4">
            Ratings & Reviews
            {agent.review_count > 0 && (
              <span className="text-gray-400 font-normal text-[15px] ml-2">({agent.review_count})</span>
            )}
          </h2>
          {(agent.reviews || []).length === 0 ? (
            <p className="text-[14px] text-gray-400">No reviews yet. Be the first!</p>
          ) : (
            <div className="space-y-5">
              {agent.reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
            </div>
          )}
        </div>

        {/* Leave a review */}
        <div className="py-5 pb-12">
          <h2 className="text-[17px] font-bold text-gray-900 tracking-tight mb-4">Write a Review</h2>
          {reviewSuccess && (
            <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-xl mb-4 font-medium">
              Thanks for your review!
            </div>
          )}
          {reviewError && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 font-medium">
              {reviewError}
            </div>
          )}
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="label">Your name</label>
              <input className="input" placeholder="Jane Smith" value={reviewName} onChange={(e) => setReviewName(e.target.value)} />
            </div>
            <div>
              <label className="label">Rating</label>
              <StarPicker value={reviewRating} onChange={setReviewRating} />
            </div>
            <div>
              <label className="label">Review</label>
              <textarea
                className="input min-h-[100px] resize-y"
                placeholder="Share your experience…"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
              />
            </div>
            <button type="submit" disabled={reviewLoading} className="btn-primary w-full">
              {reviewLoading ? 'Submitting…' : 'Submit Review'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
