"use client";
import { 
    FileClock, 
    Home, 
    Settings, 
    Notebook, 
    Bookmark, 
    DollarSign, 
    Contact,
    Currency,
} from 'lucide-react'; 
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
            name: 'Notes History',
            icon: FileClock, 
            path: '/dashboard/notes-history'
        },
        {
            name: 'Bookmarked Notes',
            icon: Bookmark,
            path: '/dashboard/bookmarks'
        },
        {
            name: 'Expenses Tracker',
            icon: DollarSign,
            path: '/dashboard/expenses'
        },
        {
            name: 'Currency convetor',
            icon: Currency,
            path: '/dashboard/currency-convetor'
        },
        {
            name: 'Settings',
            icon: Settings,
            path: '/dashboard/settings'
        },
        {
            name: 'Contact', // New Calendar Scheduler section
            icon: Contact,
            path: '/dashboard/contact' // Link to the Scheduler page
        },
    ];

    const path = usePathname(); // Get the current path

    useEffect(() => {
        console.log(path); // Debugging purpose
    }, [path]);

    return (
        <div className="h-screen bg-gradient-to-r from-blue-50 to-blue-200 shadow-lg border-r border-gray-300 overflow-y-auto">
            {/* Logo Section */}
            <div className="flex justify-center mt-6 mb-8">
                <Image src={'/creativity.png'} alt="logo" width={80} height={80} />
            </div>
            <hr className="border-gray-300" />

            {/* Menu List */}
            <div className="mt-4 space-y-2 px-4">
                {MenuList.map((menu) => (
                    <Link
                        key={menu.path}
                        href={menu.path}
                        className={`flex items-center gap-4 p-3 rounded-lg transition-all ease-in-out duration-300 
                        ${
                            path === menu.path
                                ? 'bg-blue-500 text-white shadow-md'
                                : 'text-gray-600 hover:bg-blue-300 hover:text-white'
                        }`}
                    >
                        <menu.icon 
                            className={`h-6 w-6 ${
                                path === menu.path ? 'text-white' : 'text-gray-500'
                            }`}
                        />
                        <span className="font-medium text-md">{menu.name}</span>
                    </Link>
                ))}
            </div>

            {/* Custom Scrollbar */}
            <style jsx>{`
                ::-webkit-scrollbar {
                    width: 8px;
                }
                ::-webkit-scrollbar-thumb {
                    background: #3b82f6; /* Tailwind blue-500 */
                    border-radius: 4px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #2563eb; /* Tailwind blue-600 */
                }
                ::-webkit-scrollbar-track {
                    background: #e5e7eb; /* Tailwind gray-200 */
                }
            `}</style>
        </div>
    );
};

export default SideNav;
