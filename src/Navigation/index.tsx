import React from 'react';
import '../temp.css';
import { Link, useLocation } from "react-router-dom";
export default function Main() {
    const { pathname } = useLocation();
  const links = [
    { label: "Journal", path: "/Analytics", className: "test"},
    { label: "New Entry", path: "/Canvas", className:"test" },
    { label: "Analytics", path: "/Analytics", className: "test"},
    { label: "FAQ's", path: "/Canvas", className:"test" },
  ];
  return (
    
    <div className='main-container'>
      <div className='tabs-line'>
        <div className='tabs'>
          <div className='frame'>
            <div className='rectangle' />
          </div>
          {links.map((link) => ( <Link key={link.path} to={link.path} className="btn nav-btn">
        {link.label}
          <br />
        </Link>))}
        </div>
        <div className='line'>
          <div className='vector' />
        </div>
      </div>
    </div>
  );
}
