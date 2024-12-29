import { UserButton, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";

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
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 tracking-wide">
          Hi {user?.fullName || "User"} 😄
        </h1>
        <p className="text-lg text-gray-600 mt-1">{currentDateTime}</p>
      </div>

      <div className="ml-auto mt-4 sm:mt-0">
        {/* Wrapping the UserButton in a div to apply styles */}
        <UserButton />
      </div>
    </div>
  );
}

export default Header;
