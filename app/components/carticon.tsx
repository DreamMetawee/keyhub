"use client";

import Link from "next/link";
import {useCart} from "@/app/context/CartContext"; // Adjust this path if your hook is elsewhere

export default function CartIcon() {
  const cartData = useCart();
  const totalItems =
    cartData?.cart?.reduce(
      (sum: number, item: { quantity?: number }) => sum + (item.quantity ?? 1),
      0
    ) ?? 0;

  return (
    <Link href="/cart" className="relative">
      {/* SVG Icon for the shopping cart */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-white hover:text-gray-300 transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>

      {/* Badge showing the number of items */}
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
