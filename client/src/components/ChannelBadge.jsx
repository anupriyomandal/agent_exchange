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
      ? 'px-2.5 py-1 text-xs'
      : 'px-3.5 py-1.5 text-sm';

  const base = `inline-block rounded-full bg-[#E8EEF8] text-[#1B3C8C] font-semibold ${classes}`;

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} hover:bg-[#1B3C8C] hover:text-white transition-all duration-200`}
      >
        {label}
      </a>
    );
  }

  return <span className={base}>{label}</span>;
}
