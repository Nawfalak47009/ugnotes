'use client';

import React, { useState, useEffect } from 'react';
import { TEMPLATE } from './TemplateListSection';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

function TemplateCard(item: TEMPLATE) {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [hasClicked, setHasClicked] = useState(false); // Track if the user clicked

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisited');

    if (!hasVisitedBefore) {
      setShowComingSoon(true);
      localStorage.setItem('hasVisited', 'true');
    }

    const timeout = setTimeout(() => {
      setShowComingSoon(false);
    }, 15000);

    // Check localStorage for hasClicked status
    const userHasClicked = localStorage.getItem('hasClicked');
    if (userHasClicked === 'true') {
      setHasClicked(true);
    }

    return () => clearTimeout(timeout);
  }, []);

  // Handle card click to hide "New" badge
  const handleCardClick = () => {
    setHasClicked(true);
    localStorage.setItem('hasClicked', 'true'); // Persist the click state in localStorage
  };

  return (
    <Link href={'/dashboard/content/' + item?.slug}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="relative p-6 bg-white shadow-xl rounded-3xl border border-gray-200 hover:shadow-2xl hover:bg-blue-100 transition-all transform hover:scale-110 w-full h-[360px] flex flex-col items-center justify-between space-y-4"
        onClick={handleCardClick} // Set clicked state when the card is clicked
      >
        {/* Icon with additional hover effect */}
        <motion.div
          whileHover={{ scale: 1.15, rotate: 15 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-[100px] h-[100px] bg-gradient-to-r from-blue-400 to-blue-600 rounded-full border-2 border-blue-700 shadow-lg transition-all duration-300 transform hover:scale-110"
        >
          <Image
            src={item.icon}
            alt="icon"
            width={60}
            height={60}
            className="rounded-full p-2 transition-transform"
          />
        </motion.div>

        {/* Title with 3D effect */}
        <motion.h2
          className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 text-center hover:text-blue-600 transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
        >
          {item.name}
        </motion.h2>

        {/* Description with hover animation */}
        <motion.p
          className="text-gray-600 text-sm text-center line-clamp-3 hover:text-blue-500 transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
        >
          {item.desc}
        </motion.p>

        {/* New Badge, visible only if not clicked */}
        {!hasClicked && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="absolute top-4 right-4 text-xs text-white bg-blue-600 py-1 px-3 rounded-full shadow-md"
          >
            New
          </motion.div>
        )}
      </motion.div>
    </Link>
  );
}

export default TemplateCard;
