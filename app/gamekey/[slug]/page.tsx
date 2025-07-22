// app/gamekey/[slug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import React from "react";
import { FaSteam } from "react-icons/fa"; // Using react-icons for the Steam icon

const GameKeyPage = () => {
  const params = useParams();
  const slug = params.slug;

  // สมมุติข้อมูลผู้ขาย key (Mock data for key sellers)
  const gameKeySellers = [
    {
      seller: "CDKeys.com",
      gamecoverImage:
        "/img/god-of-war-ragnarok-playstation-5-game-playstation-store-united-states-cover.jpg", // ใช้ Path ที่คุณให้มา
      platformIcon: <FaSteam className="text-gray-500" size={20} />, // Steam icon
      platform: "Standard",
      region: "EU",
      price: "~฿1047",
      shopUrl: "#",
    },
    {
      seller: "Kinguin",
      // เพิ่มรูปปกเกมสำหรับรายการอื่นๆ ด้วยครับ หรือใช้ placeholder
      gamecoverImage: "/img/god-of-war-ragnarok-playstation-5-game-playstation-store-united-states-cover.jpg",
      platformIcon: <FaSteam className="text-gray-500" size={20} />,
      platform: "Standard",
      region: "EU",
      price: "~฿1083",
      shopUrl: "#",
    },
    {
      seller: "HRK Game",
      gamecoverImage: "/img/god-of-war-ragnarok-playstation-5-game-playstation-store-united-states-cover.jpg",
      platformIcon: <FaSteam className="text-gray-500" size={20} />,
      platform: "Standard",
      region: "EU",
      price: "~฿1111",
      shopUrl: "#",
    },
    {
      seller: "K4G",
      gamecoverImage: "/img/god-of-war-ragnarok-playstation-5-game-playstation-store-united-states-cover.jpg",
      platformIcon: <FaSteam className="text-gray-500" size={20} />,
      platform: "Standard",
      region: "EU",
      price: "~฿1111",
      shopUrl: "#",
    },
    {
      seller: "K4G",
      gamecoverImage: "/img/god-of-war-ragnarok-playstation-5-game-playstation-store-united-states-cover.jpg",
      platformIcon: <FaSteam className="text-gray-500" size={20} />,
      platform: "Standard",
      region: "GLOBAL",
      price: "~฿1125",
      shopUrl: "#",
    },
  ];

  return (
    <div className="pt-20 px-4 md:px-8 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">
        Game Keys for: {slug}
      </h1>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 py-3 px-6 bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
          <div className="col-span-1">ผู้ขาย</div>
          <div className="col-span-1">แพลตฟอร์ม</div>
          <div className="col-span-1">รุ่น</div>
          <div className="col-span-1">ภูมิภาค</div>
          <div className="col-span-1">ราคา</div>
          <div className="col-span-1 text-right"></div> {/* For the button */}
        </div>

        {/* Table Rows */}
        {gameKeySellers.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-6 gap-4 items-center py-4 px-6 border-b border-gray-200 last:border-b-0"
          >
            <div className="col-span-1 flex items-center space-x-3">
              {" "}
              {/* เพิ่ม space-x-3 เพื่อเว้นระยะระหว่างรูปกับชื่อ */}
              {item.gamecoverImage && ( // ตรวจสอบว่ามี gamecoverImage ก่อนแสดงผล
                <img
                  src={item.gamecoverImage}
                  alt={`${item.seller} game cover`}
                  className="w-10 h-10 rounded-md object-cover" // กำหนดขนาดและรูปทรงของรูปภาพ
                  // เพิ่ม onerror เพื่อจัดการกรณีที่รูปภาพโหลดไม่ได้ (แสดง placeholder)
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/40x40/cccccc/333333?text=N/A";
                    e.currentTarget.onerror = null; // ป้องกันการวนซ้ำ
                  }}
                />
              )}
              <span className="text-gray-800 font-medium">{item.seller}</span>
            </div>
            <div className="col-span-1 flex items-center gap-2">
              {item.platformIcon}
              <span className="text-gray-700">{item.platform}</span>
            </div>
            <div className="col-span-1 text-gray-700">{item.platform}</div>{" "}
            {/* Assuming "รุ่น" is also platform for now based on image */}
            <div className="col-span-1 text-gray-700">{item.region}</div>
            <div className="col-span-1 text-gray-900 font-bold">
              {item.price}
            </div>
            <div className="col-span-1 text-right">
              <a
                href={item.shopUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                สั่งซื้อ {/* เปลี่ยนข้อความเป็น "สั่งซื้อ" */}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameKeyPage;
