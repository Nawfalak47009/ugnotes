"use client";
import { FileClock, Home, Settings, MessageCircle, Notebook } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation'; // usePathname to get current route
import React, { useEffect } from 'react';
import Link from 'next/link'; // Use Link component for navigation

type MenuItem = {
    name: string;
    icon: React.ElementType;
    path: string;
};

const SideNav: React.FC = () => {
    const MenuList: MenuItem[] = [
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
            name: 'Notes',
            icon: Notebook,
            path: '/dashboard/notes'
        },
        {
            name: 'Settings',
            icon: Settings,
            path: '/dashboard/settings'
        }
       
    ];

    const path = usePathname(); // Get the current path

    useEffect(() => {
        console.log(path); // You can remove this after debugging
    }, [path]);

    return (
        <div className="h-screen p-5 bg-gradient-to-r bg-blue-100 shadow-xl border-r border-gray-200">
            <div className="flex justify-center mb-10">
                <Image src={'/creativity.png'} alt='logo' width={90} height={90} />
            </div>
            <hr className="my-6 border-black" />

            <div className="mt-4 space-y-4">
                {MenuList.map((menu) => (
                    <Link
                        key={menu.path}
                        href={menu.path}
                        className={`flex gap-3 p-4 hover:bg-gradient-to-r hover:from-blue-200 hover:to-blue-400 hover:text-white rounded-lg cursor-pointer items-center transition-all ease-in-out duration-300
                        ${path === menu.path ? 'bg-gradient-to-r from-blue-300 to-blue-400 text-black' : 'text-black'}`}
                    >
                        <menu.icon className="h-6 w-6 text-black" />
                        <h2 className="text-lg font-semibold">{menu.name}</h2>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default SideNav;
