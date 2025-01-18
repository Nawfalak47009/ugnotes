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
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

type MenuItem = {
  name: string;
  icon: React.ElementType;
  path: string;
};

const SideNav: React.FC = () => {
  const MenuList: MenuItem[] = [
    { name: "Home", icon: Home, path: "/dashboard" },
    { name: "History", icon: FileClock, path: "/dashboard/history" },
    { name: "Notes", icon: Notebook, path: "/dashboard/notes" },
    { name: "Notes History", icon: FileClock, path: "/dashboard/notes-history" },
    { name: "Bookmarked Notes", icon: Bookmark, path: "/dashboard/bookmarks" },
    { name: "Expenses Tracker", icon: DollarSign, path: "/dashboard/expenses" },
    { name: "Settings", icon: Settings, path: "/dashboard/settings" },
    { name: "Contact", icon: Contact, path: "/dashboard/contact" },
  ];

  const path = usePathname();

  return (
    <div className="h-screen bg-blue-500 shadow-xl border-r border-gray-300 overflow-y-auto relative pb-28">
      {/* Logo Section */}
      <div className="flex justify-center mt-8 mb-10">
        <Image src="/creativity.png" alt="logo" width={90} height={90} />
      </div>
      <hr className="border-gray-300 mb-4" />

      {/* Menu List */}
      <div className="mt-4 space-y-2 px-6">
        {MenuList.map((menu) => (
          <Link
            key={menu.path}
            href={menu.path}
            className={`flex items-center gap-5 p-4 rounded-xl transition-all ease-in-out duration-300
                        ${path === menu.path
              ? "bg-blue-800 text-white shadow-lg transform scale-105"
              : "text-gray-300 hover:bg-blue-600 hover:text-white hover:shadow-md hover:transform hover:scale-105"}`}
          >
            <menu.icon
              className={`h-6 w-6 ${
                path === menu.path ? "text-white" : "text-gray-400"
              }`}
            />
            <span className="font-medium text-lg">{menu.name}</span>
          </Link>
        ))}
      </div>

      {/* Custom Scrollbar */}
      <style jsx>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-thumb {
          background: #a5b4fc; /* Light blue */
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #6d8ff6; /* Slightly darker light blue */
        }
        ::-webkit-scrollbar-track {
          background: #f0f9ff; /* Very light blue */
        }
      `}</style>
    </div>
  );
};

export default SideNav;