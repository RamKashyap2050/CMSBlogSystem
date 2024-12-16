import React, { useState } from "react";
import axios from "axios";
import logo from "../asitravel.jpg"; // Replace with the correct path to your logo
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    message: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/users/contact", formData); // Adjust API endpoint as per your backend
      if (response.status === 200) {
        setSuccessMessage(
          "Message sent successfully! I'll get back to you soon."
        );
        setFormData({ user_name: "", email: "", message: "" }); // Clear form after successful submission
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setErrorMessage("Failed to send the message. Please try again later.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="Asitravel Logo"
            className="w-20 h-20 rounded-full object-cover shadow-lg mb-4"
          />
          <h1 className="text-4xl font-bold text-gray-800">Get in Touch</h1>
          <p className="text-gray-600 mt-2 text-center max-w-lg">
            Hi there! I'm Varsha, an avid traveler and explorer at heart.
            Whether you're looking for travel tips, itinerary ideas, or just
            want to chat about your next big adventure, I'm here to help!
          </p>
        </div>

        {/* Contact Form Section */}
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Why Reach Out to Me?
          </h2>
          <p className="text-gray-600 mb-6">
            Traveling has always been more than just visiting places for me—it's
            about the stories, the people, and the memories we create along the
            way. If you want personalized travel advice, need help crafting the
            perfect itinerary, or are curious about the best trekking spots, I’d
            love to share my experiences with you. Your journey starts here!
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="user_name"
                className="block text-gray-700 font-medium mb-2"
              >
                Your Name
              </label>
              <input
                type="text"
                id="user_name"
                value={formData.user_name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-gray-700 font-medium mb-2"
              >
                Your Message
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                placeholder="Let me know how I can help you!"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold rounded-lg py-3 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send Message
            </button>
          </form>

          {/* Success and Error Messages */}
          {successMessage && (
            <p className="text-green-600 mt-4 text-center">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="text-red-600 mt-4 text-center">{errorMessage}</p>
          )}
        </div>

        {/* Footer Section */}
        <div className="mt-12 text-center text-gray-600">
          <p>
            Thank you for visiting my world of travel and adventure on{" "}
            <strong>
              <a
                href="https://asitravel.in"
                className="text-blue-500 hover:underline"
              >
                asitravel.in
              </a>
            </strong>{" "}
            . Let’s connect and make your next journey unforgettable!
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
