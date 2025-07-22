// ✅ page.tsx
import React from "react";
import Head from "next/head";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faStarHalfAlt,
  faHeart,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

import GameCard from "./components/card";
import RecentlyPlayedItem from "./components/recently_item";
import Link from "next/link";

const HomePage: React.FC = () => {
  return (
    <div className="pt-[72px] px-6 md:px-8">
      {/* Hero Section */}
      <section className="mb-12">
        <Link
          href="/gamekey/god-of-war-ragnarok"
          className="block group transition-transform hover:scale-105"
        >
          <div className="flex flex-col lg:flex-row gap-0 rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-900 via-black to-gray-800 transform transition duration-300 hover:scale-105 hover:shadow-2xl">
            {/* Left: Game image with overlay */}
            <div className="lg:w-2/3 w-full relative">
              <Image
                src="/img/god-of-war-ragnarok-playstation-5-game-playstation-store-united-states-cover.jpg"
                alt="God of War Ragnarok"
                width={800}
                height={400}
                className="object-cover w-full h-[300px] lg:h-[500px]"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 flex items-end justify-between">
                <div>
                  <span className="text-xs bg-red-600 px-2 py-1 rounded-full text-white font-semibold shadow">
                    Popular
                  </span>
                  <p className="text-xl font-bold text-white drop-shadow">
                    GOD OF WAR
                  </p>
                  <p className="text-sm text-gray-200">RAGNAROK</p>
                </div>
              </div>
            </div>

            {/* Right: Game detail */}
            <div className="lg:w-1/3 w-full p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-700">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-white">
                  God Of War
                  <br />
                  <span className="text-gray-300">(Ragnarök)</span>
                </h2>
                <div className="text-sm mb-4">
                  <span className="bg-gray-800 px-2 py-1 rounded-full text-xs mr-1 text-white border border-gray-700">
                    Action
                  </span>
                  <span className="bg-gray-800 px-2 py-1 rounded-full text-xs text-white border border-gray-700">
                    Adventure
                  </span>
                </div>
                <div className="flex items-center mb-4">
                  <div className="flex text-red-500 text-lg mr-2">
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStarHalfAlt} />
                  </div>
                  <span className="text-sm text-gray-400">
                    Rating 4.9 of 50
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200 font-semibold shadow">
                  <FontAwesomeIcon icon={faHeart} />
                  <span>Add to Wishlist</span>
                </button>
                <button className="w-full bg-white hover:bg-gray-100 text-black py-3 rounded-md flex items-center justify-center space-x-2 text-lg font-bold transition-colors duration-200 shadow">
                  <span>$49.00</span>
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white py-2 rounded-md transition-colors duration-200 border border-gray-700">
                    <span className="block text-sm font-semibold">DLC</span>
                    <span className="block text-xs text-gray-300">
                      Definitive Edition
                    </span>
                  </button>
                  <button className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white py-2 rounded-md transition-colors duration-200 border border-gray-700">
                    <span className="block text-sm font-semibold">DLC</span>
                    <span className="block text-xs text-gray-300">
                      Thor Edition
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Recommended Games Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-white">
          Recommended Games
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <GameCard
            title="Assassin's Creed Valhalla"
            edition="Standard Edition"
            originalPrice={40}
            discount={30}
            imageUrl="/img/Assassin's_Creed_Valhalla_cover.jpg"
            slug="assassins-creed-valhalla"
          />
          <GameCard
            title="Witcher 3 Wild Hunt"
            edition="Standard Edition"
            originalPrice={53}
            discount={18}
            imageUrl="/img/Witcher_3_cover_art.jpg"
            slug="witcher-3-wild-hunt"
          />
          <GameCard
            title="Horizon Zero Dawn"
            edition="Complete Edition"
            originalPrice={60}
            discount={13}
            imageUrl="/img/Horizon_Zero_Dawn.jpg"
            slug="horizon-zero-dawn"
          />
          <GameCard
            title="Call of Duty Modern Warfare"
            edition="Standard Edition"
            originalPrice={75}
            discount={17}
            imageUrl="/img/Call_of_Duty_Modern_Warfare_(2019)_cover.jpg"
            slug="call-of-duty-modern-warfare"
          />
        </div>
      </section>

      {/* Recently Played Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-white">Recently Item</h2>
        <div className="space-y-4">
          <RecentlyPlayedItem
            title="Fall Guys"
            subtitle="Squad Celebration"
            keyStatus="activated"
            imageUrl="/img/download.jpg"
          />
          <RecentlyPlayedItem
            title="Tomb Raider"
            subtitle="The Star of the Tomb"
            keyStatus="not-activated"
            imageUrl="/img/download (1).jpg"
          />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
