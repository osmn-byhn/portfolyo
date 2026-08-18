export function StatusIndicator({
  status = "operational",
  label,
  className = "",
}) {
  const map = {
    operational: { text: "Present" },
    active: { text: "Living" },
    warning: { text: "Quiet" },
    locked: { text: "Still" },
    offline: { text: "Gone" },
    classified: { text: "Hidden" },
  };

  const item = map[status] || map.operational;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.2em] text-scp-muted ${className}`}
    >
      <span className="h-1 w-1 rounded-full bg-scp-muted" aria-hidden="true" />
      {label || item.text}
    </span>
  );
}

export function MetadataRow({ label, value, className = "" }) {
  return (
    <div className={`flex items-baseline gap-3 font-sans text-[12px] ${className}`}>
      <span className="text-scp-faint uppercase tracking-[0.16em] shrink-0 min-w-[5rem] text-[10px]">
        {label}
      </span>
      <span className="text-scp-text">{value}</span>
    </div>
  );
}

export function SectionHeader({ id, code, title, count, countLabel = "items" }) {
  return (
    <div className="mb-12 pb-5 border-b border-scp-border">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          {code && <p className="scp-label mb-3">{code}</p>}
          <a href={`#${id}`} className="group">
            <h2 className="font-sans text-3xl sm:text-4xl font-light tracking-[0.08em] text-scp-text group-hover:tracking-[0.12em] transition-all duration-500">
              {title}
            </h2>
          </a>
        </div>
        {typeof count === "number" && count > 0 && (
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-scp-faint">
            {String(count).padStart(2, "0")} {countLabel}
          </span>
        )}
      </div>
    </div>
  );
}
