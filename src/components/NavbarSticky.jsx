import React from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faGithub,
  faLinkedin
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function StickyNavbar() {
  const [openNav, setOpenNav] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) setOpenNav(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const socialMedia = (
    <ul className="pt-1 mb-4 flex gap-2 lg:mb-0 lg:mt-0 lg:items-center lg:gap-6">
      <a href="https://github.com/osmn-byhn">
        <FontAwesomeIcon icon={faGithub} className="h-6 w-6 text-white" />
      </a>
      <a href="https://www.instagram.com/osmn-byhn/">
        <FontAwesomeIcon icon={faInstagram} className="h-6 w-6 text-white" />
      </a>
      <a href="https://www.linkedin.com/in/osman-beyhan-12304b23a">
        <FontAwesomeIcon icon={faLinkedin} className="h-6 w-6 text-white" />
      </a>
      <a href="mailto:developer@osmanbeyhan.com">
        <FontAwesomeIcon icon={faEnvelope} className="h-6 w-6 text-white" />
      </a>
    </ul>
  );

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography as="li" variant="small" color="blue-gray" className="p-1 font-normal">
        <a href="#skills" className="flex items-center">Skills</a>
      </Typography>
      <Typography as="li" variant="small" color="blue-gray" className="p-1 font-normal">
        <a href="#about" className="flex items-center">Who am I</a>
      </Typography>
      <Typography as="li" variant="small" color="blue-gray" className="p-1 font-normal">
        <a href="#projects" className="flex items-center">Projects</a>
      </Typography>
      <Typography as="li" variant="small" color="blue-gray" className="p-1 font-normal">
        <a href="#docs" className="flex items-center">Docs</a>
      </Typography>
      <Typography as="li" variant="small" color="blue-gray" className="p-1 font-normal">
        <a href="#history" className="flex items-center">History</a>
      </Typography>
      <Typography as="li" variant="small" color="blue-gray" className="p-1 font-normal">
        <a href="#contact" className="flex items-center">Contact</a>
      </Typography>
    </ul>
  );

  return (
    <Navbar className="fixed top-0 left-0 right-0 z-50  bg-black backdrop-blur-lg backdrop-filter bg-opacity-40 px-5 border-none w-[90%] ml-[5%] mt-2">
      <div className="flex justify-between text-blue-gray-900">
        <Typography as="a" href="/" className="mr-4 cursor-pointer py-1.5 font-medium">
          osmanbeyhan
        </Typography>
        <div className="flex items-center gap-4">
          <div className="mr-4 hidden lg:block">{navList}</div>
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </IconButton>
        </div>
        <div className="mr-4 hidden lg:block">{socialMedia}</div>
      </div>
      <MobileNav open={openNav} className="max-h-full">
        {navList}
        <hr className="mb-5"/>
        {socialMedia}
      </MobileNav>
    </Navbar>
  );
}
