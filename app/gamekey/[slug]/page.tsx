"use client";

import useCart from "@/app/lib/useCart"; // ตรวจสอบ Path ให้ถูกต้อง
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

// Interface ไม่ต้องมี GameKey แล้ว เพราะเราจะไม่แสดง Key ที่หน้านี้
interface GameData {
  gameDetails: {
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

  // ✅ FIX: เรียกใช้ Hook ด้วย ()
  const { addToCart } = useCart();

  useEffect(() => {
    if (!slug) return;

    const fetchGameDetails = async () => {
      try {
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

  const handleAddToCart = () => {
    if (!gameData) return;
    addToCart({
      productId: slug,
      name: gameData.gameDetails.title,
      totalPrice: gameData.gameDetails.price,
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

      {/* ❌ REMOVED: ลบส่วนแสดง Key ทั้งหมดออกจากหน้านี้ */}
      {/* ส่วนนี้ควรไปอยู่ในหน้าที่แสดง "คลัง Key" ของผู้ใช้หลังจากการซื้อ */}
    </div>
  );
};

export default GameKeyPage;
