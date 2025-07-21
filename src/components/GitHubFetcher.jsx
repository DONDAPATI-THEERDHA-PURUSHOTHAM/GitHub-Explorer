import React, { useState, useEffect } from "react";
import RepoChart from "./RepoChart";
import BookmarkAnalytics from "./BookmarkAnalytics";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function GitHubFetcher() {
  const [query, setQuery] = useState("");
  const [repos, setRepos] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [language, setLanguage] = useState("all");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState({});
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("stars");
  const [tags, setTags] = useState({});
  const [filterTag, setFilterTag] = useState("");

  const { isSignedIn } = useAuth();

  const token = localStorage.getItem("token");
  const axiosAuth = axios.create({
    baseURL: "/api",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const languages = [
    "all", "JavaScript", "Python", "Java", "C++",
    "TypeScript", "Go", "C#", "PHP", "Ruby",
  ];

  // Load bookmarks from backend on mount
  useEffect(() => {
    if (isSignedIn) {
      fetchBookmarksFromServer();
    }
  }, [isSignedIn]);

  const fetchBookmarksFromServer = async () => {
    try {
      const res = await axiosAuth.get("/repos/bookmarks");
      setBookmarks(res.data);
    } catch (err) {
      console.error("Failed to fetch bookmarks from backend", err);
    }
  };

  const searchRepos = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const langFilter = language !== "all" ? `+language:${language}` : "";
      const url = `https://api.github.com/search/repositories?q=${query}${langFilter}&sort=${sort}&order=desc&page=${page}`;
      const res = await fetch(url);
      const data = await res.json();
      setRepos(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      console.error("❌ Failed to fetch repositories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) searchRepos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") searchRepos();
  };

  const toggleBookmark = async (repo) => {
    const exists = bookmarks.some((r) => r.id === repo.id);
    if (exists) {
      // Optional: handle deletion
      alert("Unbookmarking not implemented via backend yet.");
      return;
    }
    try {
      const res = await axiosAuth.post("/repos/bookmark", { repo });
      setBookmarks([...bookmarks, res.data]);
    } catch (err) {
      console.error("Failed to save bookmark:", err);
    }
  };

  const handleNoteChange = (id, text) =>
    setNotes((prev) => ({ ...prev, [id]: text }));

  const handleTagChange = (id, text) =>
    setTags((prev) => ({ ...prev, [id]: text }));

  const filteredBookmarks = filterTag
    ? bookmarks.filter((r) =>
        tags[r.id]?.toLowerCase().includes(filterTag.toLowerCase())
      )
    : bookmarks;

  if (!isSignedIn) {
    return (
      <div className="text-center text-red-500 font-semibold mt-10">
        🔒 Please sign in to use GitHub Explorer.
      </div>
    );
  }

  return (
    <div className="p-4 text-white bg-gray-900 min-h-screen">
      {/* Search Controls */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          type="text"
          placeholder="Search GitHub repositories..."
          className="flex-1 p-2 rounded bg-gray-800 text-white outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <select
          className="p-2 rounded bg-gray-700 text-white"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang === "all" ? "All Languages" : lang}
            </option>
          ))}
        </select>
        <select
          className="p-2 rounded bg-gray-700 text-white"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="stars">Sort by Stars</option>
          <option value="updated">Recently Updated</option>
        </select>
        <button
          onClick={searchRepos}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Search
        </button>
      </div>

      {/* Pagination */}
      <div className="flex gap-2 mb-6 items-center">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="bg-gray-600 px-3 py-1 rounded"
        >
          ⬅ Prev
        </button>
        <span className="text-lg">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="bg-gray-600 px-3 py-1 rounded"
        >
          Next ➡
        </button>
      </div>

      <RepoChart repos={repos} loading={loading} />

      {/* Search Results */}
      {repos.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-green-300">🔍 Search Results</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {repos.map((repo) => (
              <div key={repo.id} className="bg-gray-800 p-4 rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">{repo.name}</h2>
                  <button
                    onClick={() => toggleBookmark(repo)}
                    className={`text-xl ${
                      bookmarks.some((r) => r.id === repo.id)
                        ? "text-yellow-400"
                        : "text-gray-400"
                    }`}
                  >
                    ★
                  </button>
                </div>
                <p className="text-gray-300">{repo.description}</p>
                <p className="text-sm mt-2 text-gray-400">
                  ⭐ {repo.stargazers_count} | 🧠 {repo.language || "Unknown"} | 🍴{" "}
                  {repo.forks_count} | 🐞 {repo.open_issues_count}
                </p>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-blue-400 hover:underline"
                >
                  View on GitHub
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      <BookmarkAnalytics bookmarks={bookmarks} />

      {/* Tag Filter */}
      <input
        type="text"
        placeholder="Filter bookmarks by tag..."
        className="p-2 rounded mb-6 bg-gray-800 text-white w-full max-w-md"
        value={filterTag}
        onChange={(e) => setFilterTag(e.target.value)}
      />

      {/* Bookmarked Repos */}
      {filteredBookmarks.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-yellow-300">⭐ Bookmarked Repos</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBookmarks.map((repo) => (
              <div key={repo.id} className="bg-gray-700 p-4 rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-green-400">{repo.name}</h2>
                  <button
                    onClick={() => toggleBookmark(repo)}
                    className="text-yellow-400 hover:text-yellow-200"
                  >
                    ★
                  </button>
                </div>
                <p className="text-gray-300">{repo.description}</p>
                <p className="text-sm mt-2 text-gray-400">
                  ⭐ {repo.stargazers_count} | 🧠 {repo.language || "Unknown"} | 🍴{" "}
                  {repo.forks_count} | 🐞 {repo.open_issues_count}
                </p>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-blue-400 hover:underline"
                >
                  View on GitHub
                </a>
                <textarea
                  className="w-full mt-3 p-2 rounded bg-gray-600 text-white text-sm"
                  placeholder="Write your notes here..."
                  rows="2"
                  value={notes[repo.id] || ""}
                  onChange={(e) => handleNoteChange(repo.id, e.target.value)}
                />
                <input
                  className="w-full mt-2 p-2 rounded bg-gray-600 text-white text-sm"
                  placeholder="Add tags (e.g. AI, Frontend)"
                  value={tags[repo.id] || ""}
                  onChange={(e) => handleTagChange(repo.id, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && <p className="text-center text-gray-400">Loading...</p>}
    </div>
  );
}

export default GitHubFetcher;
