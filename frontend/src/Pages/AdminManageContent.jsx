import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import axios from "axios";

const AdminManageContent = () => {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null); // Tracks which blog is being edited
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value, // Dynamically update the corresponding field
    }));
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog._id);
    setEditForm({
      title: blog.title,
      content: blog.content,
      description: blog.description,
    });
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("/admin/api/getblogs");
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  const handleArchive = async (id) => {
    try {
      // Find the blog being updated to determine its current state
      const blogToToggle = blogs.find((blog) => blog._id === id);
      if (!blogToToggle) {
        throw new Error("Blog not found.");
      }
  
      // Toggle the archived state
      const newArchivedState = !blogToToggle.archived;
  
      // Update on the backend
      await axios.put(`/admin/api/archive/${id}`);
  
      // Update the state in the frontend
      setMessage(
        `Blog ${newArchivedState ? "archived" : "unarchived"} successfully.`
      );
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === id ? { ...blog, archived: newArchivedState } : blog
        )
      );
    } catch (error) {
      console.error("Error toggling blog archive state:", error);
      setMessage("Failed to toggle the blog archive state.");
    }
  };
  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/admin/api/delete/${id}`);
      setMessage("Blog deleted successfully.");
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
    } catch (error) {
      console.error("Error deleting blog:", error);
      setMessage("Failed to delete the blog.");
    }
  };

  const handleEditSave = async (id) => {
    try {
      const formData = new FormData();

      // Append only non-empty fields to FormData
      Object.entries(editForm).forEach(([key, value]) => {
        if (value.trim() !== "") {
          formData.append(key, value);
        }
      });

      await axios.put(`/admin/api/edit/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Blog updated successfully.");
      setEditingBlog(null);

      // Update the blogs in the state
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === id ? { ...blog, ...editForm } : blog
        )
      );
    } catch (error) {
      console.error("Error updating blog:", error);
      setMessage("Failed to update the blog.");
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Manage Content
        </h1>
        {message && (
          <div
            className={`text-center text-lg mb-6 ${
              message.includes("successfully")
                ? "text-green-500"
                : "text-red-500"
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
              {editingBlog === blog._id ? (
                <div className="p-4 space-y-4 bg-gray-100">
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={editForm.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded focus:outline-none"
                  />
                  <textarea
                    name="content"
                    placeholder="Content"
                    value={editForm.content}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded focus:outline-none"
                    rows={3}
                  />
                  <input
                    type="text"
                    name="description"
                    placeholder="Short Description"
                    value={editForm.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded focus:outline-none"
                  />
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleEditSave(blog._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingBlog(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
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
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/adminviewsingleblog/${blog._id}`)
                        }
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleArchive(blog._id)}
                        className={`${
                          blog.archived
                            ? "bg-green-500 text-white"
                            : "bg-yellow-500 text-white"
                        } px-4 py-2 rounded hover:bg-green-600`}
                      >
                        {blog.archived ? "Unarchive" : "Archive"}
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
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
