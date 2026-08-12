import { useEffect, useState } from "react";

const GLYPHS = "█░▒▓<>/\\|+-*=#@$%&01X";

function scramble(len) {
  let out = "";
  for (let i = 0; i < len; i++) {
    out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }
  return out;
}

/** Hover / click to decrypt classified text */
export default function DecryptText({
  text,
  className = "",
  lockedLabel = "████████",
}) {
  const [revealed, setRevealed] = useState(false);
  const [display, setDisplay] = useState(lockedLabel);

  useEffect(() => {
    if (!revealed) {
      setDisplay(lockedLabel);
      return;
    }

    let frame = 0;
    const total = 10;
    const id = setInterval(() => {
      frame += 1;
      if (frame >= total) {
        setDisplay(text);
        clearInterval(id);
        return;
      }
      const progress = frame / total;
      const keep = Math.floor(text.length * progress);
      setDisplay(text.slice(0, keep) + scramble(Math.max(text.length - keep, 0)));
    }, 28);

    return () => clearInterval(id);
  }, [revealed, text, lockedLabel]);

  return (
    <button
      type="button"
      className={`decrypt-text ${revealed ? "is-open" : ""} ${className}`}
      onMouseEnter={() => setRevealed(true)}
      onFocus={() => setRevealed(true)}
      onClick={() => setRevealed((v) => !v)}
      aria-pressed={revealed}
      title={revealed ? "Lock field" : "Decrypt field"}
    >
      <span className="decrypt-text-value">{display}</span>
      <span className="decrypt-text-hint">{revealed ? "LOCKED?" : "DECRYPT"}</span>
    </button>
  );
}
