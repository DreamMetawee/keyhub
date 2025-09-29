"use client";

import { useCart } from "@/app/context/CartContext";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

// ✅ 1. เพิ่ม id (number) เข้าไปใน Interface
interface GameData {
  gameDetails: {
    id: number; // <-- สำคัญมาก! ต้องมี id ที่เป็นตัวเลขจาก API
    title: string;
    imageUrl?: string;
    category?: string;
    price: number;
  };
  availableStock: number;
}

const GameKeyPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const [gameData, setGameData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToCart } = useCart();

  useEffect(() => {
    if (!slug) return;
    const fetchGameDetails = async () => {
      try {
        // ตรวจสอบให้แน่ใจว่า API ของคุณ return id ของเกมมาด้วย
        const res = await fetch(`http://localhost:3000/api/game/${slug}`);
        if (!res.ok) throw new Error("Failed to fetch game data");
        const data = await res.json();
        setGameData(data);
      } catch (err: any) {
        setError(err.message || "Failed to load game data.");
      } finally {
        setLoading(false);
      }
    };
    fetchGameDetails();
  }, [slug]);

  // ✅ 2. แก้ไขฟังก์ชันนี้
  const handleAddToCart = () => {
    if (!gameData) return;
    addToCart({
      productId: gameData.gameDetails.id, // <-- ใช้ id (number)
      name: gameData.gameDetails.title,
      price: gameData.gameDetails.price, // <-- ใช้ price
    });
    alert(`"${gameData.gameDetails.title}" ถูกเพิ่มลงตะกร้าแล้ว!`);
  };

  if (loading)
    return (
      <div className="pt-20 px-4 md:px-8 bg-gray-900 min-h-screen text-white text-center">
        Loading game details...
      </div>
    );

  if (error || !gameData)
    return (
      <div className="pt-20 px-4 md:px-8 bg-gray-900 min-h-screen text-red-400 text-center">
        Error: {error || "Game not found."}
      </div>
    );

  return (
    <div className="pt-20 px-4 md:px-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">{gameData.gameDetails.title}</h1>
      <p className="text-gray-400 mb-2">
        Stock Available: {gameData.availableStock}
      </p>
      <p className="text-2xl font-semibold text-green-400 mb-6">
        ราคา: {gameData.gameDetails.price.toFixed(2)} บาท
      </p>
      <div className="mb-8">
        <button
          onClick={handleAddToCart}
          disabled={gameData.availableStock === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {gameData.availableStock > 0 ? "🛒 เพิ่มลงตะกร้า" : "สินค้าหมด"}
        </button>
      </div>
    </div>
  );
};

export default GameKeyPage;
