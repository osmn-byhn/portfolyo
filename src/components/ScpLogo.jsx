/** Quiet diagonal mark — fills follow theme. */
export default function ScpLogo({ size = 28, className = "" }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={`brand-mark ${className}`}
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="15" fill="var(--scp-bg)" stroke="var(--scp-border)" strokeWidth="1" />
      <path d="M16 1 A15 15 0 0 1 31 16 L16 16 Z" fill="var(--scp-text)" opacity="0.9" />
    </svg>
  );
}
