'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Using the router for navigation
import { Button } from '@/components/ui/button';
import Image from 'next/image'; // For the logo
import ComingSoonPage from './dashboard/ComingSoon/page'; // Import ComingSoonPage

const HomePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // State to track loading
  const [showComingSoon, setShowComingSoon] = useState(true); // State to manage the visibility of Coming Soon

  useEffect(() => {
    // Set a timeout of 15 seconds to hide the ComingSoonPage
    const timeout = setTimeout(() => {
      setShowComingSoon(false); // Hide Coming Soon page after 15 seconds
    }, 15000); // 15 seconds delay

    return () => clearTimeout(timeout); // Cleanup timeout when the component unmounts
  }, []);

  const handleGetStarted = () => {
    setLoading(true); // Set loading to true when the button is clicked
    setTimeout(() => {
      router.push('/dashboard'); // Navigate after a short delay (simulating loading)
    }, 1500); // Adjust the delay to match your desired loading time
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 text-black p-6 relative">
      {/* Show Coming Soon Page for 15 seconds */}
      {showComingSoon ? (
        <ComingSoonPage /> // Show the Coming Soon page initially
      ) : (
        <>
          {/* Logo Section */}
          <div className="mb-6">
            <Image src="/creativity.png" alt="UG Notes Logo" width={120} height={120} priority />
          </div>

          {/* Title Section */}
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4">
              UG NOTES
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-xl mx-auto">
              Your ultimate study companion for UG courses. Learn better, faster, and smarter.
            </p>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleGetStarted}
            className={`${
              loading ? 'bg-opacity-50 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'
            } px-8 py-4 rounded-full text-lg font-bold text-black shadow-lg transform transition-all duration-300 hover:scale-105`}
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-4 border-t-4 border-black rounded-full animate-spin mr-2"></div>
                <span>Loading...</span>
              </div>
            ) : (
              'Get Started'
            )}
          </Button>

          {/* Footer Section */}
          <footer className="absolute bottom-6 text-sm text-teal-800">
            2024@Startstreams All Rights Are Reserved.
          </footer>
        </>
      )}
    </div>
  );
};

export default HomePage;
