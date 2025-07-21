// src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/repos/bookmarks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookmarks(res.data);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      }
    };

    if (token) {
      fetchBookmarks();
    }
  }, [token]);

  return (
    <div className="w-64 bg-gray-900 text-white p-4 h-screen overflow-auto">
      <h2 className="text-lg font-bold mb-4">Bookmarks</h2>
      {bookmarks.length === 0 ? (
        <p className="text-sm text-gray-400">No bookmarks found.</p>
      ) : (
        <ul className="space-y-2">
          {bookmarks.map((bookmark) => (
            <li key={bookmark._id} className="p-2 bg-gray-700 rounded hover:bg-gray-600">
              <div className="font-semibold">{bookmark.repoName}</div>
              <div className="text-xs text-gray-300">Last Seen: {new Date(bookmark.lastSeen).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
