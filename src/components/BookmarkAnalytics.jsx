// src/components/BookmarkAnalytics.jsx
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

function BookmarkAnalytics({ bookmarks }) {
  if (!bookmarks || bookmarks.length === 0) return null;

  const totalStars = bookmarks.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const topRepo = bookmarks.reduce(
    (top, repo) => (repo.stargazers_count > top.stargazers_count ? repo : top),
    bookmarks[0]
  );

  const languageCounts = bookmarks.reduce((acc, repo) => {
    const lang = repo.language || "Unknown";
    acc[lang] = (acc[lang] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(languageCounts),
    datasets: [
      {
        label: "Languages",
        data: Object.values(languageCounts),
        backgroundColor: [
          "#60a5fa", // blue
          "#34d399", // green
          "#fbbf24", // yellow
          "#f87171", // red
          "#a78bfa", // purple
          "#fb923c", // orange
          "#4ade80", // lime
          "#c084fc", // violet
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <section className="bg-gray-900 text-white p-6 rounded-xl mb-8 shadow-xl">
      <header className="mb-6">
        <h2 className="text-3xl font-extrabold text-yellow-300 flex items-center gap-2">
          📊 Bookmark Analytics
        </h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3 text-lg">
          <p>
            🔖 <strong>{bookmarks.length}</strong> repositories bookmarked
          </p>
          <p>
            🌟 <strong>{totalStars}</strong> total stars collected
          </p>
          <p>
            🏆 Most Starred Repo:{" "}
            <a
              href={topRepo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline hover:text-blue-300 font-medium"
            >
              {topRepo.name} ({topRepo.stargazers_count} ⭐)
            </a>
          </p>
        </div>

        <div className="w-full max-w-md mx-auto md:mx-0">
          <Pie data={chartData} />
        </div>
      </div>
    </section>
  );
}

export default BookmarkAnalytics;
