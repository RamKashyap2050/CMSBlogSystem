import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Content */}
        <div className="flex flex-col sm:flex-row justify-between items-center">
          {/* Brand and Dedication */}
          <div className="text-center sm:text-left mb-6 sm:mb-0">
            <h1 className="text-xl font-bold text-blue-500">
              Asitravel: Adventure Awaits
            </h1>
            <p className="text-sm mt-2">
              Embark on a journey of discovery. Explore breathtaking landscapes
              and create unforgettable memories.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex space-x-4">
            <a
              href="https://www.facebook.com/share/14jUJjkoqkF/?mibextid=LQQJ4d"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://www.instagram.com/asitravel.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/varsha-rukmareddy-150b32106/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-center text-sm">
          <p>© 2024 Asitravel. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
