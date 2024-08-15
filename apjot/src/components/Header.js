'use client'

import React, { useState } from "react";
import { useUser } from "@/lib/context/user"; // Import the useUser hook
import Link from "next/link";

const Header = () => {
  const { current: user, logout } = useUser(); // Destructure the user from the useUser hook
  const [isOpen, setIsOpen] = useState(false); // State to track whether the navigation is open or closed

  const handleLogout = () => {
    logout();
  };

  const toggleNav = () => {
    setIsOpen(!isOpen); // Toggle the state to open or close the navigation
  };

  return (
    <div style={{ borderBottom: "1px solid whitesmoke" }}>
      <nav style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="logo">
          <a href="/">Apjot</a>
        </div>
        <div className={`navlinks ${isOpen ? "open" : ""}`}>
          <Link href="/">Home</Link>
          <Link href="/blog/">Blog</Link>
          <Link href="/about/">About</Link>
          {user && <Link href="/profile/">Profile</Link>}
         { user ? (
            <span onClick={handleLogout} style={{cursor:'pointer'}}>Log Out</span>
          ) : (
            <Link href="/auth/login">Log In</Link>
          ) }
        </div>
        <div className="hamburger-lines">
          {!isOpen && (
            <button className="hamburger" onClick={toggleNav}>
              <i className="fa-solid fa-bars"></i>
            </button>
          )}

          {/* Close button is only visible when the navigation is open */}
          {isOpen && (
            <button className="hamburger" onClick={toggleNav}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
