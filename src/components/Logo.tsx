export function Symbol({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`symbol ${className}`}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 4h12l8 12 8-12h12L30 24l14 20H32l-8-12-8 12H4l14-20L4 4Z"
        fill="currentColor"
      />
      <path d="m24 18 4 6-4 6-4-6 4-6Z" fill="var(--symbol-cut, #071727)" />
    </svg>
  );
}
export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="logo">
      <Symbol />
      {!compact && (
        <span className="logo-type">
          <strong>XARCON</strong>
          <span>CREATIVE</span>
        </span>
      )}
    </span>
  );
}
