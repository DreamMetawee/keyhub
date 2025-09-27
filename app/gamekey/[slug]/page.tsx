// app/gamekey/[slug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react"; // 💡 เพิ่ม useEffect, useState
import { FaSteam } from "react-icons/fa";
import { apiCall } from "@/app/lib/api"; // 🚀 Import API Helper

// 💡 สร้าง Type สำหรับข้อมูลที่เราคาดหวังจาก API
interface SellerItem {
  seller: string;
  platform: string;
  region: string;
  price: number; // เปลี่ยนเป็น number
  shopUrl: string;
  // เพิ่ม field อื่นๆ ตามที่ API ส่งกลับมา
}

interface GameData {
  gameDetails: {
    title: string;
    imageUrl: string;
    // เพิ่ม field ที่คุณต้องการใช้
  };
  mockSellerData: SellerItem[];
  availableStock: number;
}

const GameKeyPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const [gameData, setGameData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Logic การดึงข้อมูลจาก API เมื่อ Component โหลด
  useEffect(() => {
    if (!slug) return;

    const fetchGameDetails = async () => {
      try {
        // 🚀 CALL API: GET /api/games/[slug]
        const data = await apiCall<GameData>(`/games/${slug}`, {
          method: "GET",
        });
        setGameData(data);
        setError(null);
      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError(err.message || "Failed to load game data.");
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [slug]);

  // 3. แสดงสถานะ Loading/Error
  if (loading) {
    return (
      <div className="pt-20 px-4 md:px-8 bg-gray-900 min-h-screen text-white text-center">
        Loading game details...
      </div>
    );
  }

  if (error || !gameData) {
    return (
      <div className="pt-20 px-4 md:px-8 bg-gray-900 min-h-screen text-red-400 text-center">
        Error: {error || "Game not found."}
      </div>
    );
  }

  // 4. แสดงผลข้อมูลจริง
  return (
    <div className="pt-20 px-4 md:px-8 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">
        Game Keys for: {gameData.gameDetails.title}
        <span className="text-sm text-gray-400 ml-3">
          ({gameData.availableStock} in stock)
        </span>
      </h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 py-3 px-6 bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
          <div className="col-span-1">ผู้ขาย</div>
          <div className="col-span-1">แพลตฟอร์ม</div>
          <div className="col-span-1">รุ่น</div>
          <div className="col-span-1">ภูมิภาค</div>
          <div className="col-span-1">ราคา</div>
          <div className="col-span-1 text-right"></div>
        </div>

        {/* Table Rows */}
        {gameData.mockSellerData.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-6 gap-4 items-center py-4 px-6 border-b border-gray-200 last:border-b-0"
          >
            <div className="col-span-1 flex items-center space-x-3">
              {/* 💡 ใช้รูปภาพจาก gameData.gameDetails.imageUrl */}
              <img
                src={gameData.gameDetails.imageUrl || "/placeholder.jpg"}
                alt={`${item.seller} game cover`}
                className="w-10 h-10 rounded-md object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/40x40/cccccc/333333?text=N/A";
                  e.currentTarget.onerror = null;
                }}
              />
              <span className="text-gray-800 font-medium">{item.seller}</span>
            </div>
            <div className="col-span-1 flex items-center gap-2">
              <FaSteam className="text-gray-500" size={20} />
              <span className="text-gray-700">{item.platform}</span>
            </div>
            <div className="col-span-1 text-gray-700">{item.platform}</div>
            <div className="col-span-1 text-gray-700">{item.region}</div>
            <div className="col-span-1 text-gray-900 font-bold">
              {/* แสดงราคารูปแบบ บาทไทย */}
              {item.price.toFixed(2)} ฿
            </div>
            <div className="col-span-1 text-right">
              <a
                href={item.shopUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600"
              >
                สั่งซื้อ
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameKeyPage;
