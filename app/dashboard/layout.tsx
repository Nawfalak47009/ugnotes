"use client"
import React, { useState } from 'react'
import SideNav from './_components/SideNav';
import Header from './_components/Header';

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  // Toggle SideNav visibility for mobile screens
  const toggleSideNav = () => setIsSideNavOpen(!isSideNavOpen);

  // Close the SideNav when a section is clicked (like "History")
  const handleSectionClick = () => {
    if (isSideNavOpen) {
      setIsSideNavOpen(false); // Close the side navigation when any section is clicked
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSideNav}
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-500 text-white p-3 rounded-full shadow-lg transition-transform duration-300 hover:scale-105"
        aria-label="Toggle Menu"
      >
        {isSideNavOpen ? "✕" : "☰"} {/* Cross or Hamburger icon */}
      </button>

      {/* SideNav for desktop */}
      <div
        className={`md:w-64 fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform duration-300 ${
          isSideNavOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:block z-40`}
      >
        <SideNav />
      </div>

      {/* Main content area */}
      <div className={`md:ml-64 ${isSideNavOpen ? 'overflow-hidden' : ''}`}>
        <Header />

        {/* Pass handleSectionClick to children (e.g., "History" section) */}
        <div className="p-4" onClick={handleSectionClick}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
