// D:\Digital_Maarketing\KeyHub\keyhub\app\api\users\register\route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/util/db"; // path ต้องตรงกับ project
import bcrypt from "bcryptjs";

// ฟังก์ชันช่วยเพิ่ม headers CORS
function withCors(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*"); // หรือใส่ frontend domain
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  return response;
}

// --- POST: สมัครสมาชิก ---
export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();
    console.log("Register request:", { name, email });

    if (!name || !email || !password) {
      const res = NextResponse.json(
        { success: false, message: "กรุณากรอกข้อมูลให้ครบ" },
        { status: 400 }
      );
      return withCors(res);
    }

    const connection = await pool.getConnection();

    try {
      // ตรวจสอบ email ซ้ำ
      const [userByEmail] = await connection.query(
        "SELECT id FROM user WHERE email = ?",
        [email]
      );
      if ((userByEmail as any[]).length > 0) {
        const res = NextResponse.json(
          { success: false, message: "อีเมลนี้ถูกใช้ไปแล้ว" },
          { status: 409 }
        );
        return withCors(res);
      }

      // ตรวจสอบ username ซ้ำ
      const [userByName] = await connection.query(
        "SELECT id FROM user WHERE name = ?",
        [name]
      );
      if ((userByName as any[]).length > 0) {
        const res = NextResponse.json(
          { success: false, message: "ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว" },
          { status: 409 }
        );
        return withCors(res);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const [result] = await connection.query(
        "INSERT INTO user (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
      );

      const insertId = (result as any).insertId;

      const res = NextResponse.json(
        {
          success: true,
          message: "สมัครสมาชิกสำเร็จ",
          user: { id: insertId, name, email },
        },
        { status: 201 }
      );
      return withCors(res);
    } finally {
      connection.release();
    }
  } catch (err: any) {
    console.error("Register error:", err);
    const res = NextResponse.json(
      { success: false, message: err.message || "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
    return withCors(res);
  }
}

// --- OPTIONS: สำหรับ CORS preflight ---
export async function OPTIONS() {
  const res = NextResponse.json({});
  return withCors(res);
}
