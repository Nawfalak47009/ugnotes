'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Using the router for navigation
import { Button } from '@/components/ui/button';

const HomePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // State to track loading

  const handleGetStarted = () => {
    setLoading(true); // Set loading to true when the button is clicked
    setTimeout(() => {
      router.push('/dashboard'); // Navigate after a short delay (simulating loading)
    }, 1500); // Adjust the delay to match your desired loading time
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 text-center">
        UG NOTES
      </h1>
      <p className="text-lg sm:text-xl lg:text-2xl mb-6 text-center max-w-2xl">
        Your ultimate study companion for UG courses
      </p>
  
      <Button
        onClick={handleGetStarted}
        className={`${
          loading ? "bg-gray-600" : "bg-yellow-500 hover:bg-yellow-600"
        } text-black px-6 py-3 rounded-full text-lg font-semibold transition duration-300 flex items-center justify-center`}
        disabled={loading} // Disable button while loading
      >
        {loading ? (
          <div className="w-5 h-5 border-4 border-t-4 border-black rounded-full animate-spin"></div> // Loading spinner
        ) : (
          "Get Started"
        )}
      </Button>
    </div>
  );
  
};

export default HomePage;
