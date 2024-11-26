import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import axios from "axios";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user details using the `/verify` endpoint
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/users/verify", {
          withCredentials: true, // Ensure cookies are sent with the request
        });
        setUser(response.data.user); // Set user data from the response
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setLoading(false); // Stop loading even on error
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800">Loading profile...</h1>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800">
          Please log in to view your profile.
        </h1>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            User Profile
          </h1>
          {/* User Details */}
          <div className="flex items-center space-x-6 mb-8">
            <img
              src={user.image || "https://via.placeholder.com/150"} // Use the `image` field from user data
              alt="Profile"
              className="w-24 h-24 rounded-full shadow-md"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {user.user_name} {/* Use the `user_name` field */}
              </h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <Link
              to="/saved-posts"
              className="block w-full text-center bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition"
            >
              View Saved Posts
            </Link>
            <Link
              to="/manage-subscriptions"
              className="block w-full text-center bg-green-500 text-white py-3 rounded hover:bg-green-600 transition"
            >
              Manage Subscriptions
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
