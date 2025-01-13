import { UserButton, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Import framer-motion

function Header() {
  const { user } = useUser(); // Access user data using Clerk's useUser hook
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      setCurrentDateTime(now.toLocaleDateString(undefined, options));
    };

    // Initial update
    updateDateTime();

    // Update every second
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="p-5 shadow-xl bg-gradient-to-br bg-white border-b-2 flex flex-col sm:flex-row justify-between items-center">
      <div>
        <motion.h1
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 tracking-wide"
          initial={{ opacity: 0, y: -20 }} // Initial state for animation
          animate={{ opacity: 1, y: 0 }} // Animate to full opacity and default position
          transition={{ duration: 1 }} // Smooth transition
        >
          Hi {user?.fullName || "User"} 😄
        </motion.h1>
        <motion.p
          className="text-lg text-gray-600 mt-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2 }}
        >
          {currentDateTime}
        </motion.p>
      </div>

      <div className="ml-auto mt-4 sm:mt-0">
        {/* Wrapping UserButton with animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <UserButton />
        </motion.div>
      </div>
    </div>
  );
}

export default Header;
