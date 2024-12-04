import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineComment,
  AiOutlineSave,
  AiFillSave,
} from "react-icons/ai";
import axios from "axios";

const IndividualVlog = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [vlog, setVlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [saved, setSaved] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [newComment, setNewComment] = useState("");

  const fetchAuthenticatedUser = async () => {
    try {
      const response = await axios.get(`/users/verify`, {
        withCredentials: true,
      });
      setUser(response.data.user);
    } catch (error) {
      console.error("User not authenticated:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    const fetchVlog = async () => {
      try {
        const response = await axios.get(`/admin/api/getsinglevlog/${id}`);
        setVlog(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching vlog:", error);
        setLoading(false);
      }
    };

    fetchVlog();
    fetchAuthenticatedUser();
  }, [id]);

  const handleLike = async () => {
    try {
      setLikes((prevLikes) => (likes === 0 ? prevLikes + 1 : prevLikes - 1));
      if (!user) {
        console.error("User not authenticated");
        return;
      }
      await axios.post(`/users/vlogs/like/${id}`, { userId: user._id });
    } catch (error) {
      console.error("Error toggling like:", error);
      setLikes((prevLikes) => (likes === 0 ? prevLikes - 1 : prevLikes + 1));
    }
  };

  const handleSave = () => {
    setSaved((prevSaved) => !prevSaved);
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;

    try {
      if (!user) {
        console.error("User not authenticated");
        return;
      }
      const response = await axios.post(`/users/vlogs/comment/${id}`, {
        user_id: user._id,
        comment: newComment,
      });

      setVlog((prevVlog) => ({
        ...prevVlog,
        comments: [...prevVlog.comments, response.data],
      }));
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading vlog...</div>;
  }

  if (!vlog) {
    return <div className="text-center text-red-500">Vlog not found!</div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
        <div
          className={`transition-all duration-300 transform ${
            isCommentsOpen ? "lg:w-[70%] w-full" : "w-full"
          } p-6`}
        >
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-4">
            {vlog.title}
          </h1>
          <div>
            <video
              src={vlog.VideoUrl}
              controls
              className="w-full rounded-lg shadow-md"
            ></video>
          </div>

          <div className="mt-6 text-gray-700 text-lg leading-relaxed">
            {vlog.content}
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <div className="flex items-center -space-x-2">
              {vlog.liked_by.slice(0, 5).map((user, index) => (
                <img
                  key={user._id}
                  src={user.image || "https://via.placeholder.com/150"}
                  alt={user.user_name}
                  className={`w-8 h-8 rounded-full border-2 border-white ${
                    index > 0 ? "relative -ml-3" : ""
                  }`}
                />
              ))}
              {vlog.liked_by.length > 5 && (
                <div className="w-8 h-8 bg-gray-300 text-gray-800 rounded-full flex items-center justify-center text-sm font-semibold border-2 border-white">
                  +{vlog.liked_by.length - 5}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600">
              {vlog.liked_by.length}{" "}
              {vlog.liked_by.length === 1 ? "person likes" : "people like"} this
              vlog
            </p>
          </div>

          <div className="mt-6 flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`p-2 rounded-full transition ${
                vlog.liked_by.some((likedUser) => likedUser._id === user._id)
                  ? "bg-red-100 text-red-500"
                  : "bg-gray-200 text-gray-800"
              } hover:bg-red-200`}
              title="Like"
            >
              {vlog.liked_by.some((likedUser) => likedUser._id === user._id) ? (
                <AiFillHeart size={24} />
              ) : (
                <AiOutlineHeart size={24} />
              )}
            </button>
            <button
              onClick={handleSave}
              className={`p-2 rounded-full transition ${
                saved
                  ? "bg-green-100 text-green-500"
                  : "bg-gray-200 text-gray-800"
              } hover:bg-green-200`}
              title="Save"
            >
              {saved ? <AiFillSave size={24} /> : <AiOutlineSave size={24} />}
            </button>
            <button
              onClick={() => setIsCommentsOpen((prev) => !prev)}
              className="p-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
              title="Comments"
            >
              <AiOutlineComment size={24} />
            </button>
          </div>
        </div>

        <div
          className={`transition-all duration-300 transform lg:w-[30%] ${
            isCommentsOpen
              ? "w-full opacity-100 visible"
              : "w-0 opacity-0 invisible"
          } bg-white shadow-lg`}
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Comments</h2>
            <div className="space-y-4">
              {vlog.comments.length > 0 ? (
                vlog.comments.map((comment) => (
                  <div key={comment._id} className="flex items-start space-x-4">
                    <img
                      src={
                        comment.user_id.image || "https://via.placeholder.com/150"
                      }
                      alt={comment.user_id.user_name}
                      className="w-12 h-12 rounded-full border border-gray-300 shadow"
                    />
                    <div className="flex-grow">
                      <h3 className="font-bold text-gray-800">
                        {comment.user_id.user_name}
                      </h3>
                      <p className="text-gray-600 mt-2">{comment.comment}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No comments yet.</p>
              )}
            </div>
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

export default IndividualVlog;
