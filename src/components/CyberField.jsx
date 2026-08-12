import { useEffect, useRef, useState } from "react";

/**
 * Mouse-reactive containment field: crosshair, hex pulse, drifting data motes.
 */
export default function CyberField() {
  const rootRef = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 40 });
  const [active, setActive] = useState(false);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (reduceMotion.current) return;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setPos({ x, y });
      setActive(true);
    };
    const onLeave = () => setActive(false);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const motes = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${(i * 37) % 100}%`,
    delay: `${(i % 7) * 0.7}s`,
    duration: `${8 + (i % 5) * 1.4}s`,
    size: 1 + (i % 3),
  }));

  return (
    <div
      ref={rootRef}
      className="cyber-field"
      aria-hidden="true"
      style={{
        "--cx": `${pos.x}%`,
        "--cy": `${pos.y}%`,
        "--field-opacity": active ? 1 : 0.45,
      }}
    >
      <div className="cyber-field-glow" />
      <div className="cyber-field-hex" />
      <div className="cyber-field-scan" />
      <div className="cyber-field-stream" />
      <div className="cyber-crosshair">
        <span className="cyber-crosshair-h" />
        <span className="cyber-crosshair-v" />
        <span className="cyber-crosshair-box" />
      </div>
      <div className="cyber-motes">
        {motes.map((m) => (
          <span
            key={m.id}
            className="cyber-mote"
            style={{
              left: m.left,
              animationDelay: m.delay,
              animationDuration: m.duration,
              width: m.size,
              height: m.size,
            }}
          />
        ))}
      </div>
    </div>
  );
}
