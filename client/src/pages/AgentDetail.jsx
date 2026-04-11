import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
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
      .then((res) => {
        setAgent(res.data);
        setLikes(res.data.likes_count);
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleLike() {
    setLikeLoading(true);
    setLikes((l) => l + 1); // optimistic
    try {
      const res = await likeAgent(slug);
      setLikes(res.data.likes_count);
    } catch {
      setLikes((l) => l - 1); // revert
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
      const res = await submitReview(slug, {
        reviewer_name: reviewName,
        rating: reviewRating,
        comment: reviewComment,
      });
      setAgent((a) => ({
        ...a,
        reviews: [res.data, ...a.reviews],
        review_count: a.review_count + 1,
      }));
      setReviewName('');
      setReviewRating(0);
      setReviewComment('');
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!agent) return null;

  const channelLinks = agent.channel_links || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to catalog
        </button>

        {/* Agent header */}
        <div className="card p-6 mb-4">
          <div className="flex items-start gap-4">
            <AgentIcon iconUrl={agent.icon_url} name={agent.name} category={agent.category} size="xl" />
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900">{agent.name}</h1>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#EEF0FF] text-[#534AB7] text-xs font-medium">
                {CATEGORY_LABELS[agent.category] || agent.category}
              </span>
              <p className="text-sm text-gray-500 mt-2">{agent.short_description}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              {likes} likes
            </div>
            {agent.avg_rating && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <StarDisplay rating={agent.avg_rating} size={14} />
                <span>{agent.avg_rating} ({agent.review_count} reviews)</span>
              </div>
            )}
          </div>
        </div>

        {/* Available on */}
        {(agent.channels || []).length > 0 && (
          <div className="card p-4 mb-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Available on</h2>
            <div className="flex flex-wrap gap-2">
              {agent.channels.map((ch) => (
                <ChannelBadge
                  key={ch}
                  channel={ch}
                  href={channelLinks[ch]}
                  size="md"
                />
              ))}
            </div>
          </div>
        )}

        {/* Like button */}
        <button
          onClick={handleLike}
          disabled={likeLoading}
          className="w-full card p-3 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:border-[#534AB7] hover:text-[#534AB7] transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          Like this agent · {likes}
        </button>

        {/* About */}
        <div className="card p-6 mb-4">
          <h2 className="font-semibold text-gray-900 mb-3">About</h2>
          <div className="prose prose-sm max-w-none text-gray-600">
            <ReactMarkdown>{agent.long_description}</ReactMarkdown>
          </div>
        </div>

        {/* Reviews */}
        <div className="card p-6 mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">
            Reviews {agent.review_count > 0 && <span className="text-gray-400 font-normal">({agent.review_count})</span>}
          </h2>
          {(agent.reviews || []).length === 0 ? (
            <p className="text-sm text-gray-400">No reviews yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {agent.reviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          )}
        </div>

        {/* Leave a review */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Leave a review</h2>
          {reviewSuccess && (
            <div className="bg-green-50 text-green-700 text-sm px-3 py-2 rounded-lg mb-4">
              Thanks for your review!
            </div>
          )}
          {reviewError && (
            <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-4">
              {reviewError}
            </div>
          )}
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="label">Your name</label>
              <input
                className="input"
                placeholder="Jane Smith"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Rating</label>
              <StarPicker value={reviewRating} onChange={setReviewRating} />
            </div>
            <div>
              <label className="label">Comment</label>
              <textarea
                className="input min-h-[80px] resize-y"
                placeholder="Share your experience..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
              />
            </div>
            <button type="submit" disabled={reviewLoading} className="btn-primary">
              {reviewLoading ? 'Submitting...' : 'Submit review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
