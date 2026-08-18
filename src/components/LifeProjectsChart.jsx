import { useMemo } from "react";
import { lifeClock } from "../data";

const BIRTH_YEAR = new Date(lifeClock.birthAt).getFullYear();

/**
 * Yearly project count over a life — line rises and falls with releases each year.
 */
export default function LifeProjectsChart({ repos = [] }) {
  const chart = useMemo(() => {
    const endYear = new Date().getFullYear();
    const startYear = BIRTH_YEAR;
    const years = [];
    for (let y = startYear; y <= endYear; y += 1) years.push(y);

    const counts = years.map((y) =>
      repos.filter((r) => r.created_at && new Date(r.created_at).getFullYear() === y)
        .length,
    );

    const maxCount = Math.max(1, ...counts);
    const total = counts.reduce((a, b) => a + b, 0);

    const byYear = {};
    repos.forEach((r) => {
      if (!r.created_at) return;
      const y = new Date(r.created_at).getFullYear();
      if (y < startYear || y > endYear) return;
      if (!byYear[y]) byYear[y] = [];
      byYear[y].push(r);
    });

    return { years, counts, maxCount, total, byYear, startYear, endYear };
  }, [repos]);

  if (!repos.length) return null;

  const W = 1000;
  const H = 240;
  const padL = 36;
  const padR = 28;
  const padT = 28;
  const padB = 44;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const n = chart.years.length;

  const xAt = (i) => padL + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const yAt = (count) => padT + innerH - (count / chart.maxCount) * innerH;

  const lineD = chart.counts
    .map((c, i) => `${i === 0 ? "M" : "L"} ${xAt(i).toFixed(1)} ${yAt(c).toFixed(1)}`)
    .join(" ");

  const areaD = `${lineD} L ${xAt(n - 1).toFixed(1)} ${(padT + innerH).toFixed(1)} L ${xAt(0).toFixed(1)} ${(padT + innerH).toFixed(1)} Z`;

  const tickYears = chart.years.filter(
    (y) =>
      y === chart.startYear ||
      y === chart.endYear ||
      y % 4 === 0,
  );

  return (
    <div className="life-chart">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <p className="scp-label mb-2">Across a life</p>
          <h3 className="font-sans text-2xl sm:text-3xl font-light tracking-[0.06em] text-scp-text">
            Releases
          </h3>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-scp-faint">
          {chart.total} published · {chart.startYear}—{chart.endYear}
        </p>
      </div>

      <div className="life-chart__frame border border-scp-border px-2 sm:px-3 py-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto block"
          role="img"
          aria-label="Projects published per year of life"
        >
          {/* baseline */}
          <line
            x1={padL}
            y1={padT + innerH}
            x2={padL + innerW}
            y2={padT + innerH}
            stroke="var(--scp-border)"
            strokeWidth="1"
          />

          {/* soft fill under the wave */}
          <path d={areaD} fill="var(--scp-text)" fillOpacity="0.05" />

          {/* yearly count line — rises & falls */}
          <path
            d={lineD}
            fill="none"
            stroke="var(--scp-text)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="life-chart__line"
          />

          {/* year ticks + peaks */}
          {chart.years.map((y, i) => {
            const count = chart.counts[i];
            const x = xAt(i);
            const yPos = yAt(count);
            const showTick = tickYears.includes(y);
            const reposInYear = chart.byYear[y] || [];

            return (
              <g key={y}>
                {showTick && (
                  <>
                    <line
                      x1={x}
                      y1={padT + innerH}
                      x2={x}
                      y2={padT + innerH + 6}
                      stroke="var(--scp-faint)"
                      strokeWidth="1"
                    />
                    <text
                      x={x}
                      y={H - 12}
                      textAnchor="middle"
                      fill="var(--scp-faint)"
                      fontSize="11"
                      fontFamily="IBM Plex Mono, monospace"
                    >
                      {y}
                    </text>
                  </>
                )}

                {/* vertex — only when there were releases that year */}
                {count > 0 && (
                  <g className="life-chart__peak">
                    <circle
                      cx={x}
                      cy={yPos}
                      r="5"
                      fill="var(--scp-bg)"
                      stroke="var(--scp-text)"
                      strokeWidth="1.35"
                    >
                      <title>
                        {`${y}: ${count} project${count === 1 ? "" : "s"}${
                          reposInYear.length
                            ? " — " + reposInYear.map((r) => r.name).join(", ")
                            : ""
                        }`}
                      </title>
                    </circle>
                    <circle
                      cx={x}
                      cy={yPos}
                      r="1.8"
                      fill="var(--scp-text)"
                      opacity="0.85"
                    />
                    <text
                      x={x}
                      y={yPos - 12}
                      textAnchor="middle"
                      fill="var(--scp-muted)"
                      fontSize="10"
                      fontFamily="IBM Plex Mono, monospace"
                    >
                      {count}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <p className="mt-3 font-sans text-[11px] text-scp-faint tracking-wide">
        Height is how many pieces shipped that year of life.
      </p>
    </div>
  );
}
