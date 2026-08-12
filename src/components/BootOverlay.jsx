import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  { text: "BIOS CHECK .............. OK", ok: true },
  { text: "LOADING CONTAINMENT KERNEL", ok: false },
  { text: "MOUNTING PERSONNEL DOSSIER", ok: false },
  { text: "CLEARANCE VECTOR ......... L04", ok: true },
  { text: "LINK ESTABLISHED", ok: true },
];

export default function BootOverlay({ onDone }) {
  const [visible, setVisible] = useState(true);
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      onDone?.();
      return;
    }

    const seen = sessionStorage.getItem("scp-boot-seen");
    if (seen) {
      setVisible(false);
      onDone?.();
      return;
    }

    const timers = [];
    BOOT_LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setStep(i + 1), 280 + i * 320));
    });

    const prog = setInterval(() => {
      setProgress((p) => Math.min(p + 4, 100));
    }, 70);

    timers.push(
      setTimeout(() => {
        sessionStorage.setItem("scp-boot-seen", "1");
        setVisible(false);
        onDone?.();
      }, 280 + BOOT_LINES.length * 320 + 500),
    );

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(prog);
    };
  }, [onDone]);

  const skip = () => {
    sessionStorage.setItem("scp-boot-seen", "1");
    setVisible(false);
    onDone?.();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="boot-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="boot-panel">
            <div className="boot-panel-head">
              <span>SYSTEM BOOT // SECURE CONSOLE</span>
              <button type="button" className="scp-btn !py-0.5 !px-2" onClick={skip}>
                Skip
              </button>
            </div>
            <div className="boot-body">
              {BOOT_LINES.slice(0, step).map((line, i) => (
                <motion.div
                  key={i}
                  className="boot-line"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <span className="text-scp-primary">{">"}</span>
                  <span className={line.ok ? "text-scp-success" : "text-scp-text"}>
                    {line.text}
                  </span>
                </motion.div>
              ))}
              <div className="boot-progress">
                <div className="boot-progress-bar" style={{ width: `${progress}%` }} />
              </div>
              <p className="boot-meta">PROTOCOL 7 · NODE TR-01 · ENCRYPTION ACTIVE</p>
            </div>
          </div>
          <div className="boot-scanline" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
