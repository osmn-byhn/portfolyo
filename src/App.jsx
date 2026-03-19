import { useState, useEffect } from "react";
import axios from "axios";
import osmanbeyhan from "./assets/osmanbeyhan.jpg";
import NavbarSticky from "./components/NavbarSticky";

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

/* badge-style topic pill */
function TopicPill({ topic }) {
  return (
    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-indigo-300 border border-indigo-500/30">
      {topic}
    </span>
  );
}

/* ─────────────────── repo card ─────────────────── */
function RepoCard({ repo, languages }) {
  const totalBytes = languages
    ? Object.values(languages).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <div className="group relative flex flex-col bg-[#0d1117]/80 border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:shadow-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1">
      {/* card header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-3">
        <img
          className="h-10 w-10 rounded-full ring-2 ring-indigo-500/40"
          src={AVATAR_URL}
          alt="Profile"
        />
        <div className="flex-1 min-w-0">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm font-semibold text-white/80 group-hover:text-indigo-400 transition-colors truncate"
          >
            <span className="text-white/40">{GITHUB_USER} / </span>
            {repo.name}
          </a>
          {repo.description && (
            <p className="text-xs text-white/40 mt-0.5 line-clamp-2">
              {repo.description}
            </p>
          )}
        </div>
      </div>

      {/* topics */}
      {repo.topics && repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1 px-5 pb-3">
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

      {/* stats row */}
      <div className="flex gap-4 px-5 py-3 border-t border-white/5 text-xs text-white/50">
        <span className="flex items-center gap-1">
          <svg
            className="w-3.5 h-3.5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          {repo.stargazers_count}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 5a3 3 0 0 1 6 0c0 1.31-.84 2.42-2 2.83V10h2a7 7 0 0 1 7 7v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1a7 7 0 0 1 7-7h2V7.83A3 3 0 0 1 17 5a3 3 0 1 1-3 3H10a3 3 0 0 1-3-3z" />
          </svg>
          {repo.forks_count}
        </span>
        <span className="flex items-center gap-1">
          <svg
            className="w-3.5 h-3.5 text-red-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
          {repo.open_issues_count} issues
        </span>
        <span className="flex items-center gap-1">
          <svg
            className="w-3.5 h-3.5 text-blue-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
          </svg>
          {repo.watchers}
        </span>
      </div>

      {/* language bar */}
      {languages && totalBytes > 0 && (
        <div className="px-5 pb-4">
          <div className="flex rounded-full overflow-hidden h-1.5 w-full mb-2">
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
                  className="flex items-center gap-1 text-[10px] text-white/50"
                >
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: langColor(lang) }}
                  />
                  {lang}
                  <span className="text-white/30">
                    {Math.round((bytes / totalBytes) * 100)}%
                  </span>
                </span>
              ))}
          </div>
        </div>
      )}

      {/* footer link */}
      <div className="mt-auto flex items-center justify-between px-5 py-3 border-t border-white/5">
        {repo.homepage ? (
          <a
            href={repo.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Website
          </a>
        ) : (
          <span />
        )}
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.015c0 4.419 2.867 8.165 6.839 9.49.5.09.683-.217.683-.483 0-.238-.008-.868-.013-1.703-2.782.606-3.37-1.342-3.37-1.342-.455-1.156-1.11-1.464-1.11-1.464-.907-.621.068-.608.068-.608 1.002.07 1.53 1.03 1.53 1.03.89 1.526 2.34 1.086 2.91.831.092-.646.349-1.086.635-1.336-2.22-.253-4.555-1.112-4.555-4.946 0-1.092.39-1.985 1.029-2.684-.103-.253-.447-1.271.098-2.65 0 0 .84-.27 2.75 1.025A9.514 9.514 0 0112 6.844c.852.004 1.708.115 2.51.337 1.91-1.295 2.75-1.025 2.75-1.025.546 1.379.202 2.397.1 2.65.64.699 1.029 1.592 1.029 2.684 0 3.844-2.338 4.69-4.566 4.938.359.309.679.919.679 1.853 0 1.338-.012 2.42-.012 2.75 0 .268.18.578.688.48A10.015 10.015 0 0022 12.015C22 6.484 17.523 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}

/* ─────────────────── section header ─────────────────── */
function SectionHeader({ id, icon, title, count }) {
  return (
    <div className="flex items-center gap-4 pb-4 mb-10 border-b border-white/10">
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <a href={`#${id}`} className="group flex items-center gap-2">
          <h1 className="text-white text-2xl font-bold group-hover:text-indigo-400 transition-colors">
            # {title}
          </h1>
        </a>
      </div>
      {count > 0 && (
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
          {count} repos
        </span>
      )}
    </div>
  );
}

