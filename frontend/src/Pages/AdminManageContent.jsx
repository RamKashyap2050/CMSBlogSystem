import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const AdminManageContent = () => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Hook to handle navigation

  useEffect(() => {
    // Fetch the blogs from the backend
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("/admin/api/getblogs");
        setBlogs(response.data); // Assume the response contains the blogs
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  const handleArchive = async (id) => {
    try {
      await axios.put(`/admin/api/archiveblog/${id}`);
      setMessage("Blog archived successfully.");
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === id ? { ...blog, archived: true } : blog
        )
      );
    } catch (error) {
      console.error("Error archiving blog:", error);
      setMessage("Failed to archive the blog.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/admin/api/deleteblog/${id}`);
      setMessage("Blog deleted successfully.");
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
    } catch (error) {
      console.error("Error deleting blog:", error);
      setMessage("Failed to delete the blog.");
    }
  };

  const handleEdit = (id) => {
    // Redirect to the edit blog page with the blog ID
    navigate(`/admin/editblog/${id}`);
  };

  const handleView = (id) => {
    // Redirect to the view single blog page with the blog ID
    navigate(`/adminviewsingleblog/${id}`);
  };

  return (
    <>
      <AdminNavbar />
      <div className="flex justify-end p-4">
        <Link
          to="/admincreateblog"
          className="flex items-center font-bold text-lg text-black no-underline"
        >
          Create Blogs
          <FaArrowRight className="ml-2" /> {/* Arrow Icon */}
        </Link>
      </div>{" "}
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Manage Content
        </h1>
        {message && (
          <div
            className={`text-center text-lg mb-6 ${
              message.includes("successfully") ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className={`bg-white shadow-md rounded-lg overflow-hidden transition-shadow hover:shadow-lg ${
                blog.archived ? "opacity-50" : ""
              }`}
            >
              <img
                src={blog.post_image}
                alt={blog.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2 truncate">
                  {blog.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4 truncate">
                  {blog.description}
                </p>
                <div className="flex justify-between items-center space-x-2">
                  <button
                    onClick={() => handleView(blog._id)}
                    className="flex-grow bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(blog._id)}
                    className="flex-grow bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleArchive(blog._id)}
                    className={`flex-grow ${
                      blog.archived
                        ? "bg-yellow-300 text-gray-600"
                        : "bg-yellow-500 text-white"
                    } px-4 py-2 rounded hover:bg-yellow-600 transition`}
                    disabled={blog.archived}
                  >
                    {blog.archived ? "Archived" : "Archive"}
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="flex-grow bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {blogs.length === 0 && (
          <p className="text-center text-gray-600 mt-10">No content found.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AdminManageContent;
