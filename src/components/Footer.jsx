// src/components/Footer.jsx
import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-center text-white p-4">
      Developed by <strong>Arjun Porus Gowtham</strong> — Connect on{" "}
      <a
        href="https://linkedin.com/in/yourprofile"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:underline"
      >
        LinkedIn
      </a>{" "}
      |{" "}
      <a
        href="https://github.com/yourprofile"
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-400 hover:underline"
      >
        GitHub
      </a>
    </footer>
  );
}

export default Footer;
