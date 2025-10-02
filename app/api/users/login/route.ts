import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "../../../util/db";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  const { name, password } = await request.json();

  console.log("📥 Login Request:", { name, password });

  if (!name || !password) {
    console.log("❌ Missing fields");
    return NextResponse.json(
      { success: false, message: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน" },
      { status: 400 }
    );
  }

  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.query(
      "SELECT * FROM user WHERE name = ?",
      [name]
    );

    const user = (rows as any[])[0];
    console.log("🔎 User found in DB:", user);

    if (!user) {
      console.log("❌ User not found");
      return NextResponse.json(
        { success: false, message: "ไม่พบผู้ใช้นี้" },
        { status: 404 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log("🔐 Password match:", isPasswordCorrect);
    const secret = process.env.JWT_SECRET!; // เก็บใน .env ดีกว่า
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      secret,
      { expiresIn: "1h" }
    );

    if (!isPasswordCorrect) {
      console.log("❌ Incorrect password");
      return NextResponse.json(
        { success: false, message: "รหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    console.log("✅ Login success");
    return NextResponse.json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ",
      token, // ส่ง token กลับไปด้วย
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err: any) {
    console.error("🔥 Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || String(err) },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}