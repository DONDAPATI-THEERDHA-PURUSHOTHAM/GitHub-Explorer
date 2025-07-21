// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import GitHubFetcher from "./components/GitHubFetcher";
import Login from "./pages/login";
import Register from "./pages/register";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { useAuth } from "./context/AuthContext";

function App() {
  const { token, logout } = useAuth();

  return (
    <Router>
      <div className="flex h-screen flex-col">
        {/* Header */}
        <header className="bg-gray-800 text-white flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold">GitHub Project Explorer</h1>
          <nav className="space-x-4">
            {token ? (
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">
                  Login
                </Link>
                <Link to="/register" className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded">
                  Register
                </Link>
              </>
            )}
          </nav>
        </header>

        {/* Main layout: Sidebar + Content */}
        <div className="flex flex-grow overflow-hidden">
          {token && <Sidebar />} {/* Show sidebar if user is logged in */}

          <main className="flex-grow p-4 overflow-auto bg-gray-100">
            <Routes>
              <Route path="/" element={token ? <GitHubFetcher /> : <Navigate to="/login" />} />
              <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
