import { useEffect, useState } from "react";
import { lifeClock } from "../data";

function pad(n) {
  return String(n).padStart(2, "0");
}

/** Calendar-accurate span from `from` to `to`. */
export function diffLived(from, to) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();
  let hours = to.getHours() - from.getHours();
  let minutes = to.getMinutes() - from.getMinutes();
  let seconds = to.getSeconds() - from.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }
  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }
  if (hours < 0) {
    hours += 24;
    days -= 1;
  }
  if (days < 0) {
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
    days += prevMonth.getDate();
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { years, months, days, hours, minutes, seconds };
}

function resolveEndpoints() {
  const birth = new Date(lifeClock.birthAt);
  if (lifeClock.deathAt) {
    return { birth, now: new Date(lifeClock.deathAt), frozen: true };
  }
  return { birth, now: new Date(), frozen: false };
}

export function useLivedTime() {
  const [lived, setLived] = useState(() => {
    const { birth, now, frozen } = resolveEndpoints();
    return { ...diffLived(birth, now), frozen };
  });

  useEffect(() => {
    if (lifeClock.deathAt) return undefined;

    const tick = () => {
      const { birth, now, frozen } = resolveEndpoints();
      setLived({ ...diffLived(birth, now), frozen });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return lived;
}

const UNITS = [
  { key: "years", label: "years" },
  { key: "months", label: "months" },
  { key: "days", label: "days" },
  { key: "hours", label: "hours" },
  { key: "minutes", label: "min" },
  { key: "seconds", label: "sec" },
];

export default function LivedTime({ lived, className = "" }) {
  return (
    <div className={`lived-time ${className}`}>
      <div className="flex flex-wrap items-baseline gap-x-1 gap-y-1 font-mono text-[11px] sm:text-xs tracking-wide text-scp-muted">
        <span className="uppercase tracking-[0.2em] text-scp-faint mr-2 shrink-0">
          {lived.frozen ? "Lived" : "Living"}
        </span>
        {UNITS.map((u, i) => (
          <span key={u.key} className="inline-flex items-baseline gap-1">
            {i > 0 && <span className="text-scp-faint mx-0.5">·</span>}
            <span className="text-scp-text tabular-nums">
              {u.key === "hours" || u.key === "minutes" || u.key === "seconds"
                ? pad(lived[u.key])
                : lived[u.key]}
            </span>
            <span className="text-scp-faint">{u.label}</span>
          </span>
        ))}
      </div>
      {lived.frozen && (
        <p className="mt-1.5 font-sans text-[10px] uppercase tracking-[0.2em] text-scp-faint">
          Clock stopped
        </p>
      )}
    </div>
  );
}
