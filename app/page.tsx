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
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-r from-slate-500 to-black text-white">
      <h1 className="text-5xl font-bold mb-4">UG NOTES</h1>
      <p className="text-xl mb-6">Your ultimate study companion for UG courses</p>
      
      <Button
        onClick={handleGetStarted}
        className="bg-yellow-500 text-black px-6 py-3 rounded-full text-lg font-semibold hover:bg-yellow-600 transition duration-300"
        disabled={loading} // Disable button while loading
      >
        {loading ? (
          <div className="w-5 h-5 border-4 border-t-4 border-white rounded-full animate-spin"></div> // Loading spinner
        ) : (
          'Get Started'
        )}
      </Button>
    </div>
  );
};

export default HomePage;
