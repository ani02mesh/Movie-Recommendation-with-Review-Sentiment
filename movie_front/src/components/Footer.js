import React from "react";
import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="text-center bg-neutral-500 bg-opacity-35 text-neutral-400 py-2">
      <p className="text-lg">Created By - Animesh Shedge</p>
      <div className="flex items-center justify-center gap-4 mt-2 text-xl">
        <Link to={"https://github.com/ani02mesh"}>
          <FaGithub />
        </Link>
        <Link to={"https://www.linkedin.com/in/animesh-shedge"}>
          <FaLinkedin />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
