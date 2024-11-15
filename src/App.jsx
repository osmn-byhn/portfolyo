import { useState, useEffect } from "react";
import axios from "axios";
import osmanbeyhan from "./assets/osmanbeyhan.jpg";
import NavbarSticky from "./components/NavbarSticky";

function App() {
  const [dataGithub, setDataGithub] = useState([]);
  const [dataDocs, setDataDocs] = useState([]);
  const [dataLanguage, setDataLanguage] = useState([]);
  const envData = import.meta.env;
  const token = envData.VITE_REACT_APP_TOKEN;
   // Oluşturduğunuz token'ı buraya yapıştırın.
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
    newsletter: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, email, message } = formData;

    // Prepare the request data
    const requestData = {
      email: envData.VITE_REACT_APP_MAIL, // replace with your email
      password: envData.VITE_REACT_APP_MAIL_PASSWORD, // replace with your app password
      to: envData.VITE_REACT_APP_MAILTO, // replace with the recipient email
      subject: `Message from ${firstName} ${lastName}, ${email}`,
      text: message,
    };
    

    try {
      const response = await fetch('https://mail-send-api2.onrender.com/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        // Handle successful response
        console.log('Message sent successfully');
        // You can reset the form or show a success message here
      } else {
        // Handle error response
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `token ${token}`,
      },
    };

    axios
      .get("https://api.github.com/users/osmn-byhn/repos", config)
      .then((res) => {
        const repos = [];
        const languagePromises = [];

        res.data.forEach((repo) => {
          if (repo.topics.includes("project-completed")) {
            repos.push(repo);
            languagePromises.push(
              axios
                .get(repo.languages_url, config)
                .then((response) => response.data)
            );
          }
        });

        setDataGithub(repos);

        // All language requests completed
        Promise.all(languagePromises)
          .then((languages) => {
            setDataLanguage(languages);
          })
          .catch((error) => {
            console.log(`Error fetching languages: ${error.message}`);
          });
      })
      .catch((err) => console.log(err));

    axios
      .get("https://api.github.com/users/osmn-byhn/repos", config)
      .then((res) => {
        const repos = [];
        res.data.forEach((repo) => {
          if (repo.topics.includes("docs")) {
            repos.push(repo);
          }
        });
        setDataDocs(repos);
      })
      .catch((err) => console.log(err));
  }, []); // useEffect'in kapanış parantezi doğru şekilde yerleştirildi

  const history = [
    {
      date: "2018",
      title: "Started learn programming",
      description: "My interest in software started and I started to learn",
    },
    {
      date: "May 2022",
      title: "Joined GitHub",
      description:
        "I joined Github and read the open source codes, discovered other programmers. This expanded my vision and knowledge about programming.",
    },
    {
      date: "June 2022",
      title: "Learn VueJS",
      description:
        "I learned VueJS and took my first step in the frontend and I really enjoyed learning.",
    },
    {
      date: "December 2022",
      title: "First Project",
      description:
        "I created my first project and understood the logic of frontend libraries using VueJS",
    },
    {
      date: "February 2023",
      title: "I became a freelancer",
      description:
        "I started taking on freelance work in the software industry and wrote responsive and user-friendly websites for my clients' requests.",
    },
    {
      date: "September 2023",
      title: "I was hired at 911CAD",
      description:
        "When I started working at 911CAD, I gained team spirit and thanks to my valuable colleagues in the team, my horizons expanded and I gained more knowledge in this sector. It was really a great experience for me.",
    },
  ];

  const date = new Date();
  let year = date.getFullYear();
  const data = [
    {
      label: "Frontend",
      value: "frontend",
      desc: (
        <div className="flex flex-wrap gap-2 ">
          <img src="https://skillicons.dev/icons?i=javascript" />
          <img src="https://skillicons.dev/icons?i=typescript" />
          <img src="https://skillicons.dev/icons?i=next" />
          <img src="https://skillicons.dev/icons?i=tailwindcss" />
          <img src="https://skillicons.dev/icons?i=bootstrap" />
          <img src="https://skillicons.dev/icons?i=react" />
          <img src="https://skillicons.dev/icons?i=redux" />
          <img src="https://skillicons.dev/icons?i=vite" />
          <img src="https://skillicons.dev/icons?i=vitest" />
          <img src="https://skillicons.dev/icons?i=sass" />
          <img src="https://skillicons.dev/icons?i=materialui" />
          <img
            className="h-[47px] rounded-md"
            src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white"
            alt="React Router"
          />
        </div>
      ),
    },
    {
      label: "Backend",
      value: "backend",
      desc: (
        <div className="flex flex-wrap gap-2 ">
          <img src="https://skillicons.dev/icons?i=nodejs" />
          <img src="https://skillicons.dev/icons?i=yarn" />
          <img src="https://skillicons.dev/icons?i=mongodb" />
          <img src="https://skillicons.dev/icons?i=express" />
          <img src="https://skillicons.dev/icons?i=npm" />
          <img
            className="h-[47px] rounded-md"
            src="https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD"
            alt="Nodemon"
          />
          <img
            className="h-[47px] rounded-md"
            src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101"
            alt="Socket.io"
          />
          <img
            className="h-[47px] rounded-md"
            src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens"
            alt="JWT"
          />
        </div>
      ),
    },
    {
      label: "Deploy",
      value: "deploy",
      desc: (
        <div className="flex flex-wrap gap-2 ">
          <img src="https://skillicons.dev/icons?i=vercel" />
          <img src="https://skillicons.dev/icons?i=netlify" />
          <img src="https://skillicons.dev/icons?i=aws" />
          <img src="https://skillicons.dev/icons?i=heroku" />
          <img
            className="h-[47px] rounded-md"
            src="https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white"
            alt="Render"
          />
          <img
            className="h-[47px] rounded-md"
            src="https://img.shields.io/badge/github%20pages-121013?style=for-the-badge&logo=github&logoColor=white"
            alt="GitHub Pages"
          />
        </div>
      ),
    },
    {
      label: "Mobile",
      value: "mobile",
      desc: (
        <div className="flex flex-wrap gap-2 ">
          <img
            className="h-[47px] rounded-md"
            src="https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37"
            alt="Expo"
          />
          <img
            className="h-[47px] rounded-md"
            src="https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"
            alt="React Native"
          />
          <img src="https://skillicons.dev/icons?i=supabase" />

          <img src="https://skillicons.dev/icons?i=androidstudio" />
        </div>
      ),
    },
    {
      label: "Desktop",
      value: "desktop",
      desc: (
        <div className="flex flex-wrap gap-2 ">
          <img src="https://skillicons.dev/icons?i=react" />
          <img src="https://skillicons.dev/icons?i=electron" />
          <img src="https://skillicons.dev/icons?i=supabase" />

          <img
            className="h-[47px] rounded-md"
            src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white"
            alt="React Router"
          />
        </div>
      ),
    },
    {
      label: "OS",
      value: "os",
      desc: (
        <div className="flex flex-wrap gap-2 ">
          <img src="https://skillicons.dev/icons?i=ubuntu" />
          <img src="https://skillicons.dev/icons?i=bash" />
          <img src="https://skillicons.dev/icons?i=linux" />
          <svg fill="#35bfa4" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="15%" height="auto">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M0 0v32h9v-23h11.5v-9zM11.5 11.5v20.5h9v-20.5zM23 0v32h9v-32z"></path>
            </g>
          </svg>
          <img src="https://skillicons.dev/icons?i=powershell" />
          <img src="https://skillicons.dev/icons?i=windows" />
        </div>
      ),
    },
    {
      label: "Other",
      value: "other",
      desc: (
        <div className="flex flex-wrap gap-2 ">
          <img src="https://skillicons.dev/icons?i=postman" />
          <img src="https://skillicons.dev/icons?i=md" />
          <img src="https://skillicons.dev/icons?i=python" />
          <img src="https://skillicons.dev/icons?i=github" />
          <img src="https://skillicons.dev/icons?i=git" />
          <img src="https://skillicons.dev/icons?i=githubactions" />
          <img
            className="h-[47px] rounded-md"
            src="https://img.shields.io/badge/Insomnia-black?style=for-the-badge&logo=insomnia&logoColor=5849BE"
            alt="Insomnia"
          />
        </div>
      ),
    },
  ];
  return (
    <div className="relative">
      <NavbarSticky className="sticky top-0 z-10 h-auto sticky-navbar" />
      <div id="short-about" className="short-about pt-[8vh]">
        <img alt="osmanbeyhan" className="image" src={osmanbeyhan} />
        <div className="welcome">
          <p id="hi">Hi, I am</p>
          <h1 id="name">Osman Beyhan!</h1>
          <h2 id="title">I am a Full-Stack Cross Platform Developer</h2>
          <p id="description">
            I coding database with <span className="lang">MongoDB</span>,
            routing with <span className="lang">ExpressJS</span>, design
            front-end with <span className="lang">React</span> and node these
            technologies together with <span className="lang">NodeJS</span>.
          </p>
        </div>
      </div>
      <div className="my-[40vh] max-w-[90%] mx-auto px-4 " id="skills">
        <h1 className="text-white text-2xl font-bold pb-3 border-b-2">
          <a href="#skills"># Skills</a>
        </h1>
        <div className="mt-5">
          {data.map(({ label, desc }) => (
            <div key={label} className="mb-10">
              <h2 className="text-white text-lg font-bold pb-3 "># {label}</h2>
              <div className="">{desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div id="about" className="my-[40vh] lg:max-w-[90%] lg:mx-auto px-4">
        <h1 className="text-white text-2xl font-bold  border-b-2 py-4">
          <a href="#about"># Who am I?</a>
        </h1>
        <div className=" lg:flex lg:gap-10 py-12">
          <img
            src="https://osmanbeyhan.onrender.com/assets/new-game-ahagon-umiko-programming-696c1737.gif"
            alt=""
            className="pb-12 rounded-lg"
          />
          <div>
            <h1 id="title" className="text-2xl font-bold">
              Hello!👋
            </h1>
            <p id="description-1" className="text-lg py-2">
              My name is Osman. I am a web developer living in Turkey. Let me
              tell you about myself a little bit; I like to create things and I
              learning programming and I've been coding for 4 years. Now I am{" "}
              {year - 2004} years old and I think I'am a young programmer so I
              have a lot to learn.
            </p>
            <p className="description-2 text-lg py-2">
              I have insatiable curiosity and I learning fastly so I want to use
              this feature for my career. My life philosophy; to learn and to
              teach what I have learned.
            </p>
            <p className="description-3 text-lg py-2">
              I love to learn because It is the reason for living that I have
              found for my meaningless life.
            </p>
            <p className="description-4 text-lg py-2">
              I love to teach because I think "The fastest way to learn is to
              teach".
            </p>
          </div>
        </div>
        <img
          src="https://github-readme-activity-graph.vercel.app/graph?username=osmn-byhn&bg_color=000000&color=9e4c98&line=9e4c98&point=ffffff&area=true&hide_border=true"
          alt=""
          className="w-full h-auto rounded-xl"
        />
        <img
          src="https://myreadme.vercel.app/api/embed/osmn-byhn?panels=userstatistics,toprepositories,toplanguages,commitgraph"
          alt="reimaginedreadme"
          className="w-full h-auto rounded-xl mt-5"
        />
      </div>

      <div id="projects" className=" my-[40vh] lg:max-w-[90%] lg:mx-auto px-4 ">
        <h1 className="text-white text-2xl font-bold pb-3 border-b-2 mb-12">
          <a href="#projects"># Projects</a>
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {dataGithub.map((repo, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4">
                <div>
                  <a href={repo.homepage}>
                    <h2 className="text-lg font-bold text-gray-800 hover:text-[#2007ff] cursor-pointer">
                      osmn-byhn / {repo.name}
                    </h2>
                  </a>
                </div>
                <div>
                  <img
                    className="h-16 w-16 rounded-full object-cover"
                    src="https://avatars.githubusercontent.com/u/104824448?v=4" // Replace with your image URL
                    alt="Profile"
                  />
                </div>
              </div>
              <div className="px-6 pt-1">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Watcher</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {repo.watchers}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Issues</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {repo.open_issues_count}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Star</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {repo.stargazers_count}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Forks</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {repo.forks_count}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap justify-center mt-4 text-center">
                {dataLanguage[index] && (
                  <ul className="flex flex-wrap justify-center gap-5 items-center">
                    {Object.keys(dataLanguage[index]).map((lang, j) => (
                      <li
                        className="text-black hover:text-[#2007ff] cursor-pointer"
                        key={j}
                      >
                        {lang}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex justify-end px-6 py-4">
                <a href={repo.html_url} className="text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 hover:text-[#2007ff] cursor-pointer"
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
          ))}
        </div>
      </div>
      <div id="docs" className="my-[40vh] lg:max-w-[90%] lg:mx-auto px-4">
        <h1 className="text-white text-2xl font-bold pb-3 border-b-2 mb-12">
          <a href="#docs"># Docs</a>
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {dataDocs.map((lang, i) => (
            <div key={i} className="relative">
              <iframe
                width="100%"
                className="rounded-xl h-[40vh]" // Tailwind CSS ile yüksekliği artırıyoruz
                frameBorder="0"
                marginHeight="0"
                marginWidth="0"
                scrolling="no"
                src={lang.homepage}
              ></iframe>
              <a
                href={lang.homepage}
                className="absolute inset-0"
                target="_blank"
                rel="noopener noreferrer"
              ></a>
            </div>
          ))}
        </div>
      </div>
      {/*<div id="history" className="my-[40vh] lg:max-w-[90%] lg:mx-auto px-4">
        <h1 className="text-white text-2xl font-bold pb-3 border-b-2 mb-12">
          <a href="#history"># History</a>
        </h1>
        
        <ul role="list" className="m-8">
          {history.map((event, index) => (
            <li
              key={index}
              className="group relative flex flex-col pb-8 pl-7 last:pb-0"
            >
              <div className="absolute bottom-0 left-[calc(0.25rem-0.5px)] top-0 w-px bg-white/10 group-first:top-3"></div>
              <div className="absolute left-0 top-2 h-2 w-2 rounded-full border border-sky-300 bg-zinc-950"></div>
              <h3 className="my-2 text-sm font-semibold text-white">
                {event.title}
              </h3>
              <p className="font-display text-2xs order-first font-semibold tracking-[0.2em] text-sky-300">
                <time>{event.date}</time>
              </p>
              <p className="mt-0.5 text-sm text-zinc-400">
                {event.description}
              </p>
            </li>
          ))}
        </ul>
      </div>*/}
      <section>
        <div id="history" className="bg-black text-white py-8">
          <h1 className="text-white text-2xl font-bold pb-3 border-b-2 mb-12  lg:max-w-[90%] lg:mx-auto px-4">
            <a href="#history"># History</a>
          </h1>
          <div className="container mx-auto flex flex-col items-start md:flex-row my-12 md:my-24">
            <div className="flex flex-col w-full sticky md:top-36 lg:w-1/3 mt-2 md:mt-12 px-8">
              <p className="ml-2 text-yellow-300 uppercase tracking-loose">
                My Chronological History
              </p>
              <p className="text-3xl md:text-4xl leading-normal md:leading-relaxed mb-2">
                Fastly My Working Process
              </p>
              <p className="text-sm md:text-base text-gray-50 mb-4">
                Here’s my learning and working process in a quick and
                chronological order
              </p>
            </div>
            <div className="ml-0 md:ml-12 lg:w-2/3 sticky">
              <div className="relative wrap overflow-hidden p-10 h-full">
                <div
                  className="absolute left-1/2 top-0 bottom-0 w-2 border border-yellow-500 bg-yellow-300 transform -translate-x-1/2"
                  style={{ borderColor: "#FFC100" }}
                ></div>
                {history.map((item, index) => (
                  <div
                    key={index}
                    className={`mb-8 flex justify-between items-center w-full ${
                      index % 2 === 0 ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div className="order-1 w-5/12"></div>
                    <div className="order-1 w-5/12 px-1 py-4">
                      <p className="mb-3 text-base text-yellow-300">
                        {item.date}
                      </p>
                      <h4 className="mb-3 font-bold text-lg md:text-2xl">
                        {item.title}
                      </h4>
                      <p className="text-sm md:text-base leading-snug text-gray-50 text-opacity-100">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <img
                className="mx -mt-36 md:-mt-36"
                src="https://user-images.githubusercontent.com/54521023/116968861-ef21a000-acd2-11eb-95ac-a34b5b490265.png"
                alt="Tech Fest"
              />
            </div>
          </div>
        </div>
      </section>
      <div className="max-w-screen-md mx-auto p-5 my-[10vh]">
      <div className="text-center mb-16">
        <p className="mt-4 text-sm leading-7 text-gray-100 font-regular uppercase">
          Contact
        </p>
        <h3 className="text-3xl sm:text-4xl leading-normal font-extrabold tracking-tight text-white">
          Get In <span className="text-indigo-600">Touch</span>
        </h3>
      </div>

      <form className="w-full" onSubmit={handleSubmit}>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-200 text-xs font-bold mb-2"
              htmlFor="firstName"
            >
              First Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Jane"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-200 text-xs font-bold mb-2"
              htmlFor="lastName"
            >
              Last Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-200 text-xs font-bold mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="email"
              name="email"
              type="email"
              placeholder="********@*****.**"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-200 text-xs font-bold mb-2"
              htmlFor="message"
            >
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="10"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-between w-full px-3">
            <div className="md:flex md:items-center">
              <label className="block text-gray-500 font-bold">
                <input
                  className="mr-2 leading-tight"
                  type="checkbox"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleChange}
                />
                <span className="text-sm">Send me your newsletter!</span>
              </label>
            </div>
            <button
              className="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded"
              type="submit"
            >
              Send Message
            </button>
          </div>
        </div>
      </form>
    </div>
    </div>
  );
}

export default App;
