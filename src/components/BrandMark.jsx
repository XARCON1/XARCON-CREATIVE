export default function BrandMark({ compact = false }) {
  return (
    <span className={compact ? 'brand-symbol compact' : 'brand-symbol'} aria-hidden="true">
      <svg viewBox="0 0 64 64" role="img">
        <defs>
          <linearGradient id="xg" x1="8" y1="8" x2="56" y2="56">
            <stop offset="0" stopColor="#eafff0" />
            <stop offset="0.52" stopColor="#9ff3b9" />
            <stop offset="1" stopColor="#8ebcff" />
          </linearGradient>
        </defs>
        <g fill="url(#xg)">
          <rect x="11" y="5" width="16" height="29" rx="8" transform="rotate(-42 19 19.5)" />
          <rect x="37" y="5" width="16" height="29" rx="8" transform="rotate(42 45 19.5)" />
          <rect x="11" y="30" width="16" height="29" rx="8" transform="rotate(42 19 44.5)" />
          <rect x="37" y="30" width="16" height="29" rx="8" transform="rotate(-42 45 44.5)" />
        </g>
        <circle cx="32" cy="32" r="4" fill="#071727" />
      </svg>
    </span>
  );
}
