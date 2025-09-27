// ✅ app/page.tsx
"use client"; // 💡 ต้องใช้ Client Component เพราะ FontAwesomeIcon และ Hooks
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faStarHalfAlt,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";

// 🚀 Import Components และ Helper
import { apiCall } from "@/app/lib/api"; // API Helper
import { formatCurrency } from "@/app/lib/utils"; // Currency Utility
import Head from "next/head";
import GameCard from "./components/card";

// 💡 สร้าง Type สำหรับข้อมูลเกมที่คาดหวัง
interface Game {
  id: number;
  title: string;
  slug: string;
  price: number;
  discount: number;
  imageUrl: string;
  category: string;
  // ... ฟิลด์อื่นๆ
}

interface GameCardProps {
  // กำหนด Props ของ GameCard ให้ชัดเจน
  title: string;
  edition: string;
  originalPrice: number;
  discount: number;
  imageUrl: string;
  slug: string;
  // ...
}
// ⚠️ Note: คุณต้องปรับปรุง GameCard component ให้รับ props เหล่านี้

const HomePage: React.FC = () => {
  const [heroGame, setHeroGame] = useState<Game | null>(null);
  const [recommendedGames, setRecommendedGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. ดึง Hero Game (GET /api/games/hero)
        const heroResponse = await apiCall<Game>("/games/hero", {
          method: "GET",
        });
        setHeroGame(heroResponse);

        // 2. ดึง Recommended Games (GET /api/games)
        const recommendedResponse = await apiCall<Game[]>("/games", {
          method: "GET",
        });
        // 💡 กรองเกม Hero ออกจาก list หรือแสดงเพียง 4 อันดับแรก
        setRecommendedGames(recommendedResponse.slice(0, 4));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 💡 Helper เพื่อคำนวณราคา
  const calculatePrice = (price: number, discount: number) => {
    return price * (1 - discount / 100);
  };

  if (loading) {
    return (
      <div className="pt-[72px] text-white text-center">
        Loading Storefront...
      </div>
    );
  }

  return (
    <div className="pt-[72px] px-6 md:px-8 bg-black min-h-screen">
      <Head>
        <title>KeyHub Store - Home</title>
      </Head>

      {/* Hero Section */}
      {heroGame ? (
        <section className="mb-12">
          <Link
            href={`/gamekey/${heroGame.slug}`} // 💡 ใช้ SLUG จริง
            className="block group transition-transform hover:scale-105"
          >
            <div className="flex flex-col lg:flex-row gap-0 rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-900 via-black to-gray-800 transform transition duration-300 hover:scale-105 hover:shadow-2xl">
              {/* Left: Game image with overlay */}
              <div className="lg:w-2/3 w-full relative">
                <Image
                  src={heroGame.imageUrl} // 💡 ใช้ Image URL จริง
                  alt={heroGame.title}
                  width={800}
                  height={400}
                  className="object-cover w-full h-[300px] lg:h-[500px]"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 flex items-end justify-between">
                  <div>
                    <span className="text-xs bg-red-600 px-2 py-1 rounded-full text-white font-semibold shadow">
                      New Release
                    </span>
                    <p className="text-xl font-bold text-white drop-shadow">
                      {heroGame.title}
                    </p>
                    <p className="text-sm text-gray-200">{heroGame.category}</p>
                  </div>
                </div>
              </div>

              {/* Right: Game detail */}
              <div className="lg:w-1/3 w-full p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-700">
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-white">
                    {heroGame.title}
                    <br />
                    <span className="text-gray-300">({heroGame.category})</span>
                  </h2>
                  <div className="text-sm mb-4">
                    <span className="bg-gray-800 px-2 py-1 rounded-full text-xs mr-1 text-white border border-gray-700">
                      {heroGame.category}
                    </span>
                    {heroGame.discount > 0 && (
                      <span className="bg-green-600 px-2 py-1 rounded-full text-xs text-white border border-green-700">
                        -{heroGame.discount}% OFF
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200 font-semibold shadow">
                    <FontAwesomeIcon icon={faHeart} />
                    <span>Add to Wishlist</span>
                  </button>
                  <button className="w-full bg-white hover:bg-gray-100 text-black py-3 rounded-md flex items-center justify-center space-x-2 text-lg font-bold transition-colors duration-200 shadow">
                    <span>
                      {formatCurrency(
                        calculatePrice(heroGame.price, heroGame.discount)
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </Link>
        </section>
      ) : (
        <div className="text-center text-gray-500 pt-10">
          No featured game available.
        </div>
      )}

      {/* Recommended Games Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-white">
          Recommended Games
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recommendedGames.map((game) => (
            <GameCard
              key={game.id}
              title={game.title}
              edition={game.category} // ใช้ Category แทน Edition
              originalPrice={game.price}
              discount={game.discount}
              imageUrl={game.imageUrl}
              slug={game.slug}
            />
          ))}
        </div>
      </section>

      {/* Recently Played Section (Still using Mock Data) */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-white">Recently Item</h2>
        {/* ⚠️ Note: คุณยังต้องรักษา components/recently_item และ Mock Data เดิมไว้ */}
        {/* ... โค้ดส่วน Recently Played Item เดิม ... */}
      </section>
    </div>
  );
};

export default HomePage;
