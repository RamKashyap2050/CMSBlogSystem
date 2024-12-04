import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto"; // Ensure you import the Chart.js for react-chartjs-2

const TopInteractingUsers = () => {
  const [users, setUsers] = useState([]); // Top interacting users data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const response = await axios.get("/admin/api/interactions"); // Replace with actual API endpoint
        setUsers(response.data); // Assuming API response is an array of users with `_id` and `count`
        setLoading(false);
      } catch (error) {
        console.error("Error fetching top interacting users:", error);
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, []);

  if (loading) {
    return <div>Loading top interacting users...</div>;
  }

  // Chart Data
  const data = {
    labels: users.map((user) => user.user_name), // User IDs as labels
    datasets: [
      {
        label: "Likes and Comments",
        data: users.map((user) => user.count), // Interaction counts
        backgroundColor: "rgba(54, 162, 235, 0.5)", // Bar color
        borderColor: "rgba(54, 162, 235, 1)", // Border color
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "User Names",
        },
      },
      y: {
        title: {
          display: true,
          text: "Likes and Comments",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Top Users With Likes and Comments</h2>

      {/* Chart Section */}
      <div className="h-96">
        <Bar data={data} options={options} />
      </div>

      {/* Data Table */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">User Details</h3>
        <table className="table-auto w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Rank</th>
              <th className="px-4 py-2">User Name</th>
              <th className="px-4 py-2">Interactions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} className="border-b">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{user.user_name}</td>
                <td className="px-4 py-2">{user.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopInteractingUsers;
