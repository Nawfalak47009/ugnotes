'use client';

import React, { useState, useEffect } from 'react';
import { TEMPLATE } from './TemplateListSection';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

function TemplateCard(item: TEMPLATE) {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisited');

    if (!hasVisitedBefore) {
      setShowComingSoon(true);
      localStorage.setItem('hasVisited', 'true');
    }

    const timeout = setTimeout(() => {
      setShowComingSoon(false);
    }, 15000);

    const userHasClicked = localStorage.getItem('hasClicked');
    if (userHasClicked === 'true') {
      setHasClicked(true);
    }

    return () => clearTimeout(timeout);
  }, []);

  const handleCardClick = () => {
    setHasClicked(true);
    localStorage.setItem('hasClicked', 'true');
  };

  return (
    <Link href={'/dashboard/content/' + item?.slug}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0px 12px 30px rgba(0, 90, 255, 0.15)",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="relative p-6 bg-white/60 backdrop-blur-xl shadow-lg border border-gray-200 rounded-3xl transition-all w-full h-[380px] flex flex-col items-center justify-between space-y-6 transform hover:scale-105"
        onClick={handleCardClick}
      >
        {/* Animated Icon with Soft Glow */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center justify-center w-[85px] h-[85px] bg-gradient-to-br from-blue-200 to-blue-400 rounded-full border-2 border-blue-300 shadow-md transition-all duration-300"
        >
          <Image
            src={item.icon}
            alt="icon"
            width={55}
            height={55}
            className="rounded-full p-2"
          />
          {/* Soft Glowing Ring */}
          <div className="absolute inset-0 w-full h-full bg-blue-300/20 rounded-full blur-md opacity-40 animate-pulse"></div>
        </motion.div>

        {/* Title with Soft Gradient */}
        <motion.h2
          className="font-semibold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-500 text-center hover:text-blue-600 transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
        >
          {item.name}
        </motion.h2>

        {/* Subtle Description Animation */}
        <motion.p
          className="text-gray-600 text-sm text-center line-clamp-3 hover:text-blue-500 transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
        >
          {item.desc}
        </motion.p>

        {/* Soft Rounded Button */}
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "#6ea8fe" }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2 bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all transform hover:bg-blue-500"
        >
          Explore Now
        </motion.button>

        {/* Elegant "New" Badge with Soft Glow */}
        {!hasClicked && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="absolute top-4 right-4 text-xs text-white bg-gradient-to-r from-orange-400 to-red-400 py-1 px-3 rounded-full shadow-md animate-pulse"
          >
            New ✨
          </motion.div>
        )}
      </motion.div>
    </Link>
  );
}

export default TemplateCard;
