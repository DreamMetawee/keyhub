"use client";

import useCart from "@/app/lib/useCart";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, total } = useCart();
  const router = useRouter();

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    updateQuantity(productId, quantity);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🛒 ตะกร้าสินค้าของคุณ</h1>

        {cart.length === 0 ? (
          <div className="text-center bg-gray-800 p-8 rounded-lg">
            <p className="text-xl text-gray-400">ตะกร้าของคุณว่างเปล่า</p>
            <Link
              href="/"
              className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              เลือกซื้อสินค้าต่อ
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Item List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center bg-gray-800 p-4 rounded-lg"
                >
                  <div className="flex-grow">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-400">
                      {item.totalPrice.toFixed(2)} ฿
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateQuantity(
                          item.productId,
                          parseInt(e.target.value)
                        )
                      }
                      className="w-16 p-1 rounded bg-gray-700 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-gray-800 p-6 rounded-lg h-fit">
              <h2 className="text-xl font-bold mb-4">สรุปยอด</h2>
              <div className="flex justify-between mb-2">
                <span>ยอดรวม</span>
                <span>{total.toFixed(2)} ฿</span>
              </div>
              <hr className="border-gray-600 my-4" />
              <div className="flex justify-between font-bold text-lg">
                <span>ยอดสุทธิ</span>
                <span>{total.toFixed(2)} ฿</span>
              </div>
              <button
                onClick={() => router.push("/checkout")}
                className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                ไปที่หน้าชำระเงิน
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
