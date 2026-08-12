import { useEffect, useState, useCallback } from "react";

export function StatusIndicator({
  status = "operational",
  label,
  className = "",
}) {
  const map = {
    operational: { symbol: "●", color: "text-scp-success", text: "OPERATIONAL" },
    active: { symbol: "●", color: "text-scp-success", text: "ACTIVE" },
    warning: { symbol: "▲", color: "text-scp-warning", text: "WARNING" },
    locked: { symbol: "■", color: "text-scp-muted", text: "LOCKED" },
    offline: { symbol: "✕", color: "text-scp-danger", text: "OFFLINE" },
    classified: { symbol: "◉", color: "text-scp-primary", text: "CLASSIFIED" },
  };

  const item = map[status] || map.operational;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] ${item.color} ${className}`}
    >
      <span className={status === "operational" || status === "active" ? "animate-status-pulse" : ""}>
        {item.symbol}
      </span>
      {label || item.text}
    </span>
  );
}

export function MetadataRow({ label, value, className = "" }) {
  return (
    <div className={`flex items-baseline gap-3 font-mono text-[11px] ${className}`}>
      <span className="text-scp-faint uppercase tracking-[0.12em] shrink-0 min-w-[7rem]">
        {label}
      </span>
      <span className="text-scp-text">{value}</span>
    </div>
  );
}

export function SectionHeader({ id, code, title, count, countLabel = "RECORDS" }) {
  return (
    <div className="mb-8 border border-scp-border bg-scp-surface shadow-scp group/sec relative overflow-hidden">
      <div className="sec-header-scan" aria-hidden="true" />
      <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 border-b border-scp-border bg-scp-surface-2">
        <div className="flex items-center gap-3 min-w-0">
          <span className="scp-label text-scp-primary shrink-0">
            {code || `SEC/${id?.toUpperCase()}`}
          </span>
          <a href={`#${id}`} className="group min-w-0">
            <h2 className="font-mono text-sm uppercase tracking-[0.08em] text-scp-text group-hover:text-white transition-colors truncate">
              {title}
            </h2>
          </a>
        </div>
        {typeof count === "number" && count > 0 && (
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-scp-muted border border-scp-border px-2 py-0.5">
            {String(count).padStart(2, "0")} {countLabel}
          </span>
        )}
      </div>
      <div className="h-[2px] w-12 bg-scp-primary transition-all duration-300 group-hover/sec:w-full" />
    </div>
  );
}

export function TerminalPanel({ lines = [], className = "" }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [typed, setTyped] = useState("");
  const [runId, setRunId] = useState(0);
  const [done, setDone] = useState(false);

  const replay = useCallback(() => {
    setVisibleCount(0);
    setTyped("");
    setDone(false);
    setRunId((n) => n + 1);
  }, []);

  useEffect(() => {
    if (!lines.length) return undefined;

    let lineIdx = 0;
    let charIdx = 0;
    let cancelled = false;

    setVisibleCount(0);
    setTyped("");
    setDone(false);

    const tick = () => {
      if (cancelled) return;
      const current = lines[lineIdx];
      if (!current) {
        setDone(true);
        return;
      }

      charIdx += 1;
      setTyped(current.text.slice(0, charIdx));
      setVisibleCount(lineIdx);

      if (charIdx >= current.text.length) {
        lineIdx += 1;
        charIdx = 0;
        setTimeout(tick, 180);
      } else {
        setTimeout(tick, 16 + Math.random() * 28);
      }
    };

    const start = setTimeout(tick, 200);
    return () => {
      cancelled = true;
      clearTimeout(start);
    };
  }, [lines, runId]);

  return (
    <div className={`scp-panel overflow-hidden terminal-live ${className}`}>
      <div className="scp-panel-header">
        <span className="scp-label">Terminal / System Log</span>
        <div className="flex items-center gap-2">
          <StatusIndicator status="active" label={done ? "IDLE" : "LIVE"} />
          <button type="button" className="scp-btn !py-0.5 !px-2" onClick={replay}>
            Replay
          </button>
        </div>
      </div>
      <div className="p-3 font-mono text-[11px] leading-relaxed text-scp-muted bg-scp-bg/80 space-y-1 min-h-[9.5rem]">
        {lines.slice(0, visibleCount).map((line, i) => (
          <div key={`${runId}-${i}`} className="flex gap-2">
            <span className="text-scp-primary shrink-0">{line.prefix || ">"}</span>
            <span className={line.ok ? "text-scp-success" : "text-scp-text/80"}>
              {line.text}
            </span>
          </div>
        ))}
        {visibleCount < lines.length && (
          <div className="flex gap-2">
            <span className="text-scp-primary shrink-0">
              {lines[visibleCount]?.prefix || ">"}
            </span>
            <span
              className={
                lines[visibleCount]?.ok ? "text-scp-success" : "text-scp-text/80"
              }
            >
              {typed}
              <span className="terminal-caret" />
            </span>
          </div>
        )}
        {done && (
          <div className="flex gap-2 pt-1 text-scp-faint">
            <span className="text-scp-primary">_</span>
            <span>
              awaiting input
              <span className="terminal-caret" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function SecureAlert({ title, children, tone = "warning" }) {
  const tones = {
    warning: "border-scp-warning/40",
    danger: "border-scp-danger/50",
    info: "border-scp-border",
  };

  return (
    <div className={`scp-panel ${tones[tone] || tones.info}`}>
      <div className="scp-panel-header">
        <span className="scp-label text-scp-warning">▲ {title}</span>
      </div>
      <div className="p-3 font-mono text-[11px] text-scp-muted space-y-1">{children}</div>
    </div>
  );
}

/** Interactive telemetry strip — click modules to ping */
export function TelemetryBar({ items = [] }) {
  const [pinged, setPinged] = useState(null);

  return (
    <div className="telemetry-bar">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`telemetry-node ${pinged === item.id ? "is-pinged" : ""}`}
          onClick={() => {
            setPinged(item.id);
            setTimeout(() => setPinged(null), 900);
          }}
        >
          <span className={`telemetry-dot ${item.ok ? "ok" : "warn"}`} />
          <span className="telemetry-id">{item.id}</span>
          <span className="telemetry-label">{item.label}</span>
          {pinged === item.id && <span className="telemetry-ping">PING OK</span>}
        </button>
      ))}
    </div>
  );
}
