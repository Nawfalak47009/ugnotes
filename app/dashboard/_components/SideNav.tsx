"use client";
import {
  FileClock,
  Home,
  Settings,
  Notebook,
  Bookmark,
  DollarSign,
  Contact,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import i18next from "../../i18n";

type MenuItem = {
  name: string;
  icon: React.ElementType;
  path: string;
};

const SideNav: React.FC = () => {
  const { t } = useTranslation();
  const [lang, setLang] = useState("en");
  const path = usePathname();

  const changeLanguage = (lng: string) => {
    i18next.changeLanguage(lng);
    setLang(lng);
  };

  const MenuList: MenuItem[] = [
    { name: t("Home"), icon: Home, path: "/dashboard" },
    { name: t("History"), icon: FileClock, path: "/dashboard/history" },
    { name: t("Notes"), icon: Notebook, path: "/dashboard/notes" },
    { name: t("Notes History"), icon: FileClock, path: "/dashboard/notes-history" },
    { name: t("Bookmarked Notes"), icon: Bookmark, path: "/dashboard/bookmarks" },
    { name: t("Expenses Tracker"), icon: DollarSign, path: "/dashboard/expenses" },
    { name: t("Settings"), icon: Settings, path: "/dashboard/settings" },
    { name: t("Contact"), icon: Contact, path: "/dashboard/contact" },
  ];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-white via-blue-50 to-blue-100 shadow-xl border-r border-gray-200">
      {/* Logo Section */}
      <div className="flex justify-center mt-8 mb-6">
        <Image src="/creativity.png" alt="logo" width={90} height={90} />
      </div>
      <hr className="border-gray-200 mb-4" />

      {/* Menu List (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-6 space-y-2">
        {MenuList.map((menu) => (
          <Link
            key={menu.path}
            href={menu.path}
            className={`flex items-center gap-5 p-4 rounded-xl transition-all ease-in-out duration-300
                        ${
                          path === menu.path
                            ? "bg-blue-600 text-white shadow-lg transform scale-105"
                            : "text-gray-500 hover:bg-blue-400 hover:text-blue-900 hover:shadow-md hover:transform hover:scale-105"
                        }`}
          >
            <menu.icon
              className={`h-6 w-6 ${
                path === menu.path ? "text-white" : "text-gray-400"
              }`}
            />
            <span className="font-semibold text-lg">{menu.name}</span>
          </Link>
        ))}
      </div>

      {/* Language Selector (Fixed at Bottom) */}
      <div className="px-6 py-4 bg-gray-100 flex items-center justify-between shadow-md border-t border-gray-300">
  <span className="font-medium text-gray-700">{t("Select Language")}</span>
  <div className="flex gap-2 border-2 border-blue-400 rounded-xl p-1 bg-white shadow-sm">
    <button
      className={`px-3 py-2 rounded-lg transition ${
        lang === "en" ? "bg-blue-600 text-white shadow-md" : "bg-gray-200 text-gray-700"
      }`}
      onClick={() => changeLanguage("en")}
    >
      🇬🇧 EN
    </button>
    <button
      className={`px-3 py-2 rounded-lg transition ${
        lang === "ru" ? "bg-blue-600 text-white shadow-md" : "bg-gray-200 text-gray-700"
      }`}
      onClick={() => changeLanguage("ru")}
    >
      🇷🇺 RU
    </button>
  </div>
</div>

    </div>
  );
};

export default SideNav;
