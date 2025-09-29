"use client";

import useCart from "@/app/lib/useCart";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

// กำหนด type ของ Item ใน cart ให้ตรงกับ useCart
type CartItem = {
  productId: string;
  name: string;
  quantity: number;
  totalPrice: number;
  image?: string;
};

export default function CheckoutPage() {
  // กำหนด default เป็น object ที่มีค่าเริ่มต้น เพื่อแก้ error ของ TypeScript
  const { cart, total, clearCart } = useCart() || {
    cart: [] as CartItem[],
    totalPrice: 0,
    clearCart: () => {},
  };
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthToken(token);
  }, []);

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          items: cart,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "ไม่สามารถสั่งซื้อได้");
      }

      alert("สั่งซื้อสำเร็จ!");
      clearCart();
      router.push("/order-success");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">📦 ชำระเงิน</h1>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">รายการสั่งซื้อ</h2>
          {cart.map((item: CartItem) => (
            <div
              key={item.productId}
              className="flex justify-between text-gray-300"
            >
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>{item.totalPrice.toFixed(2)} ฿</span>
            </div>
          ))}
          <hr className="border-gray-600 my-4" />
          <div className="flex justify-between font-bold text-lg">
            <span>ยอดสุทธิ</span>
            <span>{total.toFixed(2)} ฿</span>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg mt-6 text-center">
          <h2 className="text-xl font-bold mb-4">สแกน QR Code เพื่อชำระเงิน</h2>
          <div className="flex justify-center">
            <Image
              src="/img/0983433530.png"
              alt="QR Code for payment"
              width={250}
              height={250}
              className="rounded-lg"
            />
          </div>
          <p className="text-gray-400 mt-4">กรุณาชำระเงินภายใน 15 นาที</p>
        </div>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        <button
          onClick={handlePlaceOrder}
          disabled={isProcessing || cart.length === 0}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-500"
        >
          {isProcessing ? "กำลังตรวจสอบ..." : "ยืนยันการชำระเงิน"}
        </button>
      </div>
    </div>
  );
}
