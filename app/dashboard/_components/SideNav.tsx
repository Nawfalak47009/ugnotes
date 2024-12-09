"use client";
import { FileClock, Home, Settings, WalletCards } from 'lucide-react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'; // useRouter to programmatically navigate
import React, { useEffect } from 'react'
import Link from 'next/link'; // Use Link component for navigation

function SideNav() {
    const MenuList = [
        {
            name: 'Home',
            icon: Home,
            path: '/dashboard'
        },
        {
            name: 'History',
            icon: FileClock,
            path: '/dashboard/history'
        },
        {
            name: 'Settings',
            icon: Settings,
            path: '/dashboard/settings' // Ensure this is correct path
        },
    ];

    const path = usePathname(); // Get the current path
    const router = useRouter(); // Access router for programmatic navigation
    
    useEffect(() => {
        console.log(path); // You can remove this after debugging
    }, [path]);

    return (
        <div className="h-screen p-5 shadow-sm border">
            <div className="flex justify-center">
                <Image src={'/logo.svg'} alt='logo' width={90} height={90} />
            </div>
            <hr className="my-6 border" />

            <div className="mt-4">
                {MenuList.map((menu) => (
                    <Link
                        key={menu.path}
                        href={menu.path}
                        className={`flex gap-2 mb-2 p-3 hover:bg-primary hover:text-white rounded-lg cursor-pointer items-center
                        ${path === menu.path ? 'bg-primary text-white' : ''}`}
                    >
                        <menu.icon className="h-6 w-6" />
                        <h2 className="text-lg">{menu.name}</h2>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default SideNav;
