import React from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import '../temp.css';  // Importing styles

export default function Main() {
  // Define the links for navigation
  const links = [
    { label: "Journal", path: "/journal-archive", className: "test" },
    { label: "New Entry", path: "/Canvas", className: "test" },
    { label: "Analytics", path: "/Analytics", className: "test" },
    { label: "FAQ's", path: "/FAQ", className: "test" },
  ];

  return (
    <div className="list-group w-25 float-start">
      {/* Sidebar Frame */}
      <div className="frame p-3">
        <div className="rectangle" />
      </div>

      {/* Sidebar Links */}
      {links.map((link) => (
        <Link key={link.path} to={link.path} className="btn nav-btn">
          {link.label}
          <br />
        </Link>
      ))}

      {/* Bottom Line Section */}
      <div className="line">
        <div className="vector" />
      </div>
    </div>
  );
}