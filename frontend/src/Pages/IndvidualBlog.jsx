import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import ImageWithDimensionCheck from "../components/ImageWithDimensionCheck";

const IndividualBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [saved, setSaved] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [newComment, setNewComment] = useState("");

  const fetchAuthenticatedUser = async () => {
    try {
      const response = await axios.get(`/users/verify`, {
        withCredentials: true, // Ensure cookies are sent with the request
      });
      console.log("Authenticated User:", response.data);
      return response.data.user;
    } catch (error) {
      console.error(
        "User not authenticated:",
        error.response?.data || error.message
      );
      return null;
    }
  };

  // Example usage in your component:
  useEffect(() => {
    const getUser = async () => {
      const user = await fetchAuthenticatedUser();
      if (user) {
        console.log("User Info:", user);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/admin/api/getSingleBlog/${id}`);
        setBlog(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleLike = async (id) => {
    try {
      // Toggle likes locally for instant feedback
      setLikes((prevLikes) => (likes === 0 ? prevLikes + 1 : prevLikes - 1));

      // Fetch authenticated user details
      const user = await fetchAuthenticatedUser(); // Get user data via /verify
      if (!user) {
        console.error("User not authenticated");
        return;
      }

      // Send the like toggle request to the backend
      const response = await axios.post(`/users/blogs/like/${id}`, {
        userId: user._id, // Send user ID in the request body
      });

      // Optionally update the UI based on the response
      console.log("Updated liked_by:", response.data.liked_by);
    } catch (error) {
      console.error("Error toggling like:", error);
      // Rollback the like toggle in case of an error
      setLikes((prevLikes) => (likes === 0 ? prevLikes - 1 : prevLikes + 1));
    }
  };

  const handleSave = () => {
    setSaved((prevSaved) => !prevSaved);
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;

    try {
      const user = await fetchAuthenticatedUser(); // Get user data via /verify
      if (!user) {
        console.error("User not authenticated");
        return;
      }
      console.log(user._id);
      const response = await axios.post(`/users/blogs/comment/${id}`, {
        user_id: user._id,
        comment: newComment,
      });

      // Update comments with the new comment
      setBlog((prevBlog) => ({
        ...prevBlog,
        comments: [...prevBlog.comments, response.data],
      }));
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  console.log(blog);

  if (loading) {
    return <div className="text-center text-gray-500">Loading blog...</div>;
  }

  if (!blog) {
    return <div className="text-center text-red-500">Blog not found!</div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
        {/* Blog Content Section */}
        <div
          className={`transition-all duration-300 transform ${
            isCommentsOpen ? "lg:w-[70%] w-full" : "w-full"
          } p-6`}
        >
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-4">
            {blog.title}
          </h1>
          <div>
            <ImageWithDimensionCheck src={blog.post_image} alt={blog.title} />
          </div>

          <div className="mt-6 text-gray-700 text-lg leading-relaxed">
            {blog.content}
          </div>
          <div className="flex items-center space-x-2 mt-4">
            {/* Profile photos for users who liked the blog */}
            <div className="flex items-center -space-x-2">
              {blog.liked_by.slice(0, 5).map((user, index) => (
                <img
                  key={user._id}
                  src={user.image || "https://via.placeholder.com/150"} // Fallback profile photo
                  alt={user.user_name}
                  className={`w-8 h-8 rounded-full border-2 border-white ${
                    index > 0 ? "relative -ml-3" : "" // Overlapping effect for subsequent images
                  }`}
                />
              ))}
              {/* Remaining count badge */}
              {blog.liked_by.length > 5 && (
                <div className="w-8 h-8 bg-gray-300 text-gray-800 rounded-full flex items-center justify-center text-sm font-semibold border-2 border-white">
                  +{blog.liked_by.length - 5}
                </div>
              )}
            </div>
            {/* Text for like count */}
            <p className="text-sm text-gray-600">
              {blog.liked_by.length}{" "}
              {blog.liked_by.length === 1 ? "person likes" : "people like"} this
              blog
            </p>
          </div>

          <div className="mt-6 flex items-center space-x-6">
            {/* Like Button */}
            <button
              onClick={() => handleLike(blog._id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded ${
                blog.liked_by.includes("currentUserId") // Replace with actual user ID
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <span>👍</span>
              <span>
                {blog.liked_by.length}{" "}
                {blog.liked_by.length === 1 ? "Like" : "Likes"}
              </span>
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className={`flex items-center space-x-2 px-4 py-2 rounded ${
                saved ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              <span>📥</span>
              <span>{saved ? "Saved" : "Save"}</span>
            </button>

            {/* Comments Button */}
            <button
              onClick={() => setIsCommentsOpen((prev) => !prev)}
              className="flex items-center space-x-2 px-4 py-2 rounded bg-gray-200 text-gray-800"
            >
              <span>💬</span>
              <span>Comments</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div
          className={`transition-all duration-300 transform lg:w-[30%] ${
            isCommentsOpen
              ? "w-full opacity-100 visible"
              : "w-0 opacity-0 invisible"
          } bg-white shadow-lg`}
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Comments</h2>
            {/* Display Comments */}
            <div className="space-y-4">
              {blog.comments.length > 0 ? (
                blog.comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex flex-col space-y-2 bg-gray-100 p-4 rounded shadow-sm"
                  >
                    {/* User's Comment */}
                    <div className="flex items-start space-x-4 bg-gray-100 p-4 rounded-lg shadow-sm">
                      <img
                        src={
                          comment.user_id.image ||
                          "https://via.placeholder.com/150"
                        } // Fallback image
                        alt={comment.user_id.user_name}
                        className="w-12 h-12 rounded-full border border-gray-300 shadow"
                      />
                      <div className="flex-grow">
                        <div className="flex justify-between items-center">
                          {/* User Name */}
                          <h3 className="font-bold text-gray-800">
                            {comment.user_id.user_name}
                          </h3>
                          {/* Love by Author */}
                          {comment.admin_liked_comment && (
                            <div className="flex items-center space-x-2">
                              <span
                                role="img"
                                aria-label="Love by Author"
                                className="text-red-500 text-lg"
                              >
                                ❤️
                              </span>
                            </div>
                          )}
                        </div>
                        {/* User Comment */}
                        <p className="text-gray-600 mt-2">{comment.comment}</p>
                      </div>
                    </div>

                    {/* Admin Reply */}
                    {comment.admin_reply && (
                      <div className="flex items-start space-x-4 mt-4 ml-8 border-l-2 border-gray-300 pl-4">
                        {comment.admin_id && comment.admin_id.image && (
                          <img
                            src={
                              comment.admin_id.image ||
                              "https://via.placeholder.com/150"
                            } // Fallback image for admin
                            alt={
                              comment.admin_id.admin_name
                                ? comment.admin_id.admin_name
                                : ""
                            }
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <div>
                          <h3 className="font-bold text-blue-800">
                            {comment.admin_id &&
                              comment.admin_id.admin_name &&
                              comment.admin_id.admin_name}
                            {/* Verified Badge */}
                            <span title="Verified Admin">😎</span>
                          </h3>
                          <p className="text-gray-600">{comment.admin_reply}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No comments yet.</p>
              )}
            </div>

            {/* Add New Comment */}
            <div className="mt-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full h-20 p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddComment}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default IndividualBlog;
