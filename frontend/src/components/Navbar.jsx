import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import logo from "../asitravel.jpg";

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
        <nav className="flex space-x-4 items-center">
          <Link
            to="/"
            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            About
          </Link>
          <Link
            to="/iternary"
            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            Itineraries
          </Link>
          <Link
            to="/contact"
            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            Contact
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
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              Login/Signup
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
