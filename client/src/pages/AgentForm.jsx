import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminGetAgents, adminCreateAgent, adminUpdateAgent } from '../lib/api';
import { CATEGORIES } from '../lib/utils';

const CHANNEL_OPTIONS = ['web', 'whatsapp', 'telegram', 'slack', 'instagram', 'other'];
const CHANNEL_LABELS = { web: 'Web', whatsapp: 'WhatsApp', telegram: 'Telegram', slack: 'Slack', instagram: 'Instagram', other: 'Other' };

export default function AgentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const [name, setName] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [longDesc, setLongDesc] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('draft');
  const [channels, setChannels] = useState([]);
  const [channelLinks, setChannelLinks] = useState({});
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    adminGetAgents()
      .then((res) => {
        const agent = res.data.find((a) => a.id === id);
        if (!agent) { navigate('/admin/agents'); return; }
        setName(agent.name);
        setShortDesc(agent.short_description);
        setLongDesc(agent.long_description);
        setCategory(agent.category);
        setStatus(agent.status);
        setChannels(agent.channels || []);
        setChannelLinks(agent.channel_links || {});
        setIconPreview(agent.icon_url || '');
      })
      .catch(() => navigate('/admin/agents'))
      .finally(() => setFetching(false));
  }, [id]);

  function handleIconChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('Icon must be under 2MB');
      return;
    }
    setIconFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setIconPreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  function toggleChannel(ch) {
    setChannels((prev) => {
      const next = prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch];
      // Remove link if channel unchecked
      if (!next.includes(ch)) {
        setChannelLinks((links) => { const l = { ...links }; delete l[ch]; return l; });
      }
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !shortDesc || !longDesc || !category) {
      setError('Name, short description, long description, and category are required.');
      return;
    }
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('short_description', shortDesc);
    formData.append('long_description', longDesc);
    formData.append('category', category);
    formData.append('status', status);
    formData.append('channels', JSON.stringify(channels));
    formData.append('channel_links', JSON.stringify(channelLinks));
    if (iconFile) formData.append('icon', iconFile);

    try {
      if (isEdit) {
        await adminUpdateAgent(id, formData);
      } else {
        await adminCreateAgent(formData);
      }
      navigate('/admin/agents');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save agent');
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return <div className="text-gray-400 text-sm">Loading...</div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/agents')} className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-900">{isEdit ? 'Edit agent' : 'Add new agent'}</h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Icon */}
        <div className="card p-4">
          <label className="label">Agent icon</label>
          <div className="flex items-center gap-4">
            {iconPreview ? (
              <img src={iconPreview} alt="icon" className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-secondary text-xs">
                {iconPreview ? 'Change icon' : 'Upload icon'}
              </button>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, SVG · max 2MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/svg+xml"
              onChange={handleIconChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="label">Name *</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. SupportBot Pro" required />
        </div>

        {/* Short description */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="label mb-0">Short description *</label>
            <span className={`text-xs ${shortDesc.length > 200 ? 'text-red-500' : 'text-gray-400'}`}>
              {shortDesc.length}/200
            </span>
          </div>
          <input
            className="input"
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            placeholder="One-liner shown on agent tile"
            maxLength={200}
            required
          />
        </div>

        {/* Long description */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="label mb-0">Long description *</label>
            <button
              type="button"
              onClick={() => setShowPreview((p) => !p)}
              className="text-xs text-[#1B3C8C] hover:underline"
            >
              {showPreview ? 'Edit' : 'Preview'}
            </button>
          </div>
          {showPreview ? (
            <div className="border border-gray-200 rounded-lg p-3 min-h-[120px] text-sm text-gray-700 prose prose-sm max-w-none">
              {longDesc || <span className="text-gray-300">Nothing to preview</span>}
            </div>
          ) : (
            <textarea
              className="input min-h-[120px] resize-y font-mono text-xs"
              value={longDesc}
              onChange={(e) => setLongDesc(e.target.value)}
              placeholder="Markdown supported..."
              required
            />
          )}
        </div>

        {/* Category + Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Category *</label>
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="draft">Draft</option>
              <option value="pending_review">Pending Review</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* Channels */}
        <div>
          <label className="label">Channels available</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {CHANNEL_OPTIONS.map((ch) => (
              <label key={ch} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.includes(ch)}
                  onChange={() => toggleChannel(ch)}
                  className="accent-[#1B3C8C]"
                />
                <span className="text-sm text-gray-700">{CHANNEL_LABELS[ch]}</span>
              </label>
            ))}
          </div>

          {/* Channel links */}
          {channels.length > 0 && (
            <div className="space-y-2">
              {channels.map((ch) => (
                <div key={ch} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-20 flex-shrink-0">{CHANNEL_LABELS[ch]}</span>
                  <input
                    className="input text-sm"
                    placeholder={`https://...`}
                    value={channelLinks[ch] || ''}
                    onChange={(e) => setChannelLinks((prev) => ({ ...prev, [ch]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : isEdit ? 'Save changes' : 'Create agent'}
          </button>
          <button type="button" onClick={() => navigate('/admin/agents')} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
