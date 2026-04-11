import React from 'react';

function Star({ filled, half, size = 16, color = '#BA7517' }) {
  if (half) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="half">
            <stop offset="50%" stopColor={color} />
            <stop offset="50%" stopColor="#D1D5DB" />
          </linearGradient>
        </defs>
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill="url(#half)"
        />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : '#D1D5DB'}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function StarDisplay({ rating, size = 16 }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const diff = rating - (i - 1);
    if (diff >= 1) stars.push(<Star key={i} filled size={size} />);
    else if (diff >= 0.5) stars.push(<Star key={i} half size={size} />);
    else stars.push(<Star key={i} size={size} />);
  }
  return <span className="inline-flex items-center gap-0.5">{stars}</span>;
}

export function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = React.useState(0);

  return (
    <span className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i)}
          className="focus:outline-none"
        >
          <Star filled={(hovered || value) >= i} size={24} />
        </button>
      ))}
    </span>
  );
}
