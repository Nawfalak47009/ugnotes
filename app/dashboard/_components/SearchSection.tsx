import { Search } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

function SearchSection({ onSearchInput }: any) {
  return (
    <div className="p-12 bg-gradient-to-br from-blue-500 via-blue-500 to-blue-500 text-white flex flex-col justify-center items-center rounded-xl shadow-2xl">
      {/* Title */}
      <motion.h2
        className="text-4xl sm:text-5xl font-extrabold text-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        Browse All Templates
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        className="text-lg sm:text-xl mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
      >
        What would you like to create today?
      </motion.p>

      {/* Search Input with Animation */}
      <motion.div
        className="w-full flex justify-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          className="flex gap-3 items-center p-4 border-2 border-white rounded-full bg-white/30 backdrop-blur-md shadow-lg transition-all ease-in-out duration-300 hover:scale-105 hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileFocus={{ scale: 1.08 }}
        >
          {/* Animated Search Icon */}
          <motion.div
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-white/50 rounded-full shadow-md"
          >
            <Search className="text-black" />
          </motion.div>

          {/* Input Field with Glow on Focus */}
          <input
            type="text"
            placeholder="Search..."
            onChange={(event) => onSearchInput(event.target.value)}
            className="bg-transparent w-full outline-none text-black font-semibold placeholder:text-gray-300 focus:ring-4 focus:ring-blue-500 rounded-md transition-all px-2"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default SearchSection;
