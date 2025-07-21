import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const generateColors = (count) => {
  const baseHue = 120;
  return Array.from({ length: count }, (_, i) => {
    const hue = (baseHue + i * 37) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  });
};

const RepoChart = ({ repos, loading }) => {
  const languageCounts = useMemo(() => {
    return repos.reduce((acc, repo) => {
      const lang = repo.language || "Unknown";
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {});
  }, [repos]);

  const total = Object.values(languageCounts).reduce((sum, count) => sum + count, 0);
  const labels = Object.keys(languageCounts);
  const data = Object.values(languageCounts).map((count) =>
    parseFloat(((count / total) * 100).toFixed(2))
  );
  const colors = generateColors(labels.length);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Repository % by Language",
        data,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#ffffff",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}%`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#ffffff",
          font: { weight: "bold", size: 12 },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        title: {
          display: true,
          text: "Languages",
          color: "#facc15",
          font: { size: 14, weight: "bold" },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value}%`,
          color: "#ffffff",
          font: { size: 12 },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        title: {
          display: true,
          text: "Percentage",
          color: "#86efac",
          font: { size: 14, weight: "bold" },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-800 rounded-lg p-4 shadow-lg">
        <p className="text-white text-lg">Loading chart...</p>
      </div>
    );
  }

  if (repos.length === 0) return null;

  return (
    <div className="w-full h-[400px] mb-10 bg-gray-900 rounded-lg p-6 shadow-md border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-yellow-300 text-center">
        📈 Repository Language Distribution
      </h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default RepoChart;
