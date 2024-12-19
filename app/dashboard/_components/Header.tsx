import { UserButton } from '@clerk/nextjs'
import React from 'react'

function Header() {
  return (
    <div className='p-5 shadow-sm border-b-2 flex justify-between items-center'>
        <div className='ml-auto'>
            <UserButton />
        </div>
    </div>
  )
}

export default Header

