"use client";

import { useEffect, useState } from "react";

type Game = {
  id: string;
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

  useEffect(() => {
    async function fetchGames() {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3000/api/game", {
          method: "GET",
          credentials: "include", // 🔑 ถ้าต้องส่ง cookie
        });

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-bold">
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
            className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* รูปเกม */}
            <div className="aspect-video bg-gray-200">
              {game.imageUrl ? (
                <img
                  src={game.imageUrl}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No Image
                </div>
              )}
            </div>

            {/* ข้อมูลเกม */}
            <div className="p-4">
              <h2 className="text-lg font-semibold">{game.title}</h2>
              <p className="text-sm text-gray-500">
                {game.category ?? "ทั่วไป"}
              </p>

              {/* ราคา */}
              <div className="mt-2">
                {game.discount && game.discount > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 font-bold">
                      {game.price - (game.price * game.discount) / 100} ฿
                    </span>
                    <span className="text-gray-400 line-through text-sm">
                      {game.price} ฿
                    </span>
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                      -{game.discount}%
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-800 font-bold">
                    {game.price} ฿
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
