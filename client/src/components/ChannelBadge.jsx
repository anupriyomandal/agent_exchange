import React from 'react';

const CHANNEL_LABELS = {
  web: 'Web',
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
  slack: 'Slack',
  instagram: 'Instagram',
  other: 'Other',
};

export default function ChannelBadge({ channel, href, size = 'sm' }) {
  const label = CHANNEL_LABELS[channel] || channel;
  const classes =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs'
      : 'px-3 py-1 text-sm';

  const base = `inline-block rounded-full bg-gray-100 text-gray-600 font-medium ${classes}`;

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} hover:bg-gray-200 transition-colors`}
      >
        {label}
      </a>
    );
  }

  return <span className={base}>{label}</span>;
}
