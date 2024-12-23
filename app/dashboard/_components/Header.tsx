import { UserButton, useUser } from '@clerk/nextjs';
import React from 'react';

function Header() {
  const { user } = useUser(); // Access user data using Clerk's useUser hook

  return (
    <div className='p-5 shadow-xl bg-gradient-to-br bg-white border-b-2 flex justify-between items-center'>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 tracking-wide">
        Hi {user?.fullName} 😄
      </h1>
      
      <div className='ml-auto'>
        {/* Wrapping the UserButton in a div to apply styles */}
        <UserButton/>
      </div>
    </div>
  );
}

export default Header;
