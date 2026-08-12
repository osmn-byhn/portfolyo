import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * Brand mark — compass rose with containment core.
 * Clean enough for favicon / app icon / print.
 */
export default function ScpLogo({ size = 200, className = "" }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanMsg, setScanMsg] = useState("");

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 260, damping: 30 };
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), spring);
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), spring);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const onLeave = () => {
    setHovered(false);
    mx.set(0);
    my.set(0);
  };

  const runScan = () => {
    if (scanning) return;
    setScanning(true);
    setScanMsg("ALIGNING…");
    setTimeout(() => setScanMsg("BEARING LOCKED"), 550);
    setTimeout(() => {
      setScanning(false);
      setScanMsg("");
    }, 1300);
  };

  return (
    <div className={`scp-logo ${className}`} style={{ width: size }}>
      <button
        type="button"
        ref={ref}
        className={`scp-logo-btn ${scanning ? "is-scanning" : ""}`}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onLeave}
        onClick={runScan}
        aria-label="Compass brand mark"
      >
        <motion.div
          className="scp-logo-disc"
          style={{ rotateX: rx, rotateY: ry }}
          animate={{
            scale: hovered ? 1.04 : 1,
            borderColor: hovered ? "rgba(159,29,32,0.7)" : "rgba(58,64,64,0.95)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
        >
          <svg viewBox="0 0 200 200" className="scp-logo-svg" aria-hidden="true">
            <defs>
              <linearGradient id="needleLight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f4f4f4" />
                <stop offset="100%" stopColor="#9a9a9a" />
              </linearGradient>
              <linearGradient id="needleDark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9f1d20" />
                <stop offset="100%" stopColor="#5c1012" />
              </linearGradient>
              <linearGradient id="cardinal" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#efefef" />
                <stop offset="100%" stopColor="#8d8d8d" />
              </linearGradient>
            </defs>

            {/* dial */}
            <circle cx="100" cy="100" r="96" fill="#0d0f0f" />
            <circle cx="100" cy="100" r="92" fill="none" stroke="#2a2e2e" strokeWidth="1" />
            <circle cx="100" cy="100" r="84" fill="none" stroke="#9f1d20" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="76" fill="none" stroke="#232727" strokeWidth="1" />

            {/* degree ticks */}
            {Array.from({ length: 72 }, (_, i) => {
              const major = i % 6 === 0;
              const mid = i % 3 === 0;
              const a = (i * 5 - 90) * (Math.PI / 180);
              const r1 = major ? 68 : mid ? 70 : 72;
              const r2 = 74.5;
              return (
                <line
                  key={i}
                  x1={100 + Math.cos(a) * r1}
                  y1={100 + Math.sin(a) * r1}
                  x2={100 + Math.cos(a) * r2}
                  y2={100 + Math.sin(a) * r2}
                  stroke={major ? "#9f1d20" : "#3a4040"}
                  strokeWidth={major ? 1.4 : 0.8}
                  opacity={major ? 0.95 : 0.7}
                />
              );
            })}

            {/* cardinal letters */}
            <g
              fill="#777"
              fontFamily="IBM Plex Mono, ui-monospace, monospace"
              fontSize="9"
              fontWeight="600"
              letterSpacing="1"
              textAnchor="middle"
            >
              <text x="100" y="30">N</text>
              <text x="172" y="104">E</text>
              <text x="100" y="178">S</text>
              <text x="28" y="104">W</text>
            </g>

            {/* rotating rose */}
            <motion.g
              style={{ transformOrigin: "100px 100px" }}
              animate={{ rotate: hovered ? 12 : 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            >
              {/* intercardinal points (NE, SE, SW, NW) */}
              {[45, 135, 225, 315].map((deg) => (
                <g key={deg} transform={`rotate(${deg} 100 100)`}>
                  <path d="M100 48 L104.5 100 L100 92 L95.5 100 Z" fill="#4a5050" />
                </g>
              ))}

              {/* main compass needle — N light / S crimson */}
              <path d="M100 36 L108 100 L100 90 L92 100 Z" fill="url(#needleLight)" />
              <path d="M100 164 L108 100 L100 110 L92 100 Z" fill="url(#needleDark)" />

              {/* E / W arms */}
              <path d="M164 100 L100 106 L110 100 L100 94 Z" fill="url(#cardinal)" opacity="0.9" />
              <path d="M36 100 L100 106 L90 100 L100 94 Z" fill="url(#cardinal)" opacity="0.9" />
            </motion.g>

            {/* pivot hub */}
            <circle cx="100" cy="100" r="14" fill="#0d0f0f" stroke="#3a4040" strokeWidth="1.25" />
            <circle cx="100" cy="100" r="8" fill="none" stroke="#9f1d20" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="3.5" fill="#e8e8e8" />
          </svg>

          {scanning && <span className="scp-logo-beam" aria-hidden="true" />}
        </motion.div>
      </button>

      <div className="scp-logo-meta">
        <p className="scp-logo-name">OSMAN BEYHAN</p>
        <p className={`scp-logo-tag ${scanMsg ? "is-live" : ""}`}>
          {scanMsg || "BUILD · SHIP · ITERATE"}
        </p>
      </div>
    </div>
  );
}
