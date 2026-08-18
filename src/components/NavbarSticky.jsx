import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faGithub,
  faLinkedin,
  faNpm,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { StatusIndicator } from "./ui";

const NAV_ITEMS = [
  { href: "#hero", label: "Overview", group: "SITE" },
  { href: "#skills", label: "Capabilities", group: "SITE" },
  { href: "#about", label: "Personnel", group: "SITE" },
  { href: "#projects", label: "Containment", group: "DATABASE" },
  { href: "#libraries", label: "Libraries", group: "DATABASE" },
  { href: "#apps", label: "Applications", group: "DATABASE" },
  { href: "#tools", label: "Tools", group: "DATABASE" },
  { href: "#history", label: "Access Log", group: "OPERATIONS" },
  { href: "#contact", label: "Comms", group: "OPERATIONS" },
];

const SOCIAL = [
  { href: "https://github.com/osmn-byhn", icon: faGithub, label: "GitHub" },
  { href: "https://www.linkedin.com/in/osman-beyhan-12304b23a", icon: faLinkedin, label: "LinkedIn" },
  { href: "mailto:developer@osmanbeyhan.com", icon: faEnvelope, label: "Email" },
  { href: "https://www.npmjs.com/~osmn-byhn", icon: faNpm, label: "npm" },
];

function getUtcStamp() {
  return new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC";
}

export default function SecureHeader({ activeSection }) {
  const [openNav, setOpenNav] = useState(false);
  const [stamp, setStamp] = useState(getUtcStamp);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setOpenNav(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setStamp(getUtcStamp()), 1000);
    return () => clearInterval(id);
  }, []);

  const closeMobile = () => setOpenNav(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-scp-border bg-scp-bg/95 backdrop-blur-[2px]">
      {/* Status strip */}
      <div className="hidden sm:flex items-center justify-between gap-4 px-3 py-1 border-b border-scp-border bg-scp-surface text-[10px] font-mono uppercase tracking-[0.12em]">
        <div className="flex items-center gap-4 min-w-0">
          <StatusIndicator status="operational" label="System Status" />
          <span className="text-scp-faint hidden md:inline">|</span>
          <span className="text-scp-muted hidden md:inline">Secure Network</span>
          <span className="text-scp-faint hidden lg:inline">|</span>
          <span className="text-scp-muted hidden lg:inline truncate">{stamp}</span>
        </div>
        <div className="flex items-center gap-4 shrink-0 text-scp-muted">
          <span>
            Clearance: <span className="text-scp-text">Level 04</span>
          </span>
          <span className="hidden md:inline">
            Node: <span className="text-scp-text">TR-01</span>
          </span>
        </div>
      </div>

      {/* Main bar */}
      <div className="flex items-center justify-between gap-3 px-3 py-2 bg-scp-surface">
        <a href="#hero" className="flex items-center gap-2.5 min-w-0 group" onClick={closeMobile}>
          <svg
            viewBox="0 0 40 40"
            className="h-7 w-7 shrink-0"
            aria-hidden="true"
          >
            <circle cx="20" cy="20" r="18" fill="#0d0f0f" stroke="#2a2e2e" strokeWidth="1" />
            <circle cx="20" cy="20" r="14" fill="none" stroke="#9f1d20" strokeWidth="1.2" />
            <path d="M20 8 L22.2 20 L20 17.5 L17.8 20 Z" fill="#e6e6e6" />
            <path d="M20 32 L22.2 20 L20 22.5 L17.8 20 Z" fill="#9f1d20" />
            <path d="M32 20 L20 21.8 L22.5 20 L20 18.2 Z" fill="#8a8a8a" />
            <path d="M8 20 L20 21.8 L17.5 20 L20 18.2 Z" fill="#8a8a8a" />
            <circle cx="20" cy="20" r="2.4" fill="#e8e8e8" />
          </svg>
          <div className="min-w-0">
            <div className="font-mono text-xs uppercase tracking-[0.16em] text-scp-text truncate">
              Osman Beyhan
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-scp-muted">
              Personnel File // DEV-OB-01
            </div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV_ITEMS.filter((n) =>
            ["Overview", "Capabilities", "Personnel", "Containment", "Access Log", "Comms"].includes(
              n.label,
            ),
          ).map((item) => {
            const isActive =
              activeSection &&
              item.href.replace("#", "") === activeSection;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`scp-nav-item ${isActive ? "scp-nav-item-active" : ""}`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 border border-scp-border px-2 py-1">
            {SOCIAL.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={s.label}
                className="text-scp-muted hover:text-scp-text transition-colors px-1"
              >
                <FontAwesomeIcon icon={s.icon} className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>

          <button
            type="button"
            className="scp-btn lg:hidden"
            aria-expanded={openNav}
            aria-label="Toggle navigation"
            onClick={() => setOpenNav((v) => !v)}
          >
            {openNav ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {openNav && (
        <div className="lg:hidden border-t border-scp-border bg-scp-surface max-h-[70vh] overflow-y-auto">
          <div className="p-3 grid gap-4 sm:grid-cols-2">
            {["SITE", "DATABASE", "OPERATIONS"].map((group) => (
              <div key={group}>
                <p className="scp-label mb-2 px-1">{group} Navigation</p>
                <div className="flex flex-col gap-0.5 border border-scp-border bg-scp-bg">
                  {NAV_ITEMS.filter((n) => n.group === group).map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={closeMobile}
                      className="scp-nav-item border-0 rounded-none"
                    >
                      <span className="text-scp-primary">■</span>
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between px-3 py-2 border-t border-scp-border">
            <StatusIndicator status="operational" />
            <div className="flex gap-3">
              {SOCIAL.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={s.label}
                  className="text-scp-muted hover:text-scp-text"
                >
                  <FontAwesomeIcon icon={s.icon} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
