import React from 'react';
import '../temp.css';
import { Link, useLocation } from "react-router-dom";
export default function Main() {
  const links = [
    { label: "Journal", path: "/Analytics", className: "test"},
    { label: "New Entry", path: "/Canvas", className:"test" },
    { label: "Analytics", path: "/Analytics", className: "test"},
    { label: "FAQ's", path: "/Canvas", className:"test" },
  ];
  return (
    
    <div className='list-group w-25 float-start'>
          <div className='frame p-3'>
            <div className='rectangle' />
          </div>
          {links.map((link) => ( <Link key={link.path} to={link.path} className="btn nav-btn">
        {link.label}
          <br />
        </Link>))}
        <div className='line'>
          <div className='vector' />
        </div>
      </div>
  );
}