/* ─────────────────── main component ─────────────────── */
function App() {
  const envData = import.meta.env;
  const token = envData.VITE_REACT_APP_TOKEN;

  const [allRepos, setAllRepos] = useState([]);
  const [languageMap, setLanguageMap] = useState({}); // repoId -> languages obj
  const [dataDocs, setDataDocs] = useState([]);
  const [activeSkillTab, setActiveSkillTab] = useState("Frontend");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
    newsletter: false,
  });
  const [formStatus, setFormStatus] = useState(null); // null | "sending" | "ok" | "error"

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

    // Fetch all repos once; filter client-side
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

        // Fetch languages for relevant repos
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
  }, []);

  // Derived lists
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

  const history = [
    {
      date: "2018",
      title: "Started learning programming",
      description:
        "My interest in software started and I began to learn — curiosity lit the fire.",
    },
    {
      date: "May 2022",
      title: "Joined GitHub",
      description:
        "I joined GitHub and explored open source code, discovering other programmers. This expanded my vision and knowledge enormously.",
    },
    {
      date: "June 2022",
      title: "Learned VueJS",
      description:
        "I learned VueJS and took my first real step into frontend development. I really enjoyed it.",
    },
    {
      date: "December 2022",
      title: "First Project",
      description:
        "I created my first project and understood the logic of frontend libraries using VueJS.",
    },
    {
      date: "February 2023",
      title: "Became a Freelancer",
      description:
        "I started taking on freelance work in the software industry, writing responsive and user-friendly websites for clients.",
    },
    {
      date: "September 2023",
      title: "Joined Dismass Studio",
      description:
        "At Dismass Studio I gained team spirit and, thanks to my valued colleagues, my horizons expanded greatly. A truly great experience.",
    },
    {
      date: "January 2025",
      title: "First Lİbrary",
      description:
        "I used to solve my problems locally within my projects and move on. But then I realized other developers might face the same issues. That’s when I discovered the open-source world—and I fell in love with it. Now I can’t stop building and sharing tools that might help others. 🚀"
    }
  ];

  const skillsConfig = [
    {
      label: "Frontend",
      icons: [
        { src: "https://skillicons.dev/icons?i=javascript" },
        { src: "https://skillicons.dev/icons?i=typescript" },
        { src: "https://skillicons.dev/icons?i=react" },
        { src: "https://skillicons.dev/icons?i=next" },
        { src: "https://skillicons.dev/icons?i=vite" },
        { src: "https://skillicons.dev/icons?i=tailwindcss" },
        { src: "https://skillicons.dev/icons?i=bootstrap" },
        { src: "https://skillicons.dev/icons?i=redux" },
        { src: "https://skillicons.dev/icons?i=sass" },
        { src: "https://skillicons.dev/icons?i=materialui" },
        { src: "https://skillicons.dev/icons?i=vitest" },
        {
          src: "https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white",
          badge: true,
          alt: "React Router",
        },
      ],
    },
    {
      label: "Backend",
      icons: [
        { src: "https://skillicons.dev/icons?i=nodejs" },
        { src: "https://skillicons.dev/icons?i=nestjs" },
        { src: "https://skillicons.dev/icons?i=express" },
        { src: "https://skillicons.dev/icons?i=mongodb" },
        { src: "https://skillicons.dev/icons?i=flask" },
        { src: "https://skillicons.dev/icons?i=yarn" },
        { src: "https://skillicons.dev/icons?i=npm" },
        {
          src: "https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD",
          badge: true,
          alt: "Nodemon",
        },
        {
          src: "https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101",
          badge: true,
          alt: "Socket.io",
        },
        {
          src: "https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens",
          badge: true,
          alt: "JWT",
        },
        { src: "https://skillicons.dev/icons?i=redis" },
        { src: "https://skillicons.dev/icons?i=rabbitmq" },

      ],
    },
    {
      label: "Deploy",
      icons: [
        { src: "https://skillicons.dev/icons?i=vercel" },
        { src: "https://skillicons.dev/icons?i=netlify" },
        { src: "https://skillicons.dev/icons?i=aws" },
        {
          src: "https://images.icon-icons.com/2407/PNG/512/digitalocean_icon_146196.png",
          badge: true,
          alt: "Digitail Ocean",
        },
        { src: "https://skillicons.dev/icons?i=heroku" },
        {
          src: "https://www.vectorlogo.zone/logos/nginx/nginx-ar21.svg",
          badge: true,
          alt: "Nginx",
        },
        {
          src: "https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white",
          badge: true,
          alt: "Render",
        },
        {
          src: "https://img.shields.io/badge/github%20pages-121013?style=for-the-badge&logo=github&logoColor=white",
          badge: true,
          alt: "GitHub Pages",
        },
      ],
    },
    {
      label: "Mobile",
      icons: [
        {
          src: "https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB",
          badge: true,
          alt: "React Native",
        },
        {
          src: "https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37",
          badge: true,
          alt: "Expo",
        },
        { src: "https://skillicons.dev/icons?i=supabase" },
        { src: "https://skillicons.dev/icons?i=androidstudio" },
      ],
    },
    {
      label: "Desktop",
      icons: [
        { src: "https://skillicons.dev/icons?i=react" },
        { src: "https://skillicons.dev/icons?i=electron" },
        { src: "https://skillicons.dev/icons?i=supabase" },
        {
          src: "https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white",
          badge: true,
          alt: "React Router",
        },
      ],
    },
    {
      label: "OS",
      icons: [
        { src: "https://skillicons.dev/icons?i=ubuntu" },
        {
          src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSahPqsasUFYVDDsZ3uP3z02tYS_fRcL7A3zQ&s",
        },
        {
          src: "https://cdn.masto.host/floss/accounts/avatars/109/788/013/473/998/203/original/965ef7eaff26d3e7.png",
        },
        {
          src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAe1BMVEUAecH///8AdsAAbr0Acb4Adb8Ab70Ac78AbLxspdT3+/3b6fTs9Pr1+v3f6/XX5vPP4fC71OqMt9zm8PjC2eyixOKty+VCkMtfntFQls0dgcVrpNMMfcMyich5rNeBsdmpyOSWvd9am8+00Og2jMmHtNrJ3e4AaLu+1+vGiVKhAAAQ+0lEQVR4nO1daZequhKFDARw6NYWBduhtYfb//8XPnBkSFUqIWjfu95e63w554hsk9RclSAcHOPRYpntk3z1td1sNkH5Z/u1ypN9tlyMxsN/fTDgs9PRbJ5vJY+EUlIyFtzBmJRKiYirbT7/HKUDvsVQDKefu5KbULLOSwcmlSh57pajgd5kCIajLC/JGbm1eEbymA3B0jfDdJYEXNmQq9FUnCWziec38spwvCwiIZ3YXSFFVCy9yh9/DNPPkp7b4rWXUhSf/mSPL4aviR96F5Iien/19GZeGE6yNe+3ObuQfJ15OZIeGL7tlKNowVHu1t30DzB8OXpfvjskP748meHrig+xfHcwvup5IHsxHJyfD449GE6LB/A7cyx6nEdnhpPkQfzOHBNnuerKMIuGky86SJ49lOHrWjyUXwWxdjuOLgzT9wdu0DsYf3ex5RwYzthjN+gdUs4ewDDN+ZP4VeBH62W0ZfjztAU8Q7LFsAz3zgvIrHx+BHw/IMPxVrmxU5Eo5mtPFNXWykO2Yfjr4gFKxdkxq+znidvP0wUTv8MwnFvv0JJdkN/DS3tvR5jPh2BY2Cn5Kqz0/tGwJ8f+pLAovDMcr+0WQK6Wb52H7PzJYbmmHkYiwxdrSah7ylvsjWEpm4m+MY3hr/X+2mifk/tUppwmb0gMl/a/Pe/u0RIjr/ZQ/OGL4cFhc4lP7aOO5M2uCKopPvhhaK8lSki95fFKfZZazggeWkzQGmaG3047i33pn7aiLWJUiZGD2cvm3/0ZuhEs31H/uB/S4/hZTo4L4/kwUzQxdNqiJ4aAMN8SFvH+2cXGZOoZzRsDw4Oz8FNAXOU3Mn5U1H+cuSmewA99GDqoiSvkO/BMo4vRWv23leFXjpfuDH/72CB6nR+GnwYR2d3eM4Zv1RhV/RjDl176OYYMxw36MaE7v3t8q3LMgEMYjvuZWBEUbvjAFlFLMAynK3QZJWKGIwx7+uQKFHLIcyEJbHAu2dqFYdHTSmagC3cA1yOCizFGqAyWsL8IMpz3jmpL8EuhRyvkPME/ywkC3DEQQ3t/qYMITBjN9W8LnMEzTGcG9KUAhmMPeQkB6qmJdsfBZzCk+F0CkDYAQ9y2ong25S7dge+71zxAoAVR30apwLY2DPfopueHX0rUBvrKsAq8bteMR1Gt7A07g6FJiZ6foHfYtAxxB6CyktItgWKEZzUno0WWbLk4FXKgZ7D0K83WbPnL/1AZpugevJiBuAo+MyQl/F4PKy4QNXECLUrHdGkbHcMj9rj4Gp7IjT+rOlAYhlXBmCluRtPNMqcxnGF7tGbI70zijem+0Am/RNHONfnFLsMUXcG6BjBHqHwxJEchZXefdl/iHXlayxX7MFDUhxTtkZLND5mYGWLRsLgdIkQ3dCkgHZLSOizp9kfckW4dhoh1pHGmX9HvluZIGAkF3cvpehlthhn8ytpowRRLaLCVF4JjijK8QrTjQy2GE3jbAeGQ8QY5t0BI0RKZVWqVt+yMFsMEfN3OGbxigpg3qDFNBiUAeUdb2DQZwhY87Chg5o265U7S6eJjvsuL1WpV5Lv5x2JKLhuZWjpyvOm1NRkiRxp7hyN0eM+/5+gjWSsenRtn2LldJuJq/f5B6q8w+L4dtIILjTdHNAW+33aQLFiHn4ni+s4ZJst/ef80Fh0S3IomeENjNBgiaRPEFaoABv+5of9CiuiIa037mGZThNcZvmImisDTkZl78JgJ9o1EAx0qOBqLWGeIZ74Uvp0M5g0OyXMwqOMQ8mssYo2hIXupMfkaIDmp8NPjXG/E/rg8th4ErzE0ZaC7Jl8To36VazLe6xSIU3EDO+oYGtWOQdiE4dumZ5ScaayKo1OtWE0n3hmaAwWRqdR6YllW1H2xonvYKRGhDmpxvhvDCcFDMYSWSqx6UpSqozomTg8St1e9MaSYt9o4SBPW6rkN3omyOiX57inoG0NSpinWxuvuSPuuYQmxaguczEGc3v3EK0NaoQuWxQorUeOjqktu2nrDJQ120/pXhrDb1IA4IARfPPVYsnb8O3WQpzf1fWGYUjdCBNtX/VR+A7ylel0MpihtMDSVD9wgjyEAckEXBW2KDvv0Wll3YUiP9cRAer5fWUMHreIDh2zf1U08M7SJ9eirSN58N0KpprgBkqoYLgfqzNAiIKmvQEh7GmxdsE1TaYhYA34C8PKXwEtguUlLRBonwIMebEMSQpFphfBV/+WXbXpiqM86Q9BEQXdDNOsJOIfc/no9xbOReWI4s3vBTobHQ1mD9nuojSOAJjgnFU4Mier+juYXeGuGacMQVrjhTf8Ln5X+6WVtpYRq7p++tUUgkDqgJgB7n10ZWlfQNwMan8M1JHIo0N4CkBHkowtDu7xAUHe+QlPWvye0mfkulnoGJxeqYkhvEbh88FB/Ol6Z0hNABUkbU70yOKXZK4a2x6hRsOaz00eDmJZGRt40AH8AEM0l9Nro0wUhrIC8RVVaF4CbGISqn43psEtYLiJpYMQHUAu4PDG07JlrdsMMvITURQTUQRVyC2wTkE2z1GPTJAROajTUr2EV4g1sQwTN7Nz3kIL0DEUqdwD0gUxLhpb6PmoYpT4oGEFhCOj0UucHtmZ3o/jA8rNuIFXlACGG8rOBpffcNNhsbQUnMDA0VIde4pXuehDmFm/J1D91j4YcoeuHiGK66Z34UhIHVFHKpOCymDdcNnKErh+AftQm9O5FKUwDQM42/ptUkVjtZx3dixX5eQTYJHbFS/YeAOskwwDXaBU5eLjoowYNKZjceLZf8UiBPzUfB3AvSjU6dZ1kr+Ap8NuZjYBrf+D0Ncs3pjmp0ShYaBdCRjzIDz94FAEwBv1DdepAqhG35e4yixCxCLR2t9otCLbSg45hS0VNfg6FIo+4VctAZwzATVkN+Bo4Y8QtqTdaJutL+wIRKgt0BTmmwpIzXHJejhClSFnMCwbUjyGQ+0AXSaQxtK0Z7AGWryPKqetCJoHOpKExXDzGojnB+TywPNCVetEYPkyU9gErgi/NX9MYzp8714yIr2Cr+VsaQ48TgwbENtBZrDSGg4dovGDTg6FV0vFp6MOQOIjlydB7Vf8lhnqO/yWG/z+HGP4tsvS/rg/XfWyaf4PVVvL779ul/w7fwhmlb6GvNKGUeTzQP3RH6R/qm27Eav5jijQ/0Md3R+njA0kbpoT4+l6ga/mwOE0PqEwfazuDyUhs978gS+tSKvf3tLs9qv7JJRAvvYFJEa93M21s8XHx0sNst42sYmxXiAUS876hSsqsd5+duo/HxryrOGlgHWyLRoa8xQ0Vy03Smg38+LzFdLlbxzZRNz6h5J5ukOKfRnz9ObmnajEFkoxpfpaeP7x8oFH78cT8YdU9TQihnvKHdi5CI9H15BxwFQav2qiRj55ywHYGdHNu0B/I4798vG9isJ36lMe3q6doVkT9kVqM8W8CLNOpFsNW5jee3f/9bb8RwJd+N53qaSzNy+Y2/TM1UYC8PNVE9Rqs8Vfq2ib6EslzXZttNKJRAv2A2kRTIcYJgN661CbatAQF7RHIf6S+FHACLvWltjXCzdauv1EjDLQjXGqEbeu8m9L7T9R5Q4tUNVw41Oq3moH/Qq0+4MfdavVt+y2aJaZ/od8CWKNbv4W1n9c8iX+gZwb4kU+zI5z6nlqH4+l9T1CP9a3vyTbg0m5ZH6x3TRJ714BJUrXeNTsDujvj5Nn9h0CeL7r3H9r1kMbdSsH9ID2k1AvWoMGRZ7/Svg9YOzn7SX3AZwDphXofsI3hph+NMXwvNwJgVlajl9uiHz/WD2578y1tFH32KWCyXVwE25kKoJHx4jdm056At5Kb7SpP9vNs+bl4mb7VpCzQBdycqUCOmjHoXo6B52Isy9/vMo9QiSiKOI+jYL06vu/mh7X+Ea25GNSoGTbvC5/W2ougXuNeKAPPuDb32M2nUegQANtGRgid+TT4/G092vNpiHsM3qMlxtZvAbxbZ8bQ0uEAdGYMkZKB6JgoXwqjOyfKJdncnRNFcaHw9L7TXLUuNFfFumRiNbO+KEFFTAf7cTCk6tqiTk++NytbzNyDpgudkHuRMrqZe042r27mHqQ47x/CwnpeTG/t3ES3wai1afD02ZeakfU3uF/PVnu+dvalixhtzuuqMcRnWemuHbjCQxwDmF/qOPcVmF+KFozCU8xK76V3QFEBM2g/3Z4MzaBFtT4SUIDXnpGG8DERQHOEbQddXwDOEUYWEWlUfQNlMNsujlGvWdAm6Qd8LzgLGllE2FybwB07VTY1xed5C8M8b6dhocg8b1i5wv4oYnBcb88bLZOt40x2l8vKJTKTHbYAWQCcFCxAUx9Z6zhX/8dBz6Jz9WEnCqCImTLQhblWsBc1+N0IyP0WWoroJDr4AkQL2Fd7tIcd0+8o0VDEr9KlXWhlgLVXbbqjBJMcHYqGq4KQLno63iwDXOZ7ZjC136JosKiI7dImWM4Hakd4dPc9IRGbBkVT3AO68tgSdn2clPue0IxnjeLUJMf1gxCsYTedWJNRtbx37UZxzEy7x8sxDO2KWGn3ruHlFReKqTF2QiyiMMOi2IN6d16YYk85UzSHnRR+W/YN45nhxiSbIlbq/Yf4HZZsMw0Ls5Yy3CqXpuOXRbYvAi4UXtaFXLLV/kryHZamCpKI4vYh8+kXchOwKL5eQ8o2eDIbKDvswOYeUmst1AVykWzHqJD41SBEN9juLtlw3Dc4iJS9dtOxeM0FcRa65X3A4aJncAmZv6/53wotQCR9IYeiuQPdy43cSaPddBFWJkvJi9nfy90zTA/f7QjUfcSIjUcohnG5W71fa5oAs1RQ8iCGD665GAa7WQRhOO6xiOCYPDh6xmHNb+z8l4hKxQrh3YsP4Os5kWwuHO0yXTuO/Dg4Q/dgNnibM3Z5HYN6c98MMUU0KYYzDJeOFMEABmpJAAL426C4gAtSaQxdk0rQDaszfN/rCr2WzGB88ANOwdSQggebAICdSqYQtmq7P69bkyzgpoieseXGtEe0LwooN+Sy4Qua9YjjPDZJUW7sqDE3FTlQ5PoeCUqpAK/9OPPIqK/MBAkMHTYqkMchNUndAhGzDcEJJQSdKY1h5lvimwAy/sQCyHNh2eiL8L/jA+HtSa1vlkoDSDZSu4ajaThJjAcwMKoJG4aWQz702pDe8yALUhtzhCp6S4bhi00bPPvSUbQYK0XKjUvind9EhuHY5gJOFqlj1pKnP377o+SaNG7fgmHpL9q1LKg42H3W3sLvmBBBT4rQGdprDSni7fdlCIxlk6MBFC3hwDBc2I/eYFKIInvxVnt6fqigyRh7huF46xKCYypSPldQbalH0J5hGO6fPzlJU4Dqk2H4Ezx3SptkhutsezMM0/yZy8hzcieNM8Mw/GXPWkbJKJd59GcYpgl/xgwsxhPrBXRkWLre60eNF7pDrN2qV9wYVjdJP3arSu5a+ODKMJzs+OM4Sp4QG2Y9MgzDafGg48h4QRod4Z1h6VOtHsCR8VWv8rFeDEuRsxp4r/bl15thuY7HATlKfiT6uQMyDMO3nXK6mMEEpsSO3io7JMPSBMjW3hdS8nXmouA78MKwxGtCqkEhgoko8VGdWsEXw6oqv/BDsqRXECd+UOCPYYnxsoh62jpS8GJp5eGa4JVhifQ3CfBBf8jiKc6SmbPxAsA3wwrTLGeR3dTY6vYzecz8lKQ2MQTDCtWlWpIL80BVVl1+Bl/t1h9DMayQjmaHvOqWEed2mTqvU+OMiEpu+fxz5EUtABiS4QXj0WKZ7ZO8+NpuNpug/LP9KvJkny0XI68yRY//Aaqq4uX0gNcsAAAAAElFTkSuQmCC",
        },
        { src: "https://skillicons.dev/icons?i=bash" },
        { src: "https://skillicons.dev/icons?i=linux" },
        {
          svg: true,
          content: `<svg fill="#35bfa4" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="48" height="48"><path d="M0 0v32h9v-23h11.5v-9zM11.5 11.5v20.5h9v-20.5zM23 0v32h9v-32z"/></svg>`,
          alt: "i3wm",
        },
        {
          svg: true,
          content: `<svg width="48" height="48" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M256,128.004 C256,57.31 198.691,0 127.998,0 C57.336,0 0.05,57.262 0,127.914 L0,226.968 C0.038,243.01 13.049,255.997 29.101,255.997 L128.05,255.997 C198.72,255.969 256,198.679 256,128.004" fill="#294172"/><path d="M165.58,30.307 C132.471,30.307 105.535,57.242 105.535,90.352 L105.535,122.222 L73.797,122.222 C40.688,122.222 13.752,149.159 13.752,182.268 C13.752,215.376 40.688,242.313 73.797,242.313 C106.906,242.313 133.842,215.376 133.842,182.268 L133.842,150.397 L165.58,150.397 C198.689,150.397 225.626,123.461 225.626,90.352 C225.626,57.242 198.689,30.307 165.58,30.307 Z" fill="#3C6EB4"/><path d="M178.851,32.128 C174.191,30.91 170.613,30.342 165.58,30.342 C132.403,30.342 105.505,57.241 105.505,90.416 L105.505,122.258 L80.345,122.258 C72.5,122.258 66.16,128.423 66.165,136.254 C66.165,144.036 72.435,150.227 80.197,150.227 L101.028,150.231 C103.501,150.231 105.507,152.231 105.507,154.7 L105.507,182.253 C105.476,199.744 91.288,213.912 73.797,213.912 C67.872,213.912 66.405,213.136 62.36,213.136 C53.863,213.136 48.178,218.832 48.178,226.664 C48.18,233.143 53.732,238.713 60.526,240.491 C65.186,241.709 68.764,242.278 73.797,242.278 C106.974,242.278 133.872,215.379 133.872,182.203 L133.872,150.362 L159.032,150.362 C166.877,150.362 173.217,144.197 173.212,136.366 C173.212,128.583 166.942,122.393 159.18,122.393 L138.349,122.389 C135.876,122.389 133.87,120.388 133.87,117.919 L133.87,90.366 C133.901,72.875 148.089,58.707 165.58,58.707 C171.505,58.707 172.972,59.484 177.017,59.484 C185.514,59.484 191.199,53.787 191.199,45.956 C191.197,39.476 185.645,33.906 178.851,32.128" fill="#FFFFFF"/></svg>`,
          alt: "FreeBSD",
        },
        {
          src: "https://ih1.redbubble.net/image.2495565504.2082/st,small,507x507-pad,600x600,f8f8f8.u2.jpg",
          badge: true,
          alt: "Arch Linux",
        },
        {
          src: "https://w7.pngwing.com/pngs/600/114/png-transparent-dragon-kali-linux-android-linux-logo-silhouette-linux-thumbnail.png",
          badge: false,
          alt: "Kali Linux",
        },
        {
          src: "data:image/jpeg;base64,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",
          badge: true,
          alt: "Parrot",
        },
        {
          src: "data:image/png;base64,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",
          badge: true,
          alt: "Tails",
        },
        {
          src: "https://avatars.githubusercontent.com/u/81515095?s=280&v=4",
          badge: true,
          alt: "Nobara",
        },
        {
          src: "https://garudalinux.org/assets/garuda-purple.svg",
          badge: true,
          alt: "Garuda Linux",
        },
        { src: "https://skillicons.dev/icons?i=powershell" },
        { src: "https://skillicons.dev/icons?i=windows" },
      ],
    },
    {
      label: "Other",
      icons: [
        { src: "https://skillicons.dev/icons?i=git" },
        { src: "https://skillicons.dev/icons?i=github" },
        { src: "https://skillicons.dev/icons?i=githubactions" },
        { src: "https://skillicons.dev/icons?i=postman" },
        {
          src: "https://imagedelivery.net/-IT6z0z0Ec5yEiYj3DvVjg/c09279b0b46d619e11b0660251d0aa6cd7196fa0/public",
        },
        { src: "https://skillicons.dev/icons?i=python" },
        { src: "https://skillicons.dev/icons?i=md" },
        {
          src: "https://img.shields.io/badge/Insomnia-black?style=for-the-badge&logo=insomnia&logoColor=5849BE",
          badge: true,
          alt: "Insomnia",
        },
        {
          src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkwpioZ0adCxoJkhcXVcNE7HOia3AvekIuPg&s",
          badge: true,
          alt: "Swagger",
        },
        { src: "https://skillicons.dev/icons?i=docker" },

      ],
    },
  ];

  const activeSkill =
    skillsConfig.find((s) => s.label === activeSkillTab) || skillsConfig[0];

  /* ───── render ───── */
  return (
    <div className="relative bg-[#0a0a0f] min-h-screen">
      <NavbarSticky className="sticky top-0 z-10 h-auto sticky-navbar" />

      {/* ── HERO ── */}
      <div id="hero" className="short-about pt-[8vh] relative overflow-hidden">
        {/* background glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-indigo-600/20 blur-[120px]" />
        <img
          alt="osmanbeyhan"
          className="image ring-4 ring-indigo-500/30 shadow-2xl shadow-indigo-500/20"
          src={osmanbeyhan}
        />
        <div className="welcome">
          <p
            id="hi"
            className="tracking-widest uppercase text-sm font-semibold"
          >
            Hi, I am
          </p>
          <h1
            id="name"
            className="bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent"
          >
            Osman Beyhan!
          </h1>
          <h2 id="title">Full-Stack & Cross-Platform Developer</h2>
          <p id="description">
            I build databases with <span className="lang">MongoDB</span>, route
            with <span className="lang">ExpressJS</span>, design front-ends with{" "}
            <span className="lang">React</span> and tie them together with{" "}
            <span className="lang">NodeJS</span>.
          </p>
          <div className="flex gap-3 mt-6">
            <a
              href="#projects"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-indigo-600/30"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="px-5 py-2.5 rounded-xl border border-white/20 hover:border-indigo-400 text-white/70 hover:text-white text-sm font-semibold transition-all duration-200"
            >
              Contact Me
            </a>
          </div>
        </div>
      </div>

      {/* ── SKILLS ── */}
      <div className="my-[15vh] max-w-[90%] mx-auto px-4" id="skills">
        <SectionHeader id="skills" icon="🛠️" title="Skills" />
        {/* tab pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {skillsConfig.map((s) => (
            <button
              key={s.label}
              onClick={() => setActiveSkillTab(s.label)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                activeSkillTab === s.label
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                  : "border-white/10 text-white/50 hover:border-indigo-400/50 hover:text-white/80"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 p-6 rounded-2xl bg-white/5 border border-white/10">
          {activeSkill.icons.map((icon, i) =>
            icon.svg ? (
              <span
                key={i}
                title={icon.alt || ""}
                className="h-12 w-12 flex items-center justify-center transition-transform duration-200 hover:scale-110 rounded-xl overflow-hidden"
                dangerouslySetInnerHTML={{ __html: icon.content }}
              />
            ) : (
              <img
                key={i}
                className={`${icon.badge ? "h-[47px] rounded-md" : "h-12 w-12 rounded-xl"} transition-transform duration-200 hover:scale-110`}
                src={icon.src}
                alt={icon.alt || ""}
              />
            ),
          )}
        </div>
      </div>

      {/* ── ABOUT ── */}
      <div id="about" className="my-[15vh] lg:max-w-[90%] lg:mx-auto px-4">
        <SectionHeader id="about" icon="👤" title="Who am I?" />
        <div className="lg:flex lg:gap-12 py-6">
          <div className="flex-shrink-0 mb-8 lg:mb-0">
            <img
              src="https://i.pinimg.com/originals/51/8a/fb/518afb1d1cdc07eb7d2b1729f03fe91e.gif"
              alt="coding gif"
              className="rounded-2xl ring-1 ring-white/10 shadow-2xl max-w-xs w-full"
            />
          </div>
          <div className="text-white/70">
            <h2 className="text-2xl font-bold text-white mb-4">Hello! 👋</h2>
            <p className="text-base leading-relaxed mb-4">
              My name is{" "}
              <span className="text-indigo-400 font-semibold">Osman</span>. I am
              a web developer living in Turkey. I love to create things and I've
              been coding for{" "}
              <span className="text-white font-semibold">
                {year - 2018} years
              </span>
              . I am{" "}
              <span className="text-white font-semibold">
                {year - 2004} years old
              </span>{" "}
              — still a young programmer with a lot to learn.
            </p>
            <p className="text-base leading-relaxed mb-4">
              I have insatiable curiosity and learn quickly, so I want to
              leverage that in my career. My life philosophy:{" "}
              <em className="text-indigo-300">
                "Learn and teach what you have learned."
              </em>
            </p>
            <p className="text-base leading-relaxed mb-4">
              I love to learn because it is the reason for living that I found
              for my life. I love to teach because{" "}
              <em className="text-indigo-300">
                "The fastest way to learn is to teach."
              </em>
            </p>
          </div>
        </div>
      </div>

      {/* ── PROJECTS ── */}
      <div id="projects" className="">
        <h1 className="-mb-12 text-center text-4xl">Projects</h1>
      </div>

      {/* ── LIBRARIES ── */}
      {libraries.length > 0 && (
        <div
          id="libraries"
          className="my-[15vh] lg:max-w-[90%] lg:mx-auto px-4"
        >
          <SectionHeader
            id="libraries"
            icon="📦"
            title="Libraries"
            count={libraries.length}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {libraries.map((repo) => (
              <RepoCard
                key={repo.id}
                repo={repo}
                languages={languageMap[repo.id]}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── APPS ── */}
      {apps.length > 0 && (
        <div id="apps" className="my-[15vh] lg:max-w-[90%] lg:mx-auto px-4">
          <SectionHeader id="apps" icon="💻" title="Apps" count={apps.length} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {apps.map((repo) => (
              <RepoCard
                key={repo.id}
                repo={repo}
                languages={languageMap[repo.id]}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── TOOLS ── */}
      {tools.length > 0 && (
        <div id="tools" className="my-[15vh] lg:max-w-[90%] lg:mx-auto px-4">
          <SectionHeader
            id="tools"
            icon="🔧"
            title="Tools"
            count={tools.length}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tools.map((repo) => (
              <RepoCard
                key={repo.id}
                repo={repo}
                languages={languageMap[repo.id]}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── HISTORY ── */}
      <section>
        <div id="history" className="py-16 bg-black/60">
          <div className="lg:max-w-[90%] lg:mx-auto px-4 mb-12">
            <SectionHeader id="history" icon="📅" title="History" />
          </div>
          <div className="container mx-auto flex flex-col items-start md:flex-row my-12 md:my-24 px-4">
            <div className="flex flex-col w-full sticky md:top-36 lg:w-1/3 mt-2 md:mt-12 px-8">
              <p className="ml-2 text-indigo-400 uppercase tracking-widest text-xs font-semibold">
                My Chronological History
              </p>
              <p className="text-3xl md:text-4xl leading-normal md:leading-relaxed mb-2 text-white mt-2">
                My Working Process
              </p>
              <p className="text-sm md:text-base text-white/40 mb-4">
                Here's my learning and working process in a quick chronological
                order.
              </p>
            </div>
            <div className="ml-0 md:ml-12 lg:w-2/3 sticky">
              <div className="relative wrap overflow-hidden p-10 h-full">
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-600/80 to-indigo-900/10 transform -translate-x-1/2" />
                {history.map((item, index) => (
                  <div
                    key={index}
                    className={`mb-10 flex justify-between items-center w-full ${index % 2 === 0 ? "flex-row-reverse" : ""}`}
                  >
                    <div className="order-1 w-5/12" />
                    <div className="z-10 flex items-center justify-center order-1 bg-indigo-600 shadow-xl shadow-indigo-600/30 w-8 h-8 rounded-full flex-shrink-0">
                      <div className="w-3 h-3 rounded-full bg-white" />
                    </div>
                    <div className="order-1 w-5/12 px-4 py-4 bg-white/5 border border-white/10 rounded-xl hover:border-indigo-500/30 transition-colors">
                      <p className="mb-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                        {item.date}
                      </p>
                      <h4 className="mb-2 font-bold text-base md:text-lg text-white">
                        {item.title}
                      </h4>
                      <p className="text-xs md:text-sm leading-relaxed text-white/50">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <div id="contact" className="max-w-screen-md mx-auto p-5 my-[10vh]">
        <div className="text-center mb-12">
          <p className="mt-4 text-xs leading-7 text-indigo-400 font-semibold uppercase tracking-widest">
            Contact
          </p>
          <h3 className="text-3xl sm:text-4xl leading-normal font-extrabold tracking-tight text-white mt-2">
            Get In <span className="text-indigo-500">Touch</span>
          </h3>
          <p className="text-white/40 text-sm mt-3">
            Have a project in mind? I'd love to hear from you.
          </p>
        </div>

        <form
          className="w-full space-y-5 bg-white/5 border border-white/10 rounded-2xl p-8"
          onSubmit={handleSubmit}
        >
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1">
              <label
                className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-1.5"
                htmlFor="firstName"
              >
                First Name
              </label>
              <input
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-white/20"
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
              <label
                className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-1.5"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <input
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-white/20"
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
            <label
              className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-1.5"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-white/20"
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
            <label
              className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-1.5"
              htmlFor="message"
            >
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="6"
              className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-white/20"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-white/40 cursor-pointer select-none">
              <input
                className="accent-indigo-500"
                type="checkbox"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleChange}
              />
              Send me your newsletter!
            </label>
            <button
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                formStatus === "sending"
                  ? "bg-indigo-700 text-white/60 cursor-not-allowed"
                  : formStatus === "ok"
                    ? "bg-green-600 text-white shadow-lg shadow-green-600/30"
                    : formStatus === "error"
                      ? "bg-red-600 text-white"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
              }`}
              type="submit"
              disabled={formStatus === "sending"}
            >
              {formStatus === "sending"
                ? "Sending…"
                : formStatus === "ok"
                  ? "✓ Sent!"
                  : formStatus === "error"
                    ? "Try Again"
                    : "Send Message"}
            </button>
          </div>
        </form>
      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-8 text-center text-white/30 text-sm">
        <p>© {year} Osman Beyhan</p>
      </footer>
    </div>
  );
}

export default App;
