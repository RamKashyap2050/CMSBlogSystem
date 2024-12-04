import React, { useState } from "react";
import Footer from "../components/Footer";
import AdminNavbar from "../components/AdminNavbar";
import axios from "axios";
import { FaMagic } from "react-icons/fa"; // Magic icon

const AdminNewBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
  });

  const [image, setImage] = useState(null); // File state for image
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for magic button

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Set the selected file
  };

  const handleGenerateContent = async () => {
    if (!formData.title.trim()) {
      setMessage("Please enter a title to generate content.");
      return;
    }
    setLoading(true); // Show loading spinner
    setMessage(""); // Clear previous messages

    try {
      const response = await axios.post("/admin/api/generateContent", {
        title: formData.title,
      });

      // Accessing the nested 'data' object
      const { shortdescription, content } = response.data.data;

      console.log("Generated Short Description:", shortdescription);
      console.log("Generated Content:", content);

      // Updating form data with the generated content
      setFormData({
        ...formData,
        description: shortdescription,
        content: content,
      });

      setMessage("Content generated successfully!");
    } catch (error) {
      console.error("Error generating content:", error);
      setMessage("Failed to generate content. Please try again.");
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!image) {
        setMessage("Please select an image to upload.");
        return;
      }

      // Retrieve admin details from localStorage
      const adminData = JSON.parse(localStorage.getItem("Admin"));
      if (!adminData || !adminData._id) {
        setMessage("Admin information is missing. Please log in again.");
        return;
      }

      const formDataWithFile = new FormData();
      formDataWithFile.append("title", formData.title);
      formDataWithFile.append("description", formData.description);
      formDataWithFile.append("content", formData.content);
      formDataWithFile.append("image", image); // Append the file
      formDataWithFile.append("adminId", adminData._id); // Add AdminId

      const response = await axios.post(
        "/admin/api/createblog",
        formDataWithFile,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Blog Data Submitted:", response.data);
      setMessage("Blog created successfully!");
      setFormData({
        title: "",
        description: "",
        content: "",
      });
      setImage(null); // Reset image
    } catch (error) {
      console.error("Error creating blog:", error);
      setMessage("Failed to create the blog. Please try again.");
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="max-w-4xl w-full bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Create Content
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title with Magic Icon */}
            <div className="relative">
              <label
                htmlFor="title"
                className="block text-gray-700 font-medium mb-2"
              >
                Content Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter blog title and click on Magic to see the Magic :)"
                  required
                />
                <button
                  type="button"
                  onClick={handleGenerateContent}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600 focus:outline-none"
                  title="Generate Content"
                >
                  {loading ? (
                    <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                  ) : (
                    <FaMagic size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label
                htmlFor="media"
                className="block text-gray-700 font-medium mb-2"
              >
                Upload Image or Video
              </label>
              <input
                type="file"
                id="media"
                name="media"
                accept="image/*,video/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    console.log("File selected:", file); // Debugging
                    setImage(file);
                  } else {
                    console.log("No file selected.");
                  }
                }}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {image && (
                <div className="mt-4">
                  {image.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="w-full max-h-64 object-contain rounded-lg shadow-md"
                    />
                  ) : image.type.startsWith("video/") ? (
                    <video
                      controls
                      src={URL.createObjectURL(image)}
                      className="w-full max-h-64 object-contain rounded-lg shadow-md"
                    />
                  ) : (
                    <p className="text-red-500">
                      Unsupported file type for preview.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-gray-700 font-medium mb-2"
              >
                Short Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Enter a brief description of the blog"
                rows="3"
                required
              />
            </div>
            {/* Content */}
            <div>
              <label
                htmlFor="content"
                className="block text-gray-700 font-medium mb-2"
              >
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Enter detailed blog content"
                rows="8"
                required
              />
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Create Blog
            </button>
          </form>
          {/* Success/Error Message */}
          {message && (
            <p
              className={`text-center mt-4 ${
                message.includes("successfully")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminNewBlog;
