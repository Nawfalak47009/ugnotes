import { Search } from 'lucide-react'
import React from 'react'

function SearchSection({onSearchInput}:any) {
  return (
    <div className='p-10 bg-gradient-to-br from-slate-500 via-slate-600 text-white to-black flex flex-col justify-center items-center'>
      <h2 className=' text-3xl font-bold'>Browse All Templates</h2>
      <p>What  would like to create today?</p>
      <div className='w-full flex justify-center'>
        <div className='flex gap-2 items-center p-2 border rounded-md bg-white my-5  w-[30%]'>
            <Search className='text-primary'/>
            <input type='text' placeholder='Search...'
            onChange={(event)=>onSearchInput(event.target.value)}
             className='bg-transparent w-full outline-none text-primary' />
        </div>
      </div>
    </div>
  )
}

export default SearchSection
