"use client";
import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faEnvelope,
  faBell,
  faGift,
  faCog,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-64 right-0 h-[72px] bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white px-6 flex items-center justify-between shadow-md z-50">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-2xl font-bold text-white">
          KEYHUB
        </Link>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="ค้นหาเกมส์..."
            className="bg-gray-800 text-white w-full px-4 py-2 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-steam-blue"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm">Online</span>
        <div className="flex space-x-2">
          <div className="relative group">
            <button className="relative w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
              JS
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                9+
              </span>
            </button>
          </div>
          <FontAwesomeIcon
            icon={faEnvelope}
            className="text-lg hover:text-white cursor-pointer"
          />
          <FontAwesomeIcon
            icon={faBell}
            className="text-lg hover:text-white cursor-pointer"
          />
          <FontAwesomeIcon
            icon={faGift}
            className="text-lg hover:text-white cursor-pointer"
          />
        </div>
        <FontAwesomeIcon
          icon={faCog}
          className="text-lg hover:text-white cursor-pointer"
        />
        <FontAwesomeIcon
          icon={faUserCircle}
          className="text-lg hover:text-white cursor-pointer"
        />
      </div>
    </header>
  );
};

export default Header;
