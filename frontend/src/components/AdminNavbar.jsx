import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaBlog, FaMap, FaSignOutAlt } from "react-icons/fa";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Check if admin is logged in by checking localStorage
    const isAdmin = localStorage.getItem("Admin");
    if (!isAdmin) {
      // Redirect to admin login page if not logged in
      navigate("/loginadmin");
    }
  }, [navigate]);

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* Logo Section */}
        <div className="text-2xl font-bold flex items-center">
          <Link
            to="/admindashboard"
            className="hover:text-gray-300 flex items-center space-x-2"
          >
            <span>Admin Panel</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link
            to="/admincreateblog"
            className="text-gray-300 hover:text-yellow-400 transition flex items-center space-x-2"
          >
            <FaBlog />
            <span>Create Blog</span>
          </Link>
          <Link
            to="/admincreateiternary"
            className="text-gray-300 hover:text-yellow-400 transition flex items-center space-x-2"
          >
            <FaMap />
            <span>Create Itinerary</span>
          </Link>
          <Link
            to="/adminewsletter"
            className="block px-4 py-2 hover:bg-gray-700 text-right flex items-center space-x-2"
          >
            <span>Send Newsletter</span>
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("Admin"); // Remove admin data
              navigate("/loginadmin"); // Redirect to admin login
            }}
            className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600 transition flex items-center space-x-2"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </nav>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-yellow-400 focus:outline-none"
          >
            {isMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 top-12 bg-gray-900 text-white rounded-lg shadow-lg w-48 z-50">
              <Link
                to="/admincreateblog"
                className="block px-4 py-2 hover:bg-gray-700 text-right flex items-center space-x-2"
              >
                <FaBlog />
                <span>Create Blog</span>
              </Link>
              <Link
                to="/admincreateiternary"
                className="block px-4 py-2 hover:bg-gray-700 text-right flex items-center space-x-2"
              >
                <FaMap />
                <span>Create Itinerary</span>
              </Link>
              <Link
                to="/adminewsletter"
                className="block px-4 py-2 hover:bg-gray-700 text-right flex items-center space-x-2"
              >
                <span>Send Newsletter</span>
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("Admin"); // Remove admin data
                  navigate("/loginadmin"); // Redirect to admin login
                }}
                className="block w-full text-left px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition rounded-b-lg flex items-center space-x-2"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
