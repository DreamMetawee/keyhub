"use client";

import { FC, useState } from "react";

export const SubscriptionForm: FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | string>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          subject: "New Subscription",
          message: `New subscriber: ${email}`,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("✅ สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมลของคุณ");
        setEmail("");
      } else {
        setStatus("❌ ส่งอีเมลไม่สำเร็จ กรุณาลองใหม่");
      }
    } catch (err) {
      setStatus("⚠️ เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-[#1a2233] rounded-2xl shadow-md max-w-md mx-auto"
    >

      <h2 className="text-xl font-semibold text-white text-center">
        KeyHub Newsletter Subscription
      </h2>
      <center><h4>สมัครสมาชิกเพื่อรับข่าวสารและโปรโมชันใหม่ๆ ของทาง</h4></center>
      <center>KEYHUB</center>

      <div>
        <label className="block text-sm text-gray-300 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="w-full p-2 rounded-md bg-[#0f1624] text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 text-white py-2 px-4 rounded-xl w-full transition"
      >
        {loading ? "กำลังส่ง..." : "Subscribe"}
      </button>

      {status && <p className="text-center text-sm text-gray-300">{status}</p>}
    </form>
  );
};
