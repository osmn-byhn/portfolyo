import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faGithub,
  faLinkedin,
  faNpm,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import ScpLogo from "./ScpLogo";
import { useTheme } from "../theme";

const NAV_ITEMS = [
  { href: "#hero", label: "Now" },
  { href: "#skills", label: "Craft" },
  { href: "#about", label: "Self" },
  { href: "#projects", label: "Work" },
  { href: "#history", label: "Time" },
  { href: "#contact", label: "Reach" },
];

const SOCIAL = [
  { href: "https://github.com/osmn-byhn", icon: faGithub, label: "GitHub" },
  { href: "https://www.linkedin.com/in/osman-beyhan-12304b23a", icon: faLinkedin, label: "LinkedIn" },
  { href: "mailto:developer@osmanbeyhan.com", icon: faEnvelope, label: "Email" },
  { href: "https://www.npmjs.com/~osmn-byhn", icon: faNpm, label: "npm" },
];

export default function SecureHeader() {
  const [openNav, setOpenNav] = useState(false);
  const { theme, toggleTheme, isLife } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setOpenNav(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMobile = () => setOpenNav(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-scp-border/70 bg-scp-bg/85 backdrop-blur-[6px]">
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 max-w-6xl mx-auto">
        <a href="#hero" className="flex items-center gap-3 min-w-0 text-scp-text" onClick={closeMobile}>
          <ScpLogo size={22} />
          <div className="min-w-0">
            <div className="font-sans text-sm tracking-[0.2em] uppercase truncate">
              Osman Beyhan
            </div>
            <div className="font-serif text-[10px] tracking-[0.35em] text-scp-faint">
              {isLife ? "Life" : "Death"}
            </div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className="scp-nav-item">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={isLife ? "Switch to death theme" : "Switch to life theme"}
            title={isLife ? "Enter death" : "Enter life"}
          >
            <span className="text-scp-faint">{isLife ? "生" : "死"}</span>
            <span>{isLife ? "Life" : "Death"}</span>
            <span className="text-scp-faint hidden sm:inline">→ {isLife ? "Death" : "Life"}</span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {SOCIAL.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={s.label}
                className="text-scp-faint hover:text-scp-text transition-colors duration-300 px-1.5"
              >
                <FontAwesomeIcon icon={s.icon} className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>

          <button
            type="button"
            className="scp-btn lg:hidden !py-1 !px-2"
            aria-expanded={openNav}
            aria-label="Toggle navigation"
            onClick={() => setOpenNav((v) => !v)}
          >
            {openNav ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {openNav && (
        <div className="lg:hidden border-t border-scp-border bg-scp-bg px-4 py-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={closeMobile}
              className="scp-nav-item block"
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            className="theme-toggle w-full justify-center mt-2"
            onClick={toggleTheme}
          >
            {theme === "life" ? "Switch to Death" : "Switch to Life"}
          </button>
          <div className="flex gap-4 pt-3 border-t border-scp-border mt-2">
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
      )}
    </header>
  );
}
