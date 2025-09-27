// src/lib/api.ts

// 💡 1. กำหนด Base URL: ดึงค่ามาจาก .env.local
// ตรวจสอบว่าในไฟล์ .env.local มี NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL is not defined in the environment variables."
  );
}

interface ApiConfig {
  method: "GET" | "POST" | "PUT" | "DELETE";
  data?: any; // ข้อมูลที่ต้องการส่งใน Body (สำหรับ POST, PUT, DELETE)
  headers?: HeadersInit; // Headers เพิ่มเติมที่ต้องการส่ง
}

/**
 * ฟังก์ชันหลักสำหรับเรียก API ไปยัง Backend Server
 * @param endpoint เช่น '/games' หรือ '/users/auth'
 * @param config เมธอด, ข้อมูล, และ Headers
 * @returns Promise ที่ส่งกลับข้อมูล JSON
 */
export async function apiCall<T>(
  endpoint: string,
  config: ApiConfig
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // ตั้งค่าพื้นฐานสำหรับการเรียก fetch
  const options: RequestInit = {
    method: config.method,
    // กำหนด Headers มาตรฐาน
    headers: {
      "Content-Type": "application/json",
      // **[TODO]:** หากมีการใช้ JWT/Token, คุณสามารถเพิ่ม Authorization Header ที่นี่
      ...config.headers,
    },
    // ป้องกันการแคชในฝั่ง Client
    cache: "no-store",
  };

  // ใส่ Body สำหรับเมธอดที่มีการส่งข้อมูล (POST, PUT, DELETE)
  if (config.data) {
    options.body = JSON.stringify(config.data);
  }

  const response = await fetch(url, options);

  // 1. จัดการ HTTP Error Status
  if (!response.ok) {
    // พยายามอ่าน Body เพื่อดึงข้อความ Error ที่ Server ส่งกลับมา
    const errorData = await response.json().catch(() => ({
      error: `API call to ${endpoint} failed with status ${response.status}`,
    }));

    // โยน Error ที่มีข้อความชัดเจน
    const errorMessage =
      errorData.error ||
      errorData.message ||
      `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  // 2. จัดการ Response Body (GET, POST, PUT)
  // สำหรับ DELETE หรือ 204 No Content จะไม่มี Body กลับมา
  if (config.method !== "DELETE" && response.status !== 204) {
    // แปลง response เป็น JSON และส่งกลับ
    return response.json() as Promise<T>;
  }

  // สำหรับ DELETE/204 ให้ส่ง object ว่างกลับไป
  return {} as T;
}
