import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import SubscribersChart from "../components/SubscribersChart";
import TopInteractingUsers from "../components/TopInteractingUsers";
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [emails, setEmails] = useState([]);
  const [replyEmailId, setReplyEmailId] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    // Fetch users and emails
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get("/admin/api/users");
        setUsers(usersResponse.data);

        const emailsResponse = await axios.get("/admin/api/emails");
        setEmails(emailsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleIgnoreEmail = async (id) => {
    try {
      await axios.delete(`/admin/api/deleteEmail/${id}`);
      setEmails((prev) => prev.filter((email) => email._id !== id));
    } catch (error) {
      console.error("Error ignoring email:", error);
    }
  };

  const handleReplyEmail = async (id) => {
    if (!replyMessage.trim()) {
      alert("Please enter a reply message.");
      return;
    }

    try {
      await axios.post(`/admin/api/sendemailresponse/${id}`, {
        adminReply: replyMessage,
      });
      alert("Reply sent successfully!");
      setReplyEmailId(null);
      setReplyMessage("");
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  // Calculate subscriber data
  const subscriberCount = users.filter((user) => user.IsSubscriber).length;
  const nonSubscriberCount = users.length - subscriberCount;

  const chartData = {
    subscribers: subscriberCount,
    nonSubscribers: nonSubscriberCount,
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Admin Dashboard
        </h1>

        {/* Users Table */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Users</h2>
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="table-auto w-full text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-gray-600 font-semibold">#</th>
                  <th className="px-6 py-3 text-gray-600 font-semibold">
                    Profile
                  </th>
                  <th className="px-6 py-3 text-gray-600 font-semibold">
                    Name
                  </th>
                  <th className="px-6 py-3 text-gray-600 font-semibold">
                    Email
                  </th>
                  <th className="px-6 py-3 text-gray-600 font-semibold">
                    Subscriber
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 border-b last:border-none"
                  >
                    {/* Serial Number */}
                    <td className="px-6 py-4 text-gray-700">{index + 1}</td>

                    {/* Profile Picture */}
                    <td className="px-6 py-4">
                      <img
                        src={user.image || "https://via.placeholder.com/150"}
                        alt={user.user_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4 text-gray-700">
                      {user.user_name}
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-gray-700">{user.email}</td>

                    {/* Subscriber Status */}
                    <td className="px-6 py-4 text-gray-700">
                      {user.IsSubscriber ? (
                        <span className="text-green-600 font-semibold">
                          Yes
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subscribers Chart */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Subscribers Overview
          </h2>
          <div className="flex flex-wrap justify-between items-start space-y-4 lg:space-y-0">
            {/* Subscribers Chart */}
            <div className="w-full lg:w-1/2 flex-shrink-0">
              <SubscribersChart data={chartData} />
            </div>

            {/* Top Interacting Users */}
            <div className="w-full lg:w-1/2 flex-shrink-0">
              <TopInteractingUsers />
            </div>
          </div>
        </div>

        {/* Emails Table */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Emails Received
          </h2>
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="table-auto w-full text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-gray-600 font-semibold">#</th>
                  <th className="px-6 py-3 text-gray-600 font-semibold">
                    User Name
                  </th>
                  <th className="px-6 py-3 text-gray-600 font-semibold">
                    Email
                  </th>
                  <th className="px-6 py-3 text-gray-600 font-semibold">
                    Message
                  </th>
                  <th className="px-6 py-3 text-gray-600 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {emails.map((email, index) => (
                  <tr
                    key={email._id}
                    className={`border-b last:border-none ${
                      email.admin_reply
                        ? "bg-gray-100 text-gray-400 pointer-events-none" // Disabled look
                        : "hover:bg-gray-50 text-gray-700" // Normal look
                    }`}
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{email.user_name}</td>
                    <td className="px-6 py-4">{email.email}</td>
                    <td className="px-6 py-4">{email.message}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {email.admin_reply ? (
                          // If admin_reply exists, display the reply
                          <span className="italic">
                            Replied: {email.admin_reply}
                          </span>
                        ) : (
                          // If admin_reply does not exist, show the action buttons
                          <>
                            {/* Ignore Button */}
                            <button
                              className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-200"
                              onClick={() => handleIgnoreEmail(email._id)}
                              title="Ignore Email"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
                                />
                              </svg>
                            </button>

                            {/* Reply Button */}
                            <button
                              className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
                              onClick={() => setReplyEmailId(email._id)}
                              title="Reply to Email"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M3 10l7-7m0 0l7 7M10 3v18"
                                />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reply Section */}
        {replyEmailId && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Reply</h3>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="w-full h-40 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your reply message..."
              ></textarea>
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  onClick={() => {
                    setReplyEmailId(null);
                    setReplyMessage("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => handleReplyEmail(replyEmailId)}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;
