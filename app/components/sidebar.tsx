"use client";
import { useRouter, usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faKey,
  faGamepad,
  faUser,
  faGroupArrowsRotate,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useUser } from "../context/UserContext"; // ปรับ path ตามจริง

const mainMenuItems = [
  { name: "หน้าหลัก", icon: faHome, path: "/" },
  { name: "คลังคีย์เกม", icon: faKey, path: "/gamekey" },
  { name: "คีย์ล่าสุด", icon: faGamepad, path: "/recently_key" },
  { name: "หมวดหมู่", icon: faGroupArrowsRotate, path: "/category" },
  { name: "Subscription", icon: faUser, path: "/demographic" },
];

const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname(); // <-- ใช้ usePathname แยกออกมา
  const { logout } = useUser(); // สมมติว่ามี logout ใน context

  const handleLogout = () => {
    logout(); // เคลียร์สถานะผู้ใช้ เช่น token, user data
    router.push("/SignIn"); // ไปหน้า login/register
  };

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen  text-white p-6 border-r border-gray-700 z-50">
      <nav className="flex-1">
        <ul>
          {mainMenuItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link
                href={item.path}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  pathname === item.path
                    ? "bg-steam-blue text-white"
                    : "hover:bg-steam-light-bg"
                }`}
              >
                <FontAwesomeIcon icon={item.icon} className="mr-3 text-lg" />
                <span className="text-md">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="pt-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center p-3 rounded-lg transition-colors duration-200 hover:bg-steam-light-bg text-red-400 w-full text-left"
          type="button"
        >
          <FontAwesomeIcon icon={faUser} className="mr-3 text-lg" />
          <span className="text-md">ออกจากระบบ</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
