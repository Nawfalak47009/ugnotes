'use client';

import React, { useState, useEffect } from 'react';
import ComingSoonPage from '../ComingSoon/page';
import { TEMPLATE } from './TemplateListSection';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

function TemplateCard(item: TEMPLATE) {
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisited');

    if (!hasVisitedBefore) {
      setShowComingSoon(true);
      localStorage.setItem('hasVisited', 'true');
    }

    const timeout = setTimeout(() => {
      setShowComingSoon(false);
    }, 15000);

    return () => clearTimeout(timeout);
  }, []);

  if (showComingSoon) {
    return (
      <div className="absolute inset-0 bg-white flex items-center justify-center z-50">
        <ComingSoonPage />
      </div>
    );
  }

  return (
    <Link href={'/dashboard/content/' + item?.slug}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="p-6 bg-white shadow-md rounded-2xl border border-gray-300 hover:shadow-lg hover:bg-blue-50 transition-all transform hover:scale-105 w-full h-[360px] flex flex-col items-center justify-between space-y-4"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-[100px] h-[100px] bg-blue-100 rounded-full border-2 border-blue-700 shadow-sm"
        >
          <Image
            src={item.icon}
            alt="icon"
            width={60}
            height={60}
            className="rounded-full p-2 transition-transform"
          />
        </motion.div>
        <h2 className="font-bold text-lg text-gray-800 text-center hover:text-blue-500 transition-colors duration-200">
          {item.name}
        </h2>
        <p className="text-gray-600 text-sm text-center line-clamp-3">
          {item.desc}
        </p>
      </motion.div>
    </Link>
  );
}

export default TemplateCard;



