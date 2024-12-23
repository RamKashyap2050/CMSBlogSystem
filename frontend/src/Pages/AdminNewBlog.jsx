import React, { useState } from "react";
import Footer from "../components/Footer";
import AdminNavbar from "../components/AdminNavbar";
import axios from "axios";
import { FaMagic, FaArrowRight } from "react-icons/fa"; // Magic icon
import { Link } from "react-router-dom";

const AdminNewBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contentSections: [{ text: "", image: null, preview: null }], // Dynamic sections for content
  });

  const [mainImage, setMainImage] = useState(null); // File state for the main image
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for magic button

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMainImageChange = (e) => {
    setMainImage(e.target.files[0]);
  };

  const handleContentSectionChange = (index, field, value) => {
    const updatedSections = [...formData.contentSections];
    updatedSections[index][field] = value;
    setFormData({ ...formData, contentSections: updatedSections });
  };

  const handleGenerateContent = async () => {
    if (!formData.title.trim()) {
      setMessage("Please enter a title to generate content.");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("/admin/api/generateContent", {
        title: formData.title,
      });

      const { shortdescription, content } = response.data.data;

      // Update both short description and first content section
      setFormData((prevData) => ({
        ...prevData,
        description: shortdescription,
        contentSections: prevData.contentSections.map((section, index) =>
          index === 0 ? { ...section, text: content } : section
        ),
      }));

      setMessage("Content generated successfully!");
    } catch (error) {
      console.error("Error generating content:", error);
      setMessage("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
  
    try {
      const adminData = JSON.parse(localStorage.getItem("Admin"));
      if (!adminData || !adminData._id) {
        setMessage("Admin information is missing. Please log in again.");
        return;
      }
  
      // Combine all text and URLs into a single string
      const finalContent = formData.contentSections
        .filter((section) => section.text || section.image) // Only include non-empty sections
        .map((section) => `${section.text}${section.image ? ` ${section.image}` : ""}`) // Combine text and image URL
        .join("\n"); // Use newline for better formatting
  
      // Prepare formData object to send to the backend
      const formDataWithFile = new FormData();
      formDataWithFile.append("title", formData.title);
      formDataWithFile.append("description", formData.description);
      formDataWithFile.append("content", finalContent); // Combined content
      formDataWithFile.append("adminId", adminData._id);
  
      // Include mainImage if it exists
      if (mainImage) {
        formDataWithFile.append("mainImage", mainImage); // Add the main image or video
      }
  
      // Make the API request with the FormData object
      const response = await axios.post(
        "/admin/api/createblog",
        formDataWithFile,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
  
      // Reset state on success
      setMessage("Blog created successfully!");
      setFormData({
        title: "",
        description: "",
        contentSections: [{ text: "", image: null, preview: null }],
      });
      setMainImage(null);
    } catch (error) {
      console.error("Error creating blog:", error);
      setMessage("Failed to create the blog. Please try again.");
    }
  };
  
  const handleImageUpload = async (file, index) => {
    try {
      console.log("Uploading file:", file);
  
      const formData = new FormData();
      formData.append("file", file);
  
      const response = await axios.post("/admin/api/uploadImage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      const { url } = response.data;
  
      // Update the content section with the uploaded image URL
      setFormData((prevFormData) => {
        const updatedSections = [...prevFormData.contentSections];
        updatedSections[index].image = url; // Store the URL instead of the file
  
        // Add a new empty section for future input
        updatedSections.push({ text: "", image: null, preview: null });
  
        return { ...prevFormData, contentSections: updatedSections };
      });
  
      console.log("Image uploaded successfully, URL:", url);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };
  
  
  return (
    <>
      <AdminNavbar />
      <div className="flex justify-end p-4">
        <Link
          to="/adminmanageblogs"
          className="flex items-center font-bold text-lg text-black no-underline"
        >
          Manage Blogs
          <FaArrowRight className="ml-2" />
        </Link>
      </div>
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="max-w-4xl w-full bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Create Content
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
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
                  title="Generate Short Description"
                >
                  {loading ? (
                    <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                  ) : (
                    <FaMagic size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Main Image */}
            <div>
              <label
                htmlFor="mainImage"
                className="block text-gray-700 font-medium mb-2"
              >
                Main Image
              </label>
              <input
                type="file"
                id="mainImage"
                accept="image/*"
                onChange={handleMainImageChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {mainImage && (
                <img
                  src={URL.createObjectURL(mainImage)}
                  alt="Main Preview"
                  className="w-full max-h-64 object-contain rounded-lg shadow-md mt-2"
                />
              )}
            </div>

            {/* Short Description */}
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

            {/* Dynamic Content Sections */}
            <div className="space-y-6">
              {formData.contentSections.map((section, index) => (
                <div key={index} className="border p-4 rounded-lg space-y-4">
                  <textarea
                    value={section.text}
                    onChange={(e) =>
                      handleContentSectionChange(index, "text", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Enter description for this section"
                    rows="3"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        handleImageUpload(e.target.files[0], index); // Pass the file first, then the index
                      }
                    }}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {section.preview && (
                    <img
                      src={section.preview}
                      alt={`Preview ${index}`}
                      className="w-full max-h-64 object-contain rounded-lg shadow-md mt-2"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Create Blog
            </button>
          </form>
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
