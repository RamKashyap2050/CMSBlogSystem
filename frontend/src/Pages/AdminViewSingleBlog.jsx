import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import ImageWithDimensionCheck from "../components/ImageWithDimensionCheck"
import axios from "axios";

const AdminViewSingleBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyInputs, setReplyInputs] = useState({}); // Store replies for each comment ID

  useEffect(() => {
    // Fetch the blog details
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

  const handleReplyChange = (commentId, value) => {
    setReplyInputs((prevReplies) => ({
      ...prevReplies,
      [commentId]: value,
    }));
  };

  const handleAdminLikeCommentToggle = async (BlogId,commentId, currentLikeStatus) => {
    try {
      // Send PUT request to toggle like status
      const response = await axios.put(`/admin/api/toggleCommentLike/${BlogId}/${commentId}`, {
        admin_liked_comment: !currentLikeStatus,
      });
  
      // Update the local state to reflect changes
      setBlog((prevBlog) => ({
        ...prevBlog,
        comments: prevBlog.comments.map((comment) =>
          comment._id === commentId
            ? { ...comment, admin_liked_comment: response.data.admin_liked_comment }
            : comment
        ),
      }));
    } catch (error) {
      console.error("Error toggling admin like:", error);
    }
  };
  

  const handleReply = async (commentId) => {
    const reply = replyInputs[commentId]?.trim();
    if (!reply) return;

    try {
      let admin_id = null; // Declare admin_id outside the block

      const admin = localStorage.getItem("Admin");
      console.log(admin);
      if (admin) {
        const parsedAdmin = JSON.parse(admin); // Parse the string into an object
        admin_id = parsedAdmin._id; // Assign the admin ID
        console.log(admin_id);
      } else {
        console.log("No admin data found in localStorage.");
        return; // Exit early if admin is not found
      }

      const response = await axios.post(
        `/admin/api/addadminreply/${blog._id}`,
        {
          commentId,
          admin_id, // Send the correct admin ID
          reply,
        }
      );

      // Update the comments with the new reply
      setBlog((prevBlog) => ({
        ...prevBlog,
        comments: prevBlog.comments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                admin_reply: response.data.admin_reply,
                admin_id: response.data.admin_id,
              }
            : comment
        ),
      }));

      // Clear the reply input for this comment
      setReplyInputs((prevReplies) => ({
        ...prevReplies,
        [commentId]: "",
      }));
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading blog...</div>;
  }

  if (!blog) {
    return <div className="text-center text-red-500">Blog not found!</div>;
  }

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
        {/* Blog Content Section */}
        <div className="lg:w-[70%] w-full p-6">
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-4">
            {blog.title}
          </h1>
          <div>
            <ImageWithDimensionCheck src={blog.post_image} alt={blog.title} />
          </div>
          <div className="mt-6 text-gray-700 text-lg leading-relaxed">
            {blog.content}
          </div>
        </div>

        {/* Comments Section */}
        <div className="lg:w-[30%] w-full bg-white shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Comments</h2>
          {/* Display Comments */}
          <div className="space-y-4">
            {blog.comments.length > 0 ? (
              blog.comments.map((comment) => (
                <div
                  key={comment._id}
                  className="flex flex-col space-y-2 bg-gray-100 p-4 rounded shadow-sm"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={
                        comment.user_id.image ||
                        "https://via.placeholder.com/150"
                      }
                      alt={comment.user_id.user_name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 flex justify-between items-center">
                        {comment.user_id.user_name}
                        {/* Heart Icon */}
                        <button
                          onClick={() =>
                            handleAdminLikeCommentToggle(
                                blog._id,
                              comment._id,
                              comment.admin_liked_comment
                            )
                          }
                          className="focus:outline-none"
                        >
                          {comment.admin_liked_comment ? (
                            <span
                              className="text-red-500 text-xl"
                              role="img"
                              aria-label="Liked"
                            >
                              ❤️
                            </span>
                          ) : (
                            <span
                              className="text-gray-400 text-xl"
                              role="img"
                              aria-label="Not Liked"
                            >
                              🤍
                            </span>
                          )}
                        </button>
                      </h3>
                      <p className="text-gray-600">{comment.comment}</p>
                    </div>
                  </div>

                  {/* Admin Reply */}
                  {comment.admin_reply && (
                    <div className="ml-10 mt-2 bg-gray-50 p-2 rounded shadow-sm flex items-start space-x-4">
                      <img
                        src={
                          comment.admin_id?.image ||
                          "https://via.placeholder.com/150"
                        }
                        alt={comment.admin_id?.admin_name || "Admin"}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <h3 className="font-bold text-blue-800">
                          {comment.admin_id?.admin_name || "Admin"}
                        </h3>
                        <p className="text-gray-600">{comment.admin_reply}</p>
                      </div>
                    </div>
                  )}
                  {/* Add Reply Input */}
                  <div className="mt-2">
                    {comment.admin_reply ? (
                      // If admin_reply exists, display the reply
                      <></>
                    ) : (
                      // If admin_reply does not exist, show the input and button for adding a reply
                      <>
                        <textarea
                          value={replyInputs[comment._id] || ""}
                          onChange={(e) =>
                            handleReplyChange(comment._id, e.target.value)
                          }
                          placeholder="Write a reply..."
                          className="w-full h-10 p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleReply(comment._id)}
                          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Reply
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminViewSingleBlog;
