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
        const response = await axios.get("/admin/api/getblogs");
        console.log(response.data)
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
        className="bg-cover bg-center h-64 flex items-center justify-center"
        style={{ backgroundImage: "url('https://example.com/hero-image.jpg')" }}
      >
        <div className="bg-black bg-opacity-50 p-8 rounded-lg">
          <h2 className="text-4xl text-white font-bold text-center">
            Adventure Awaits
          </h2>
          <p className="text-gray-300 text-center mt-2">
            Discover stories from around the world and plan your next journey.
          </p>
        </div>
      </section>
      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Latest Blogs
        </h2>
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
