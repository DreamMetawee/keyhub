"use client";
import { useEffect, useState } from "react";
import axios from "axios";

type Subscription = {
  plan_name: string;
  price: number;
  status: string;
  start_date: string;
  end_date: string;
};

type UserProfile = {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  subscription: Subscription | null;
};

export default function ProfilePage() {
  const [data, setData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId")?.trim();

    if (!userId) {
      setError("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบ");
      setLoading(false);
      return;
    }

    axios
      .get(`/api/users/profile?id=${userId}`)
      .then((res) => {
        setData(res.data);
        setError(null);
      })
      .catch((err) => {
        setError(
          err.response?.data?.error ||
            err.message ||
            "เกิดข้อผิดพลาดในการโหลดข้อมูล"
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-white p-6">Loading...</p>;

  if (error) return <p className="text-red-500 p-6">{error}</p>;

  if (!data) return null;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">โปรไฟล์ผู้ใช้งาน</h1>
      <p>
        <strong>ชื่อผู้ใช้:</strong> {data.username}
      </p>
      <p>
        <strong>Email:</strong> {data.email}
      </p>

      {data.subscription ? (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">ข้อมูลสมาชิก</h2>
          <p>
            <strong>แพ็กเกจ:</strong> {data.subscription.plan_name}
          </p>
          <p>
            <strong>ราคา:</strong> ฿{data.subscription.price}
          </p>
          <p>
            <strong>สถานะ:</strong> {data.subscription.status}
          </p>
          <p>
            <strong>เริ่มต้น:</strong> {data.subscription.start_date}
          </p>
          <p>
            <strong>สิ้นสุด:</strong> {data.subscription.end_date}
          </p>
        </div>
      ) : (
        <p className="mt-4 text-red-500">ยังไม่มีการสมัครสมาชิก</p>
      )}
    </div>
  );
}
