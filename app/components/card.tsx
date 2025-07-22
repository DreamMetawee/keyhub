import React from "react";
import Image from "next/image";
import Link from "next/link";

interface GameCardProps {
  title: string;
  edition: string;
  originalPrice: number;
  discount?: number;
  imageUrl: string;
  isPopular?: boolean;
  slug? : string;
}

const GameCard: React.FC<GameCardProps> = ({
  title,
  edition,
  originalPrice,
  discount,
  imageUrl,
  slug,
  isPopular = false,
}) => {
  const discountedPrice = discount
    ? originalPrice * (1 - discount / 100)
    : originalPrice;

  return (
    <Link href={`/gamekey/${slug}`}>
      <div className="relative bg-steam-card-bg rounded-xl overflow-hidden shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
        <Image
          src={imageUrl}
          alt={title}
          width={800}
          height={400}
          className="object-cover w-full h-[240px] lg:h-[340px]"
        />
        {/* Overlay content */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 flex justify-between items-end">
          <div>
            {isPopular && (
              <span className="text-xs bg-red-600 px-2 py-1 rounded-full text-white font-semibold shadow">
                Popular
              </span>
            )}
            <p className="text-xl font-bold text-white drop-shadow">{title}</p>
            <p className="text-sm text-gray-200">{edition}</p>
          </div>
          {/* Price section */}
          <div className="text-right text-sm">
            {discount ? (
              <>
                <p className="text-red-500 font-bold">-{discount}%</p>
                <p className="line-through text-gray-300">
                  ${originalPrice.toFixed(2)}
                </p>
              </>
            ) : null}
            <p className="text-white font-bold">
              ${discountedPrice.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
