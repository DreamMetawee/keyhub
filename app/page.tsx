"use client";

import { useEffect, useState, MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import {useCart} from "@/app/context/CartContext";

type Game = {
  id: string; // id จาก API ยังคงเป็น string
  title: string;
  slug: string;
  price: number;
  discount?: number;
  imageUrl?: string;
  category?: string;
};

export default function GameCatalogPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchGames() {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3000/api/game");
        if (!res.ok) throw new Error("Failed to fetch games");
        const data = await res.json();
        setGames(data);
      } catch (err: any) {
        console.error("Fetch Games Error:", err);
        setError("ไม่สามารถโหลดข้อมูลเกมได้");
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, []);

  // ✅ แก้ไขฟังก์ชันนี้
  const handleAddToCart = (e: MouseEvent, game: Game) => {
    e.preventDefault();
    e.stopPropagation();

    const finalPrice = game.discount
      ? game.price - (game.price * game.discount) / 100
      : game.price;

    addToCart({
      productId: Number(game.id), // <-- แปลง id เป็น number ตาม CartItem interface
      name: game.title,
      price: finalPrice, // <-- เปลี่ยนชื่อเป็น price ตาม CartItem type
    });
    alert(`เพิ่ม "${game.title}" ลงตะกร้าแล้ว!`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-bold text-white">
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-xl font-bold">
        {error}
      </div>
    );
  }
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">🎮 รายการเกม</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-white shadow-md rounded-2xl overflow-hidden flex flex-col group"
          >
            {/* รูปเกม */}
            <div className="relative aspect-video bg-gray-200 overflow-hidden">
              <Link href={`/gamekey/${game.slug}`}>
                {game.imageUrl ? (
                  <Image
                    src={`http://localhost:3000${game.imageUrl}`} // full URL
                    alt={game.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No Image
                  </div>
                )}
              </Link>
            </div>

            {/* ข้อมูลเกม */}
            <div className="p-4 flex flex-col flex-grow">
              <Link href={`/gamekey/${game.slug}`}>
                <h2 className="text-lg font-semibold hover:text-blue-600 transition-colors truncate">
                  {game.title}
                </h2>
              </Link>
              <p className="text-sm text-gray-500 mb-2">
                {game.category ?? "ทั่วไป"}
              </p>

              {/* ส่วนล่างของการ์ด (ราคาและปุ่ม) */}
              <div className="mt-auto pt-2">
                <div className="mb-3 h-8">
                  {" "}
                  {/* กำหนดความสูงคงที่ */}
                  {game.discount && game.discount > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 font-bold text-lg">
                        {(
                          game.price -
                          (game.price * game.discount) / 100
                        ).toFixed(2)}{" "}
                        ฿
                      </span>
                      <span className="text-gray-400 line-through text-sm">
                        {game.price.toFixed(2)} ฿
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-800 font-bold text-lg">
                      {game.price.toFixed(2)} ฿
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => handleAddToCart(e, game)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  เพิ่มลงตะกร้า
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
