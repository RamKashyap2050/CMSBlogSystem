import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("/users/getblogs");
        console.log(response.data);
        setBlogs(response.data); // Assuming the API returns an array of blogs
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500">Loading blogs...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <section
        className="relative bg-cover bg-center h-[500px] flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1585986217770-f25e4fd55ed9?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8a2VkYXJrYW50aGF8ZW58MHx8MHx8fDA%3D')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30"></div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <h2 className="text-5xl font-extrabold text-white leading-tight">
            Your Next Adventure Awaits
          </h2>
          <p className="text-lg text-gray-200 mt-4">
            Embark on a journey of discovery. Explore breathtaking landscapes
            and create unforgettable memories.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-150"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-300"></div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={blog.post_image}
                alt={blog.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {blog.title}
                </h3>
                <p className="text-gray-600 mt-2">{blog.description}</p>
                <Link
                  to={`/blog/${blog._id}`}
                  className="inline-block mt-4 text-blue-500 hover:text-blue-700 font-semibold"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
