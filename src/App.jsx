import { useState, useEffect, lazy, Suspense } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import NavbarSticky from "./components/NavbarSticky";
import ScpLogo from "./components/ScpLogo";
import TiltCard from "./components/TiltCard";
import CyberField from "./components/CyberField";
import BootOverlay from "./components/BootOverlay";
import DecryptText from "./components/DecryptText";
import {
  StatusIndicator,
  MetadataRow,
  SectionHeader,
  TerminalPanel,
  TelemetryBar,
} from "./components/ui";
import { history, skillsConfig } from "./data";

const Background3D = lazy(() => import("./components/Background3D"));

/* ─────────────────── helpers ─────────────────── */
const GITHUB_USER = "osmn-byhn";
const AVATAR_URL = "https://avatars.githubusercontent.com/u/104824448?v=4";

const TAG_COLORS = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Rust: "#dea584",
  Go: "#00ADD8",
};

function langColor(lang) {
  return TAG_COLORS[lang] || "#6e7681";
}

function TopicPill({ topic }) {
  return (
    <span className="inline-block px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] bg-scp-surface-3 text-scp-muted border border-scp-border">
      {topic}
    </span>
  );
}

function RepoCard({ repo, languages, index = 0 }) {
  const totalBytes = languages
    ? Object.values(languages).reduce((a, b) => a + b, 0)
    : 0;
  const recordId = `#X-${String(repo.id).slice(-4).padStart(4, "0")}`;

  return (
    <motion.div
      className="scp-tilt-scene h-full"
      initial={{ opacity: 0, y: 16, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3), ease: "easeOut" }}
    >
      <TiltCard className="h-full" intensity={6}>
        <article className="scp-panel-3d group flex flex-col h-full bg-scp-surface border border-scp-border shadow-scp hover:border-scp-primary/50 transition-colors duration-150">
          <div className="flex items-center justify-between gap-2 px-3 py-1.5 border-b border-scp-border bg-scp-surface-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-mono text-[10px] text-scp-primary tracking-wider shrink-0">
                {recordId}
              </span>
              <StatusIndicator
                status={repo.archived ? "locked" : "active"}
                label={repo.archived ? "LOCKED" : "ACTIVE"}
              />
            </div>
            <span className="font-mono text-[10px] text-scp-faint">
              [{String(index + 1).padStart(2, "0")}]
            </span>
          </div>

          <div className="flex items-start gap-3 px-3 pt-3 pb-2">
            <img
              className="h-8 w-8 border border-scp-border object-cover shrink-0"
              src={AVATAR_URL}
              alt=""
            />
            <div className="flex-1 min-w-0">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-mono text-xs text-scp-text group-hover:text-white transition-colors truncate"
              >
                <span className="text-scp-faint">{GITHUB_USER}/</span>
                {repo.name}
              </a>
              {repo.description && (
                <p className="text-[11px] text-scp-muted mt-1 line-clamp-2 leading-relaxed">
                  {repo.description}
                </p>
              )}
            </div>
          </div>

          {repo.topics && repo.topics.length > 0 && (
            <div className="flex flex-wrap gap-1 px-3 pb-2">
              {repo.topics
                .filter(
                  (t) =>
                    !["project-completed", "library", "app", "tool"].includes(t),
                )
                .slice(0, 5)
                .map((t) => (
                  <TopicPill key={t} topic={t} />
                ))}
            </div>
          )}

          <div className="grid grid-cols-4 gap-1 px-3 py-2 border-t border-scp-border font-mono text-[10px] text-scp-muted">
            <span title="Stars">★ {repo.stargazers_count}</span>
            <span title="Forks">⑂ {repo.forks_count}</span>
            <span title="Issues">! {repo.open_issues_count}</span>
            <span title="Watchers">◎ {repo.watchers}</span>
          </div>

          {languages && totalBytes > 0 && (
            <div className="px-3 pb-3">
              <div className="flex overflow-hidden h-1 w-full mb-2 border border-scp-border">
                {Object.entries(languages).map(([lang, bytes]) => (
                  <div
                    key={lang}
                    style={{
                      width: `${(bytes / totalBytes) * 100}%`,
                      background: langColor(lang),
                    }}
                    title={lang}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {Object.entries(languages)
                  .slice(0, 4)
                  .map(([lang, bytes]) => (
                    <span
                      key={lang}
                      className="flex items-center gap-1 font-mono text-[9px] text-scp-muted uppercase"
                    >
                      <span
                        className="inline-block h-1.5 w-1.5"
                        style={{ background: langColor(lang) }}
                      />
                      {lang}
                      <span className="text-scp-faint">
                        {Math.round((bytes / totalBytes) * 100)}%
                      </span>
                    </span>
                  ))}
              </div>
            </div>
          )}

          <div className="mt-auto flex items-center justify-between px-3 py-2 border-t border-scp-border bg-scp-bg/40">
            {repo.homepage ? (
              <a
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="scp-btn-ghost !px-2 !py-1"
              >
                View Deploy
              </a>
            ) : (
              <span className="scp-meta">NO DEPLOY</span>
            )}
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="scp-btn !px-2 !py-1"
            >
              View Record
            </a>
          </div>
        </article>
      </TiltCard>
    </motion.div>
  );
}

function SideRail({ repoCount }) {
  return (
    <aside className="hidden xl:flex flex-col w-56 shrink-0 border-r border-scp-border bg-scp-surface/80 sticky top-[76px] h-[calc(100vh-76px)] overflow-y-auto">
      <div className="p-3 border-b border-scp-border">
        <p className="scp-label mb-3">Site Navigation</p>
        <nav className="flex flex-col gap-0.5">
          {[
            { href: "#hero", label: "Overview" },
            { href: "#skills", label: "Capabilities" },
            { href: "#about", label: "Personnel" },
          ].map((item) => (
            <a key={item.href} href={item.href} className="scp-nav-item">
              <span className="text-scp-primary">■</span>
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="p-3 border-b border-scp-border">
        <p className="scp-label mb-2">Database</p>
        <nav className="flex flex-col gap-0.5">
          {[
            { href: "#libraries", label: "Libraries" },
            { href: "#apps", label: "Applications" },
            { href: "#tools", label: "Tools" },
          ].map((item) => (
            <a key={item.href} href={item.href} className="scp-nav-item">
              <span className="text-scp-faint">├</span>
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="p-3 border-b border-scp-border">
        <p className="scp-label mb-2">Operations</p>
        <nav className="flex flex-col gap-0.5">
          {[
            { href: "#history", label: "Access Log" },
            { href: "#contact", label: "Comms Channel" },
          ].map((item) => (
            <a key={item.href} href={item.href} className="scp-nav-item">
              <span className="text-scp-faint">└</span>
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-3 space-y-3">
        <div>
          <p className="scp-label mb-1">System Status</p>
          <StatusIndicator status="operational" />
        </div>
        <MetadataRow label="Node" value="TR-01" />
        <MetadataRow label="Records" value={String(repoCount).padStart(3, "0")} />
        <MetadataRow label="Protocol" value="HTTPS/TLS" />
        <p className="scp-label pt-2 border-t border-scp-border">
          Authorized Personnel Only
        </p>
      </div>
    </aside>
  );
}

function App() {
  const envData = import.meta.env;
  const token = envData.VITE_REACT_APP_TOKEN;

  const [allRepos, setAllRepos] = useState([]);
  const [languageMap, setLanguageMap] = useState({});
  const [activeSkillTab, setActiveSkillTab] = useState("Frontend");
  const [systemCheck, setSystemCheck] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
    newsletter: false,
  });
  const [formStatus, setFormStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("sending");
    const { firstName, lastName, email, message } = formData;
    const requestData = {
      email: envData.VITE_REACT_APP_MAIL,
      password: envData.VITE_REACT_APP_MAIL_PASSWORD,
      to: envData.VITE_REACT_APP_MAILTO,
      subject: `Message from ${firstName} ${lastName}, ${email}`,
      text: message,
      service: "gmail",
    };
    try {
      const response = await fetch(
        "https://mail-send-api2.onrender.com/send-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        },
      );
      setFormStatus(response.ok ? "ok" : "error");
    } catch {
      setFormStatus("error");
    }
  };

  useEffect(() => {
    setSystemCheck(
      new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC",
    );
  }, []);

  useEffect(() => {
    const config = { headers: { Authorization: `token ${token}` } };

    axios
      .get(
        `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`,
        config,
      )
      .then((res) => {
        const relevant = res.data.filter(
          (r) =>
            r.topics.includes("project-completed") ||
            r.topics.includes("library") ||
            r.topics.includes("app") ||
            r.topics.includes("tool"),
        );
        setAllRepos(relevant);

        const nonDocs = relevant.filter(
          (r) =>
            r.topics.includes("library") ||
            r.topics.includes("app") ||
            r.topics.includes("tool") ||
            r.topics.includes("project-completed"),
        );
        Promise.all(
          nonDocs.map((repo) =>
            axios
              .get(repo.languages_url, config)
              .then((r) => ({ id: repo.id, langs: r.data })),
          ),
        ).then((results) => {
          const map = {};
          results.forEach(({ id, langs }) => {
            map[id] = langs;
          });
          setLanguageMap(map);
        });
      })
      .catch((err) => console.error(err));
  }, [token]);

  const projects = allRepos.filter(
    (r) =>
      r.topics.includes("project-completed") &&
      !r.topics.includes("library") &&
      !r.topics.includes("app") &&
      !r.topics.includes("tool"),
  );
  const libraries = allRepos.filter((r) => r.topics.includes("library"));
  const apps = allRepos.filter((r) => r.topics.includes("app"));
  const tools = allRepos.filter((r) => r.topics.includes("tool"));

  const date = new Date();
  const year = date.getFullYear();
  const yearsCoding = year - 2018;
  const age = year - 2004;

  const activeSkill =
    skillsConfig.find((s) => s.label === activeSkillTab) || skillsConfig[0];

  const terminalLines = [
    { text: "initializing secure connection..." },
    { text: "authenticating visitor session..." },
    { text: "clearance verified — public dossier access" },
    { text: "loading personnel modules..." },
    { text: "connection established", ok: true },
    { text: "[OK] DATABASE", ok: true, prefix: " " },
    { text: "[OK] GITHUB API", ok: true, prefix: " " },
    { text: "[OK] COMMS CHANNEL", ok: true, prefix: " " },
  ];

  return (
    <div className="scp-atmosphere min-h-screen">
      <BootOverlay />
      <Suspense fallback={null}>
        <Background3D />
      </Suspense>
      <CyberField />
      <div className="scp-scanlines" aria-hidden="true" />
      <div className="scp-content">
        <NavbarSticky />

        <div className="flex pt-[52px] sm:pt-[76px]">
          <SideRail repoCount={allRepos.length} />

          <main className="flex-1 min-w-0">
            {/* ── OVERVIEW / HERO ── */}
            <section id="hero" className="short-about border-b border-scp-border">
              <motion.div
                className="image relative"
                title="Click seal to run biometric scan"
                initial={{ opacity: 0, scale: 0.88, rotateY: -18 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <ScpLogo size={188} className="mx-auto" />
              </motion.div>

              <div className="welcome space-y-4">
                <motion.div
                  className="flex flex-wrap items-center gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                >
                  <span className="scp-label text-scp-primary">
                    {"// Secure Operations Console"}
                  </span>
                  <StatusIndicator status="operational" label="All Systems Operational" />
                </motion.div>

                <TelemetryBar
                  items={[
                    { id: "API", label: "GitHub Link", ok: true },
                    { id: "AUTH", label: "Clearance", ok: true },
                    { id: "DB", label: "Records", ok: allRepos.length > 0 },
                    { id: "NET", label: "Secure", ok: true },
                  ]}
                />

                <motion.div
                  className="scp-tilt-scene"
                  initial={{ opacity: 0, y: 18, rotateX: 10 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.25, duration: 0.55, ease: "easeOut" }}
                >
                  <TiltCard intensity={5}>
                    <div className="scp-panel-3d border border-scp-border bg-scp-surface p-4 shadow-scp relative overflow-hidden">
                      <div className="panel-cyber-scan" aria-hidden="true" />
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-scp-border">
                        <span className="scp-label">Personnel Dossier</span>
                        <DecryptText
                          text="DOC-ID: DEV-OB-01"
                          lockedLabel="DOC-ID: ████████"
                          className="!inline-flex"
                        />
                      </div>

                      <p className="scp-label mb-1">Identification</p>
                      <h1 className="font-sans text-3xl sm:text-4xl font-semibold tracking-tight text-scp-text mb-1">
                        Osman Beyhan
                      </h1>
                      <p className="font-mono text-xs uppercase tracking-[0.14em] text-scp-muted mb-4">
                        Full-Stack & Cross-Platform Developer
                      </p>

                      <p className="text-sm text-scp-muted leading-relaxed mb-4 max-w-xl">
                        Builds databases with{" "}
                        <span className="text-scp-text font-medium">MongoDB</span>,
                        routes with{" "}
                        <span className="text-scp-text font-medium">ExpressJS</span>,
                        designs front-ends with{" "}
                        <span className="text-scp-text font-medium">React</span>, and
                        ties them together with{" "}
                        <span className="text-scp-text font-medium">NodeJS</span>.
                      </p>

                      <div className="grid sm:grid-cols-2 gap-2 mb-4">
                        <MetadataRow label="Last Check" value={systemCheck || "—"} />
                        <MetadataRow
                          label="Active Records"
                          value={String(allRepos.length).padStart(2, "0")}
                        />
                        <div className="flex items-baseline gap-3 font-mono text-[11px]">
                          <span className="text-scp-faint uppercase tracking-[0.12em] shrink-0 min-w-[7rem]">
                            Clearance
                          </span>
                          <DecryptText text="LEVEL 04" lockedLabel="LEVEL ██" />
                        </div>
                        <MetadataRow label="Site" value="TR / PUBLIC" />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <a href="#projects" className="scp-btn-primary">
                          [ View Records ]
                        </a>
                        <a href="#contact" className="scp-btn">
                          [ Open Comms ]
                        </a>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>

                <motion.div
                  className="hidden sm:block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55, duration: 0.5 }}
                >
                  <TerminalPanel lines={terminalLines} />
                </motion.div>
              </div>
            </section>

            {/* ── CAPABILITIES ── */}
            <section className="py-16 max-w-[90%] mx-auto px-4" id="skills">
              <SectionHeader
                id="skills"
                code="SEC/CAPABILITIES"
                title="Technical Capabilities Matrix"
                count={skillsConfig.length}
                countLabel="DIVISIONS"
              />

              <div className="flex flex-wrap gap-1 mb-4">
                {skillsConfig.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setActiveSkillTab(s.label)}
                    className={`scp-nav-item ${
                      activeSkillTab === s.label ? "scp-nav-item-active" : ""
                    }`}
                  >
                    <span className="text-scp-faint mr-1">{s.code}</span>
                    {s.label}
                    <span className="text-scp-faint ml-1">
                      {String(s.skills.length).padStart(2, "0")}
                    </span>
                  </button>
                ))}
              </div>

              <div className="scp-panel overflow-hidden relative">
                <div className="panel-cyber-scan" aria-hidden="true" />
                <div className="scp-panel-header">
                  <span className="scp-label">
                    Module // {activeSkill.code}-{activeSkillTab.toUpperCase()}
                  </span>
                  <span className="scp-meta">
                    {String(activeSkill.skills.length).padStart(2, "0")} /{" "}
                    {String(
                      skillsConfig.reduce((n, s) => n + s.skills.length, 0),
                    ).padStart(2, "0")}{" "}
                    PROTOCOLS
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="skills-matrix w-full text-left">
                    <thead>
                      <tr className="border-b border-scp-border bg-scp-surface-2">
                        <th className="scp-label px-3 py-2 font-medium w-16">ID</th>
                        <th className="scp-label px-3 py-2 font-medium">Protocol</th>
                        <th className="scp-label px-3 py-2 font-medium hidden sm:table-cell">
                          Division
                        </th>
                        <th className="scp-label px-3 py-2 font-medium w-28">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeSkill.skills.map((skill, i) => (
                        <tr
                          key={`${activeSkill.label}-${skill}-${i}`}
                          className="skills-matrix-row border-b border-scp-border/80 bg-scp-surface hover:bg-scp-surface-3 transition-colors group"
                        >
                          <td className="px-3 py-2.5 font-mono text-[11px] text-scp-primary whitespace-nowrap">
                            {activeSkill.code}-{String(i + 1).padStart(2, "0")}
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-2">
                              <span className="skills-signal" aria-hidden="true" />
                              <span className="font-mono text-xs uppercase tracking-[0.08em] text-scp-text group-hover:text-white transition-colors">
                                {skill}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 hidden sm:table-cell">
                            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-scp-muted">
                              {activeSkill.label}
                            </span>
                          </td>
                          <td className="px-3 py-2.5">
                            <StatusIndicator status="active" label="Cleared" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ── PERSONNEL ── */}
            <section
              id="about"
              className="py-16 lg:max-w-[90%] lg:mx-auto px-4"
            >
              <SectionHeader
                id="about"
                code="SEC/PERSONNEL"
                title="Personnel File"
              />

              <div className="lg:flex lg:gap-8">
                <div className="flex-shrink-0 mb-6 lg:mb-0">
                  <div className="scp-panel overflow-hidden max-w-xs">
                    <div className="scp-panel-header">
                      <span className="scp-label">Visual Record</span>
                      <span className="scp-meta">CLASSIFIED</span>
                    </div>
                    <img
                      src="https://i.pinimg.com/originals/51/8a/fb/518afb1d1cdc07eb7d2b1729f03fe91e.gif"
                      alt="coding gif"
                      className="w-full border-t border-scp-border"
                    />
                    <div className="p-2 border-t border-scp-border scp-meta text-center">
                      REVISION · AUTHORIZED VIEW
                    </div>
                  </div>
                </div>

                <div className="flex-1 scp-panel">
                  <div className="scp-panel-header">
                    <span className="scp-label">Subject Briefing</span>
                    <StatusIndicator status="active" label="Cleared" />
                  </div>
                  <div className="p-4 space-y-4 text-sm text-scp-muted leading-relaxed">
                    <MetadataRow label="Codename" value="Osman" />
                    <MetadataRow label="Origin" value="Turkey" />
                    <MetadataRow
                      label="Experience"
                      value={`${yearsCoding} years`}
                    />
                    <MetadataRow label="Age Class" value={`${age} years`} />

                    <div className="border-t border-scp-border pt-4 space-y-3">
                      <p>
                        Web developer based in Turkey. Creates software systems
                        and has been coding for{" "}
                        <span className="text-scp-text">{yearsCoding} years</span>
                        . Subject is{" "}
                        <span className="text-scp-text">{age} years old</span>{" "}
                        — early-career operator with continued clearance for
                        training.
                      </p>
                      <p>
                        Demonstrates rapid acquisition of technical protocols.
                        Operating philosophy:{" "}
                        <em className="text-scp-text not-italic font-mono text-xs">
                          &quot;Learn and teach what you have learned.&quot;
                        </em>
                      </p>
                      <p>
                        Continues knowledge transfer operations under directive:{" "}
                        <em className="text-scp-text not-italic font-mono text-xs">
                          &quot;The fastest way to learn is to teach.&quot;
                        </em>
                      </p>
                    </div>

                    <div className="border border-scp-border bg-scp-bg p-3 font-mono text-[10px] text-scp-faint uppercase tracking-wider">
                      <div>Document ID: ██████████ · Partial Redaction</div>
                      <div className="mt-1 text-scp-muted">
                        Security Level: Level 04 · Authorized Personnel Only
                      </div>
                      <div className="mt-2 text-scp-text/40">
                        ████████████████████ · Non-sensitive fields displayed
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── PROJECTS ANCHOR ── */}
            <div id="projects" className="pt-8 pb-2 lg:max-w-[90%] lg:mx-auto px-4">
              <div className="border border-scp-border bg-scp-surface-2 px-3 py-2 flex flex-wrap items-center justify-between gap-2">
                <span className="scp-label text-scp-primary">
                  Database // Containment Records
                </span>
                <span className="scp-meta">
                  {String(allRepos.length).padStart(2, "0")} TOTAL ENTRIES
                </span>
              </div>
            </div>

            {/* ── LIBRARIES ── */}
            {libraries.length > 0 && (
              <section
                id="libraries"
                className="py-12 lg:max-w-[90%] lg:mx-auto px-4"
              >
                <SectionHeader
                  id="libraries"
                  code="DB/LIBRARIES"
                  title="Library Containment Unit"
                  count={libraries.length}
                />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                  {libraries.map((repo, i) => (
                    <RepoCard
                      key={repo.id}
                      repo={repo}
                      languages={languageMap[repo.id]}
                      index={i}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ── APPS ── */}
            {apps.length > 0 && (
              <section
                id="apps"
                className="py-12 lg:max-w-[90%] lg:mx-auto px-4"
              >
                <SectionHeader
                  id="apps"
                  code="DB/APPLICATIONS"
                  title="Application Records"
                  count={apps.length}
                />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                  {apps.map((repo, i) => (
                    <RepoCard
                      key={repo.id}
                      repo={repo}
                      languages={languageMap[repo.id]}
                      index={i}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ── TOOLS ── */}
            {tools.length > 0 && (
              <section
                id="tools"
                className="py-12 lg:max-w-[90%] lg:mx-auto px-4"
              >
                <SectionHeader
                  id="tools"
                  code="DB/TOOLS"
                  title="Utility Protocol Tools"
                  count={tools.length}
                />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                  {tools.map((repo, i) => (
                    <RepoCard
                      key={repo.id}
                      repo={repo}
                      languages={languageMap[repo.id]}
                      index={i}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* orphan project-completed without other tags */}
            {projects.length > 0 && (
              <section className="py-12 lg:max-w-[90%] lg:mx-auto px-4">
                <SectionHeader
                  id="completed"
                  code="DB/COMPLETED"
                  title="Completed Operations"
                  count={projects.length}
                />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                  {projects.map((repo, i) => (
                    <RepoCard
                      key={repo.id}
                      repo={repo}
                      languages={languageMap[repo.id]}
                      index={i}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ── HISTORY / ACCESS LOG ── */}
            <section id="history" className="py-16 bg-scp-bg/60 border-y border-scp-border">
              <div className="lg:max-w-[90%] lg:mx-auto px-4 mb-10">
                <SectionHeader
                  id="history"
                  code="OPS/ACCESS-LOG"
                  title="Chronological Access Log"
                  count={history.length}
                  countLabel="EVENTS"
                />
              </div>

              <div className="lg:max-w-[90%] lg:mx-auto px-4 lg:flex lg:gap-10">
                <div className="lg:w-1/3 mb-8 lg:mb-0">
                  <p className="scp-label text-scp-primary mb-2">
                    Operations Timeline
                  </p>
                  <h3 className="font-mono text-lg uppercase tracking-wide text-scp-text mb-2">
                    Working Process
                  </h3>
                  <p className="text-sm text-scp-muted mb-4">
                    Learning and deployment chronology, ordered by event date.
                  </p>
                  <div className="scp-panel p-3 space-y-2">
                    <MetadataRow label="Entries" value={String(history.length).padStart(2, "0")} />
                    <MetadataRow label="Range" value="2018 — Present" />
                    <MetadataRow label="Status" value="Ongoing" />
                  </div>
                </div>

                <div className="lg:w-2/3 overflow-x-auto">
                  <table className="w-full min-w-[520px] border border-scp-border text-left">
                    <thead>
                      <tr className="bg-scp-surface-2 border-b border-scp-border">
                        <th className="scp-label px-3 py-2 font-medium">ID</th>
                        <th className="scp-label px-3 py-2 font-medium">Date</th>
                        <th className="scp-label px-3 py-2 font-medium">
                          Event
                        </th>
                        <th className="scp-label px-3 py-2 font-medium">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b border-scp-border bg-scp-surface hover:bg-scp-surface-3 transition-colors"
                        >
                          <td className="px-3 py-2.5 font-mono text-[11px] text-scp-primary whitespace-nowrap">
                            #L-{String(index + 1).padStart(3, "0")}
                          </td>
                          <td className="px-3 py-2.5 font-mono text-[11px] text-scp-muted whitespace-nowrap">
                            {item.date}
                          </td>
                          <td className="px-3 py-2.5 font-mono text-xs text-scp-text uppercase tracking-wide">
                            {item.title}
                          </td>
                          <td className="px-3 py-2.5 text-[11px] text-scp-muted leading-relaxed max-w-md">
                            {item.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ── CONTACT / COMMS ── */}
            <section id="contact" className="max-w-screen-md mx-auto p-5 py-16">
              <div className="text-center mb-8">
                <p className="scp-label text-scp-primary mb-2">
                  Secure Communications
                </p>
                <h3 className="font-mono text-xl uppercase tracking-[0.08em] text-scp-text">
                  Authorization Required
                </h3>
                <p className="scp-meta mt-2">
                  Transmit a message through the encrypted contact channel
                </p>
              </div>

              <form
                className="scp-panel overflow-hidden"
                onSubmit={handleSubmit}
              >
                <div className="scp-panel-header">
                  <span className="scp-label">Comms Terminal // Contact</span>
                  <span className="scp-meta">Connection: Encrypted</span>
                </div>

                <div className="p-4 sm:p-6 space-y-4 bg-scp-bg/40">
                  <div className="flex gap-3 flex-col md:flex-row">
                    <div className="flex-1">
                      <label
                        className="scp-label block mb-1.5"
                        htmlFor="firstName"
                      >
                        Identification / First
                      </label>
                      <input
                        className="scp-input"
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="JANE"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label
                        className="scp-label block mb-1.5"
                        htmlFor="lastName"
                      >
                        Identification / Last
                      </label>
                      <input
                        className="scp-input"
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="DOE"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="scp-label block mb-1.5" htmlFor="email">
                      Return Channel / Email
                    </label>
                    <input
                      className="scp-input"
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@facility.example"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="scp-label block mb-1.5" htmlFor="message">
                      Transmission Content
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      className="scp-input resize-y"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-scp-border">
                    <label className="flex items-center gap-2 text-xs font-mono text-scp-muted cursor-pointer select-none">
                      <input
                        className="accent-[#9f1d20]"
                        type="checkbox"
                        name="newsletter"
                        checked={formData.newsletter}
                        onChange={handleChange}
                      />
                      Subscribe to bulletin feed
                    </label>

                    <button
                      className={
                        formStatus === "ok"
                          ? "scp-btn border-scp-success/50 text-scp-success"
                          : formStatus === "error"
                            ? "scp-btn border-scp-danger/50 text-scp-danger"
                            : "scp-btn-primary"
                      }
                      type="submit"
                      disabled={formStatus === "sending"}
                    >
                      {formStatus === "sending"
                        ? "[ Transmitting… ]"
                        : formStatus === "ok"
                          ? "[ Transmission OK ]"
                          : formStatus === "error"
                            ? "[ Retry Transmit ]"
                            : "[ Authenticate & Send ]"}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-1">
                    <span className="scp-meta">
                      Security Level: <span className="text-scp-text">██</span>
                    </span>
                    <span className="scp-meta">Protocol: SMTP Relay</span>
                  </div>
                </div>
              </form>
            </section>

            {/* ── FOOTER ── */}
            <footer className="border-t border-scp-border bg-scp-surface py-6">
              <div className="max-w-[90%] mx-auto px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-scp-muted">
                    © {year} Osman Beyhan · Personnel File DEV-OB-01
                  </p>
                  <p className="scp-label mt-1">
                    Authorized Personnel Only · Secure Connection
                  </p>
                </div>
                <StatusIndicator status="operational" label="Site Online" />
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
