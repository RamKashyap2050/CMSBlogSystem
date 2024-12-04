import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

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
        <div className="text-2xl font-bold">
          <Link
            to="/admin"
            className="hover:text-gray-300 flex items-center space-x-2"
          >
            <span>Admin Panel</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6">
          <Link
            to="/admincreateblog"
            className="text-gray-300 hover:text-yellow-400 transition"
          >
            Create Content
          </Link>
          <Link
            to="/adminmanageblogs"
            className="text-gray-300 hover:text-yellow-400 transition"
          >
            Manage Content
          </Link>
          <Link
            to="/admincreateiternary"
            className="text-gray-300 hover:text-yellow-400 transition"
          >
            Create Itinerary
          </Link>
          <Link
            to="/adminmanageitineraries"
            className="text-gray-300 hover:text-yellow-400 transition"
          >
            Manage Itineraries
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("Admin"); // Remove admin data
              navigate("/loginadmin"); // Redirect to admin login
            }}
            className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </nav>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden relative group">
          <button className="text-yellow-400 focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          <div className="absolute right-0 top-8 bg-gray-900 text-white rounded-lg shadow-lg hidden group-focus-within:block w-48">
            <Link
              to="/admincreateblog"
              className="block px-4 py-2 hover:bg-gray-700 text-right"
            >
              Create Blog
            </Link>
            <Link
              to="/adminmanageblogs"
              className="block px-4 py-2 hover:bg-gray-700 text-right"
            >
              Manage Blogs
            </Link>
            <Link
              to="/admincreateiternary"
              className="block px-4 py-2 hover:bg-gray-700 text-right"
            >
              Create Itinerary
            </Link>
            <Link
              to="/adminmanageitineraries"
              className="block px-4 py-2 hover:bg-gray-700 text-right"
            >
              Manage Itineraries
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("Admin"); // Remove admin data
                navigate("/loginadmin"); // Redirect to admin login
              }}
              className="block w-full text-left px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition rounded-b-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
