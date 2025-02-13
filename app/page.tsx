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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white relative overflow-hidden">
      {/* Title Section */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="text-center z-10"
      >
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-400 drop-shadow-2xl"
          initial={{ x: -200 }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 120 }}
        >
          ONE-NOTE AI
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl lg:text-2xl mb-4 max-w-xl mx-auto text-white bg-transparent"
          initial={{ x: 200 }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 120 }}
        >
          A platform to access notes and study materials
        </motion.p>
      </motion.div>

      {/* Parallax Scrolling Background */}
      <motion.div
        className="absolute w-full h-full bg-gradient-to-br from-blue-500 via-indigo-700 to-blue-800 z-0"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 60 }}
      ></motion.div>

      {/* Circle Elements with 3D Hover Effects */}
      <div className="relative w-full h-full flex justify-center items-center z-0">
        {/* Large Circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, type: 'spring', stiffness: 60 }}
          className="absolute w-56 sm:w-64 md:w-80 lg:w-96 h-56 sm:h-64 md:h-80 lg:h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center 
  shadow-[0_0_20px_#3b82f6,0_0_40px_#2563eb] ring-8 ring-blue-500 shadow-blue-500/90 
  animate-pulse transform hover:scale-110 hover:rotate-6 hover:shadow-[0_0_30px_#2563eb,0_0_60px_#1e40af] transition-all duration-300"
        >
          <Image
            src="/creativity.png"
            alt="Central Circle Logo"
            width={120}
            height={120}
            priority
            className="transform scale-110 hover:scale-125 transition-all duration-300"
          />
        </motion.div>


        {/* Medium Circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, delay: 0.4 }}
          className="absolute w-40 sm:w-48 md:w-64 lg:w-72 h-40 sm:h-48 md:h-64 lg:h-72 bg-gradient-to-tl from-purple-600 to-purple-400 rounded-full -top-16 -left-16 lg:-top-24 lg:-left-24 shadow-lg transform hover:scale-110 hover:rotate-6 transition-all duration-300"
        ></motion.div>

        {/* Small Circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, delay: 0.6 }}
          className="absolute w-28 sm:w-32 md:w-40 lg:w-48 h-28 sm:h-32 md:h-40 lg:h-48 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full -bottom-16 -right-16 lg:-bottom-24 lg:-right-24 shadow-sm transform hover:scale-110 hover:rotate-6 transition-all duration-300"
        ></motion.div>
      </div>

      {/* Get Started Button with Neon Effect */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, delay: 1 }}
        className="z-10 mt-8"
      >
        <button
          onClick={handleGetStarted}
          disabled={loading}
          className={`${loading ? 'bg-opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600'
            } px-10 py-4 sm:px-8 sm:py-3 md:px-10 md:py-4 lg:px-12 lg:py-5 rounded-full text-lg font-bold text-black shadow-xl transform transition-all duration-300 hover:scale-110 hover:shadow-2xl animate-pulse`}
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

      {/* Footer with Motion Animation */}
      <motion.footer
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-6 text-sm text-gray-300 z-10"
      >
        <p>&copy; 2024 ONE-NOTE AI. All Rights Reserved.</p>
      </motion.footer>

      {/* Interactive Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute w-24 h-24 bg-white rounded-full opacity-40 animate-ping"
          style={{
            left: '30%',
            top: '50%',
          }}
        ></motion.div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="absolute w-24 h-24 bg-white rounded-full opacity-30 animate-ping"
          style={{
            right: '15%',
            top: '20%',
          }}
        ></motion.div>
      </div>
    </div>
  );
};

export default CircleUIPage;