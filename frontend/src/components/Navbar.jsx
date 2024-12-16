import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import logo from "../asitravel.jpg";
import {
  AiOutlineHome,
  AiOutlineVideoCamera,
  AiOutlineInfoCircle,
  AiOutlineBook,
  AiOutlineMail,
  AiOutlineUser,
  AiOutlineMenu
} from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const [user, setUser] = useState(null); // Store user data
  const [loading, setLoading] = useState(true); // Track authentication loading state
  const [dropdownOpen, setDropdownOpen] = useState(false); // Toggle dropdown

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get("/users/verify", {
          withCredentials: true,
        });
        setUser(response.data.user); // Set user data if authenticated
      } catch (error) {
        console.log("User is not authenticated or session has expired.");
      } finally {
        setLoading(false); // Set loading to false after check
      }
    };
    checkAuthentication();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/users/logout", {}, { withCredentials: true });
      setUser(null); // Clear user data on logout
      alert("You have successfully logged out!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-2 px-4">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Asitravel Logo"
            className="w-12 h-12 object-contain"
          />
        </div>
        {/* Navigation */}
        <nav className="hidden md:flex space-x-6 items-center text-gray-600">
          <Link
            to="/"
            className="flex items-center space-x-2 hover:text-gray-800 text-sm font-medium"
          >
            <AiOutlineHome size={20} />
          </Link>
          <Link
            to="/vlogspage"
            className="flex items-center space-x-2 hover:text-gray-800 text-sm font-medium"
          >
            <AiOutlineVideoCamera size={20} />
          </Link>
          <Link
            to="/about"
            className="flex items-center space-x-2 hover:text-gray-800 text-sm font-medium"
          >
            <AiOutlineInfoCircle size={20} />
          </Link>
          <Link
            to="/iternary"
            className="flex items-center space-x-2 hover:text-gray-800 text-sm font-medium"
          >
            <AiOutlineBook size={20} />
          </Link>
          <Link
            to="/contact"
            className="flex items-center space-x-2 hover:text-gray-800 text-sm font-medium"
          >
            <AiOutlineMail size={20} />
          </Link>
          {/* User Menu */}
          {loading ? (
            <div className="animate-pulse w-8 h-8 bg-gray-300 rounded-full"></div>
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center space-x-2"
              >
                <img
                  src={user.image}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 space-x-2"
                  >
                    <AiOutlineUser size={18} />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 space-x-2"
                  >
                    <FiLogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center space-x-2 hover:text-gray-800 text-sm font-medium"
            >
              <AiOutlineUser size={20} />
              <span>Login/Signup</span>
            </Link>
          )}
        </nav>
        {/* Mobile Menu Button */}
        <button
          className="block md:hidden"
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          <AiOutlineMenu size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      {dropdownOpen && (
        <div className="md:hidden flex flex-col space-y-2 px-4 pb-4">
          <Link
            to="/"
            className="flex items-center space-x-2 hover:text-gray-800 text-sm font-medium"
          >
            <AiOutlineHome size={20} />
            <span>Home</span>
          </Link>
          <Link
            to="/vlogspage"
            className="flex items-center space-x-2 hover:text-gray-800 text-sm font-medium"
          >
            <AiOutlineVideoCamera size={20} />
            <span>Vlogs</span>
          </Link>
          <Link
            to="/about"
            className="flex items-center space-x-2 hover:text-gray-800 text-sm font-medium"
          >
            <AiOutlineInfoCircle size={20} />
            <span>About</span>
          </Link>
          <Link
            to="/iternary"
            className="flex items-center space-x-2 hover:text-gray-800 text-sm font-medium"
          >
            <AiOutlineBook size={20} />
            <span>Iternary</span>
          </Link>
          <Link
            to="/contact"
            className="flex items-center space-x-2 hover:text-gray-800 text-sm font-medium"
          >
            <AiOutlineMail size={20} />
            <span>Contact</span>
          </Link>
          {user ? (
            <div className="flex flex-col space-y-2">
              <Link
                to="/profile"
                className="flex items-center space-x-2 hover:text-gray-800 text-sm font-medium"
              >
                <AiOutlineUser size={20} />
                <span>Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 hover:text-gray-800 text-sm font-medium"
              >
                <FiLogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center space-x-2 hover:text-gray-800 text-sm font-medium"
            >
              <AiOutlineUser size={20} />
              <span>Login/Signup</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
