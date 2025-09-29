"use client";
import React, { useEffect, useState } from "react";
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
import Image from "next/image";
import axios from "axios";
import CartIcon from "./carticon"; // ✅ 1. Import CartIcon

interface UserProfile {
  username: string;
  avatar?: string;
}

const Header: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // This assumes you have an API to get the current user's profile
    // It should be protected and use a token to identify the user
    axios
      .get("/api/users/profile")
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Not logged in"));
  }, []);

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
      <div className="flex items-center space-x-6 relative">
        {" "}
        {/* Increased spacing */}
        <div className="flex items-center space-x-4">
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
          <FontAwesomeIcon
            icon={faCog}
            className="text-lg hover:text-white cursor-pointer"
          />

          {/* ✅ 2. Add the CartIcon component here */}
          <CartIcon />
        </div>
        {/* Profile */}
        <div className="relative">
          <button
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt="avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <FontAwesomeIcon
                icon={faUserCircle}
                className="text-2xl text-white"
              />
            )}
            <span className="text-sm">{user?.username || "Guest"}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
              <Link
                href="/profile"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)} // Close dropdown on click
              >
                โปรไฟล์ของฉัน
              </Link>
              <button
                onClick={() => alert("คุณสามารถเชื่อมระบบ logout ได้ตรงนี้")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                ออกจากระบบ
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
