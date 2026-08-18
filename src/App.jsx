import { useState, useEffect } from "react";
import axios from "axios";
import NavbarSticky from "./components/NavbarSticky";
import {
  StatusIndicator,
  MetadataRow,
  SectionHeader,
} from "./components/ui";
import { history, skillsConfig } from "./data";
import { useTheme } from "./theme";
import LivedTime, { useLivedTime } from "./components/LivedTime";
import LifeProjectsChart from "./components/LifeProjectsChart";

/* ─────────────────── helpers ─────────────────── */
const GITHUB_USER = "osmn-byhn";
const AVATAR_URL = "https://avatars.githubusercontent.com/u/104824448?v=4";

const TAG_COLORS = {
  JavaScript: "#9a9a9a",
  TypeScript: "#b0b0b0",
  Python: "#8a8a8a",
  HTML: "#a8a8a8",
  CSS: "#7a7a7a",
  Shell: "#909090",
  Rust: "#b8b8b8",
  Go: "#858585",
};

function langColor(lang) {
  return TAG_COLORS[lang] || "#6e6e6e";
}

function TopicPill({ topic }) {
  return (
    <span className="inline-block px-1.5 py-0.5 font-sans text-[9px] uppercase tracking-[0.14em] text-scp-muted border border-scp-border">
      {topic}
    </span>
  );
}

function RepoCard({ repo, languages, index = 0 }) {
  const totalBytes = languages
    ? Object.values(languages).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <article className="group flex flex-col h-full border border-scp-border bg-scp-surface/40 hover:bg-scp-surface transition-colors duration-300">
      <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-scp-border">
        <StatusIndicator
          status={repo.archived ? "locked" : "active"}
          label={repo.archived ? "Archived" : "Living"}
        />
        <span className="font-mono text-[10px] text-scp-faint">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex items-start gap-3 px-4 pt-4 pb-2">
        <img
          className="h-8 w-8 object-cover shrink-0 grayscale opacity-80"
          src={AVATAR_URL}
          alt=""
        />
        <div className="flex-1 min-w-0">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block font-sans text-base tracking-wide text-scp-text hover:opacity-70 transition-opacity truncate"
          >
            {repo.name}
          </a>
          {repo.description && (
            <p className="text-[13px] text-scp-muted mt-1.5 line-clamp-2 leading-relaxed">
              {repo.description}
            </p>
          )}
        </div>
      </div>

      {repo.topics && repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1 px-4 pb-3">
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

      <div className="grid grid-cols-4 gap-1 px-4 py-2 border-t border-scp-border font-mono text-[10px] text-scp-muted">
        <span title="Stars">★ {repo.stargazers_count}</span>
        <span title="Forks">⑂ {repo.forks_count}</span>
        <span title="Issues">! {repo.open_issues_count}</span>
        <span title="Watchers">◎ {repo.watchers}</span>
      </div>

      {languages && totalBytes > 0 && (
        <div className="px-4 pb-3">
          <div className="flex overflow-hidden h-px w-full mb-2 bg-scp-border">
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
                  className="font-mono text-[9px] text-scp-muted uppercase"
                >
                  {lang}{" "}
                  <span className="text-scp-faint">
                    {Math.round((bytes / totalBytes) * 100)}%
                  </span>
                </span>
              ))}
          </div>
        </div>
      )}

      <div className="mt-auto flex items-center justify-between px-4 py-2.5 border-t border-scp-border">
        {repo.homepage ? (
          <a
            href={repo.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="scp-btn-ghost !px-0"
          >
            Live
          </a>
        ) : (
          <span className="scp-meta">—</span>
        )}
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="scp-btn-ghost !px-0"
        >
          Open
        </a>
      </div>
    </article>
  );
}

