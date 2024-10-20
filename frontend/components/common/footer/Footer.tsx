import React from "react";

import {
  FaGithub,
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaWhatsapp,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="dark:bg-black flex flex-col items-center sm:items-start px-8 py-6 w-full">
      <div className="flex flex-col md:flex-row gap-10 justify-between items-center w-full">
        <div>copyright @ {new Date().getFullYear()} UI</div>
        <div className="flex flex-row gap-5 items-center">
          <a href="#">
            <FaGithub />
          </a>
          <a href="#">
            <FaFacebookF />
          </a>
          <a href="#">
            <FaInstagram />
          </a>
          <a href="#">
            <FaXTwitter />
          </a>
          <a href="#">
            <FaWhatsapp />
          </a>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Security</a>
        </div>
      </div>
    </footer>
  );
}
