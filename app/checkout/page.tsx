"use client";

import { useCart } from "../context/CartContext"; // Adjust path if needed
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

  // ✅ โหลด user จาก localStorage ตอน component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("ไม่สามารถ parse user:", err);
      }
    }
  }, []);

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ");
      setIsProcessing(false);
      return;
    }

    if (!user) {
      setError("ไม่พบข้อมูลผู้ใช้ กรุณาลองเข้าสู่ระบบใหม่อีกครั้ง");
      setIsProcessing(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ ส่ง token ให้ backend
        },
        body: JSON.stringify({
          items: cart,
          userEmail: user.email, // ✅ ดึงจาก localStorage ที่ parse แล้ว
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "ไม่สามารถสั่งซื้อได้");
      }

      alert("สั่งซื้อสำเร็จ! กรุณาตรวจสอบอีเมลสำหรับ Game Key ของคุณ");
      clearCart();
      router.push("/");
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

        {/* Order Summary */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">รายการสั่งซื้อ</h2>
          {cart.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between text-gray-300"
            >
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>{(item.price * item.quantity).toFixed(2)} ฿</span>
            </div>
          ))}
          <hr className="border-gray-600 my-4" />
          <div className="flex justify-between font-bold text-lg">
            <span>ยอดสุทธิ</span>
            <span>{total.toFixed(2)} ฿</span>
          </div>
        </div>

        {/* QR Code Payment */}
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