function App() {
  const envData = import.meta.env;
  const token = envData.VITE_REACT_APP_TOKEN;

  const [allRepos, setAllRepos] = useState([]);
  const [languageMap, setLanguageMap] = useState({});
  const [activeSkillTab, setActiveSkillTab] = useState("Frontend");

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
  const lived = useLivedTime();
  const age = lived.years;

  const activeSkill =
    skillsConfig.find((s) => s.label === activeSkillTab) || skillsConfig[0];

  const { isLife } = useTheme();

  return (
    <div className="scp-atmosphere min-h-screen">
      <div className="scp-content">
        <NavbarSticky />

        <main>
          {/* ── HERO ── */}
          <section id="hero" className="hero-still">
            <span className="hero-still__mark" aria-hidden="true">
              {isLife ? "生" : "死"}
            </span>
            <div className="hero-still__body">
              <p className="font-sans text-[11px] uppercase tracking-[0.4em] text-scp-muted mb-5">
                {isLife ? "Life · Presence · Making" : "Death · Silence · Remembrance"}
              </p>
              <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl font-light tracking-[0.14em] uppercase text-scp-text mb-4">
                Osman Beyhan
              </h1>
              <LivedTime lived={lived} className="mb-6" />
              <p className="text-base sm:text-[17px] text-scp-muted max-w-md leading-relaxed mb-9">
                {isLife
                  ? "I build while the light holds — careful systems for living time."
                  : "I build knowing it ends — careful systems for the time that remains."}
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#projects" className="scp-btn-primary">
                  {isLife ? "See the work" : "What remains"}
                </a>
                <a href="#contact" className="scp-btn">
                  {isLife ? "Say hello" : "Leave a word"}
                </a>
              </div>
            </div>
          </section>

          <div className="max-w-6xl mx-auto">
            {/* ── CRAFT ── */}
            <section className="py-24 px-4 sm:px-6" id="skills">
              <SectionHeader
                id="skills"
                code="What remains in the hands"
                title="Craft"
                count={skillsConfig.length}
                countLabel="fields"
              />

              <div className="flex flex-wrap gap-1 mb-8">
                {skillsConfig.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setActiveSkillTab(s.label)}
                    className={`scp-nav-item ${
                      activeSkillTab === s.label ? "scp-nav-item-active" : ""
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="border border-scp-border">
                <div className="scp-panel-header">
                  <span className="scp-label">{activeSkillTab}</span>
                  <span className="scp-meta">
                    {String(activeSkill.skills.length).padStart(2, "0")} tools
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="skills-matrix w-full text-left">
                    <thead>
                      <tr className="border-b border-scp-border">
                        <th className="scp-label px-4 py-3 font-normal w-16">#</th>
                        <th className="scp-label px-4 py-3 font-normal">Name</th>
                        <th className="scp-label px-4 py-3 font-normal hidden sm:table-cell">
                          Field
                        </th>
                        <th className="scp-label px-4 py-3 font-normal w-28">State</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeSkill.skills.map((skill, i) => (
                        <tr
                          key={`${activeSkill.label}-${skill}-${i}`}
                          className="skills-matrix-row border-b border-scp-border/70 group"
                        >
                          <td className="px-4 py-3.5 font-mono text-[11px] text-scp-faint whitespace-nowrap">
                            {String(i + 1).padStart(2, "0")}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <span className="skills-signal" aria-hidden="true" />
                              <span className="font-sans text-sm text-scp-text">
                                {skill}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 hidden sm:table-cell">
                            <span className="font-sans text-[10px] uppercase tracking-[0.16em] text-scp-muted">
                              {activeSkill.label}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <StatusIndicator status="active" label="In use" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ── SELF ── */}
            <section id="about" className="py-24 px-4 sm:px-6">
              <SectionHeader id="about" code="A brief while" title="Self" />

              <div className="max-w-2xl space-y-6 text-scp-muted leading-relaxed text-[15px]">
                <p className="font-sans text-2xl font-light text-scp-text tracking-wide">
                  Hello.
                </p>
                <p>
                  My name is{" "}
                  <span className="text-scp-text">Osman</span>. I live in Turkey
                  and write software. I have been coding for{" "}
                  <span className="text-scp-text">{yearsCoding} years</span>. I
                  am <span className="text-scp-text">{age}</span> — young enough
                  to keep learning, old enough to know time is not infinite.
                </p>
                <p>
                  Curiosity keeps me present in the work. I return often to:{" "}
                  <span className="text-scp-text font-serif">
                    Learn, then teach what you have learned.
                  </span>
                </p>
                <p>
                  And:{" "}
                  <span className="text-scp-text font-serif">
                    The fastest way to learn is to teach.
                  </span>
                </p>
                  <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-scp-faint pt-6 border-t border-scp-border">
                    {isLife
                      ? "Amor fati · Keep building · Stay soft"
                      : "Memento mori · Keep building · Stay soft"}
                  </p>
              </div>

              {allRepos.length > 0 && (
                <div className="mt-16 max-w-4xl">
                  <LifeProjectsChart repos={allRepos} />
                </div>
              )}
            </section>

            {/* ── WORK ── */}
            <div id="projects" className="px-4 sm:px-6 pt-8">
              <SectionHeader
                id="projects"
                code="What I leave behind"
                title="Work"
                count={allRepos.length}
                countLabel="pieces"
              />
            </div>

            {libraries.length > 0 && (
              <section
                id="libraries"
                className="py-12 px-4 sm:px-6"
              >
                <SectionHeader
                  id="libraries"
                  code="Shared tools"
                  title="Libraries"
                  count={libraries.length}
                />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

            {apps.length > 0 && (
              <section
                id="apps"
                className="py-12 px-4 sm:px-6"
              >
                <SectionHeader
                  id="apps"
                  code="Living systems"
                  title="Apps"
                  count={apps.length}
                />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

            {tools.length > 0 && (
              <section
                id="tools"
                className="py-12 px-4 sm:px-6"
              >
                <SectionHeader
                  id="tools"
                  code="Instruments"
                  title="Tools"
                  count={tools.length}
                />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

            {projects.length > 0 && (
              <section className="py-12 px-4 sm:px-6">
                <SectionHeader
                  id="completed"
                  code="Finished chapters"
                  title="Completed"
                  count={projects.length}
                />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

            {/* ── TIME ── */}
            <section id="history" className="py-24 px-4 sm:px-6 border-y border-scp-border">
              <SectionHeader
                id="history"
                code="What the years kept"
                title="Time"
                count={history.length}
                countLabel="marks"
              />

              <div className="lg:flex lg:gap-16">
                <div className="lg:w-1/3 mb-12 lg:mb-0">
                  <p className="font-sans text-xl font-light text-scp-text mb-3 tracking-wide">
                    A short life of work
                  </p>
                  <p className="text-sm text-scp-muted mb-8 leading-relaxed">
                    Moments that shaped the craft — not victories, just time spent becoming.
                  </p>
                  <div className="space-y-2.5 border-l border-scp-border pl-4">
                    <MetadataRow label="Marks" value={String(history.length).padStart(2, "0")} />
                    <MetadataRow label="Span" value="2018 — now" />
                    <MetadataRow label="State" value="Still here" />
                  </div>
                </div>

                <div className="lg:w-2/3">
                  {history.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[5.5rem_1fr] sm:grid-cols-[6.5rem_1fr] gap-4 py-5 border-b border-scp-border last:border-0"
                    >
                      <div className="font-mono text-[11px] text-scp-muted whitespace-nowrap pt-1">
                        {item.date}
                      </div>
                      <div>
                        <h4 className="font-sans text-base text-scp-text tracking-wide mb-1.5">
                          {item.title}
                        </h4>
                        <p className="text-sm text-scp-muted leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── REACH ── */}
            <section id="contact" className="max-w-lg mx-auto px-4 sm:px-6 py-24">
              <div className="mb-12 text-center">
                <p className="scp-label mb-4">
                  {isLife ? "While the day is open" : "While there is still time"}
                </p>
                <h3 className="font-sans text-3xl sm:text-4xl font-light tracking-[0.1em] text-scp-text mb-4">
                  Reach
                </h3>
                <p className="text-sm text-scp-muted leading-relaxed">
                  {isLife
                    ? "Leave a short word. I am here."
                    : "Leave a short word. I will answer while I can."}
                </p>
              </div>

              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="flex gap-6 flex-col sm:flex-row">
                  <div className="flex-1">
                    <label className="scp-label block mb-2" htmlFor="firstName">
                      First name
                    </label>
                    <input
                      className="scp-input"
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Jane"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="scp-label block mb-2" htmlFor="lastName">
                      Last name
                    </label>
                    <input
                      className="scp-input"
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="scp-label block mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="scp-input"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="scp-label block mb-2" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    className="scp-input resize-none"
                    placeholder="A few lines…"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <label className="flex items-center gap-2 text-xs font-sans tracking-wide text-scp-muted cursor-pointer select-none">
                    <input
                      className="accent-[#f0eeea]"
                      type="checkbox"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleChange}
                    />
                    Occasional notes
                  </label>

                  <button
                    className={
                      formStatus === "ok"
                        ? "scp-btn"
                        : formStatus === "error"
                          ? "scp-btn"
                          : "scp-btn-primary"
                    }
                    type="submit"
                    disabled={formStatus === "sending"}
                  >
                    {formStatus === "sending"
                      ? "Sending…"
                      : formStatus === "ok"
                        ? "Sent"
                        : formStatus === "error"
                          ? "Try again"
                          : "Send"}
                  </button>
                </div>
              </form>
            </section>

            {/* ── FOOTER ── */}
            <footer className="border-t border-scp-border py-12 px-4 sm:px-6 mb-2">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                  <p className="font-sans text-sm tracking-[0.2em] uppercase text-scp-text mb-2">
                    Osman Beyhan
                  </p>
                  <p className="font-serif text-xs tracking-[0.3em] text-scp-faint">
                    © {year} · {isLife ? "生 · Life" : "死 · Death"}
                  </p>
                </div>
                <p className="font-sans text-sm text-scp-muted max-w-xs sm:text-right leading-relaxed">
                  {isLife
                    ? "Everything begins. Until then — build gently."
                    : "Everything ends. Until then — build gently."}
                </p>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
