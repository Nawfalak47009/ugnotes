import { Search } from 'lucide-react';
import React from 'react';

function SearchSection({ onSearchInput }: any) {
  return (
    <div className='p-12 bg-gradient-to-br from-blue-200 via-blue-400 to-blue-500 text-white flex flex-col justify-center items-center rounded-lg shadow-lg'>
      <h2 className='text-4xl sm:text-5xl font-extrabold text-center mb-4'>
        Browse All Templates
      </h2>
      <p className='text-lg sm:text-xl mb-6'>
        What would you like to create today?
      </p>
      <div className='w-full flex justify-center'>
        <div className='flex gap-3 items-center p-4 border-2 border-white rounded-full bg-white shadow-md transition-all hover:scale-105'>
          <Search className='text-blue-500' />
          <input 
            type='text' 
            placeholder='Search...' 
            onChange={(event) => onSearchInput(event.target.value)} 
            className='bg-transparent w-full outline-none text-blue-500 font-semibold placeholder:text-gray-400' 
          />
        </div>
      </div>
    </div>
  );
}

export default SearchSection;
