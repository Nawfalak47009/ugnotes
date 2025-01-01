'use client';

import React, { useState, useEffect } from 'react';
import ComingSoonPage from '../ComingSoon/page'; // Import the ComingSoon page
import { TEMPLATE } from './TemplateListSection';
import Image from 'next/image';
import Link from 'next/link';

function TemplateCard(item: TEMPLATE) {
  const [showComingSoon, setShowComingSoon] = useState(false); // State to manage showing Coming Soon
  const [loading, setLoading] = useState(false); // Optional loading state

  useEffect(() => {
    // Check if the ComingSoonPage has already been shown in this session
    const hasVisitedBefore = localStorage.getItem('hasVisited');

    if (!hasVisitedBefore) {
      setShowComingSoon(true); // Show Coming Soon if not visited before
      localStorage.setItem('hasVisited', 'true'); // Mark that the user has visited
    }

    const timeout = setTimeout(() => {
      setShowComingSoon(false); // Hide Coming Soon page after 15 seconds
    }, 15000); // 15 seconds delay

    return () => clearTimeout(timeout); // Cleanup timeout when the component unmounts
  }, []);

  if (showComingSoon) {
    return (
      <div className="absolute inset-0 bg-white flex items-center justify-center z-50">
        <ComingSoonPage />
      </div>
    ); // Full screen Coming Soon page for 15 seconds
  }

  return (
    <Link href={'/dashboard/content/' + item?.slug}>
      <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-200 hover:scale-105 transition-all ease-in-out transform hover:translate-y-2 hover:bg-blue-50 hover:shadow-[0_0_10px_5px_#ADD8E6] flex flex-col items-center justify-center">
        <div className="flex items-center justify-center mb-4">
          <Image
            src={item.icon}
            alt="icon"
            width={60}
            height={60}
            className="rounded-full border-2 border-blue-700 p-2 transition-all duration-200 transform hover:scale-110"
          />
        </div>
        <h2 className="font-semibold text-xl text-gray-800 text-center hover:text-blue-500 transition-all duration-200">
          {item.name}
        </h2>
        <p className="text-gray-500 text-sm line-clamp-3 text-center mt-2">{item.desc}</p>
      </div>
    </Link>
  );
}

export default TemplateCard;
