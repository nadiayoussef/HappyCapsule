import React from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import '../temp.css';  // Importing styles

export default function Main() {
  // Define the links for navigation
  const links = [
    { label: "Journal", path: "/Journal/Journal-Archive", className: "test" },
    { label: "New Entry", path: "/Journal", className: "test" },
    { label: "Analytics", path: "/Journal/Analytics", className: "test" },
    { label: "FAQs", path: "/Journal/FAQ", className: "faq-page" },
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