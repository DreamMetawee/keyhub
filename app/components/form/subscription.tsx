"use client";

import { FC, useState } from "react";

const gameCategories = [
  "Action",
  "RPG",
  "Strategy",
  "Simulation",
  "Sports",
  "Adventure",
];

// ✅ เพิ่มหัวข้อสำหรับ Marketing Automation
const marketingTopics = [
  "New Game Releases",
  "Exclusive Discounts",
  "Beta Test Invitations",
  "Gaming News",
  "Developer Interviews",
];

export const SubscriptionForm: FC = () => {
  const [email, setEmail] = useState("");
  const [genre, setGenre] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]); // ✅ เก็บ topic ที่เลือก
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | string>(null);

  const handleTopicChange = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genre) {
      setStatus("⚠️ กรุณาเลือกแนวเกมที่ชอบ");
      return;
    }
    if (selectedTopics.length === 0) {
      setStatus("⚠️ กรุณาเลือกหัวข้อที่คุณสนใจอย่างน้อย 1 หัวข้อ");
      return;
    }
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          favoriteGenre: genre,
          topics: JSON.stringify(selectedTopics), // ✅ ส่ง topics ไปเก็บใน DB
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("✅ สมัครสมาชิกสำเร็จ! ขอบคุณสำหรับข้อมูลครับ");
        setEmail("");
        setGenre("");
        setSelectedTopics([]);
      } else {
        setStatus(`❌ ${data.error || "สมัครสมาชิกไม่สำเร็จ"}`);
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
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white">KeyHub Newsletter</h2>
        <p className="text-sm text-gray-400 mt-1">
          สมัครเพื่อรับข่าวสารและโปรโมชันที่เหมาะกับคุณ!
        </p>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm text-gray-300 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="w-full p-2 rounded-md bg-[#0f1624] text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="genre" className="block text-sm text-gray-300 mb-1">
          แนวเกมที่ชื่นชอบ (Favorite Genre)
        </label>
        <select
          id="genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          required
          className="w-full p-2 rounded-md bg-[#0f1624] text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
        >
          <option value="" disabled>
            -- Please select a genre --
          </option>
          {gameCategories.map((category) => (
            <option key={category} value={category} className="text-white">
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ เพิ่มหัวข้อการตลาด */}
      <div>
        <p className="block text-sm text-gray-300 mb-1">
          หัวข้อที่คุณสนใจ (เลือกได้หลายข้อ)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {marketingTopics.map((topic) => (
            <label
              key={topic}
              className="flex items-center gap-2 text-gray-300 bg-[#0f1624] p-2 rounded-md border border-gray-600 cursor-pointer"
            >
              <input
                type="checkbox"
                value={topic}
                checked={selectedTopics.includes(topic)}
                onChange={() => handleTopicChange(topic)}
              />
              {topic}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 text-white py-2 px-4 rounded-xl w-full transition"
      >
        {loading ? "กำลังส่ง..." : "Subscribe"}
      </button>

      {status && <p className="text-center text-sm mt-2">{status}</p>}
    </form>
  );
};
