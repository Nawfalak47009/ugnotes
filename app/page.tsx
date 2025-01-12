'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const CircleUIPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGetStarted = () => {
    setLoading(true);
    setTimeout(() => {
      router.push('/dashboard'); // Navigate to the dashboard or any route you prefer
    }, 1500); // Simulate loading time
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 text-white relative overflow-hidden">
      {/* Title Section */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center z-10"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4">
          UG NOTES
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-xl mx-auto text-gray-100">
          A platform to access notes and study materials
        </p>
      </motion.div>

      {/* Circle Elements */}
      <div className="relative w-full h-full flex justify-center items-center z-0">
        {/* Large Circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, type: 'spring', stiffness: 60 }}
          className="absolute w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
        >
          <Image
            src="/creativity.png"
            alt="Central Circle Logo"
            width={80}
            height={80}
            priority
          />
        </motion.div>

        {/* Medium Circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="absolute w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 bg-teal-300 rounded-full -top-20 -left-20 lg:-top-32 lg:-left-32 shadow-md"
        ></motion.div>

        {/* Small Circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, delay: 0.6 }}
          className="absolute w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-purple-300 rounded-full -bottom-20 -right-20 lg:-bottom-32 lg:-right-32 shadow-sm"
        ></motion.div>
      </div>

      {/* Get Started Button */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="z-10 mt-8"
      >
        <button
          onClick={handleGetStarted}
          disabled={loading}
          className={`${
            loading ? 'bg-opacity-50 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'
          } px-8 py-4 rounded-full text-lg font-bold text-black shadow-lg transform transition-all duration-300 hover:scale-105`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-4 border-t-4 border-black rounded-full animate-spin mr-2"></div>
              <span>Loading...</span>
            </div>
          ) : (
            'Get Started'
          )}
        </button>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-6 text-sm text-gray-300 z-10"
      >
        2024@Ugnotes All Rights Reserved.
      </motion.footer>
    </div>
  );
};

export default CircleUIPage;
