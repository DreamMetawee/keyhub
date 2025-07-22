import { NextRequest, NextResponse } from "next/server";
import pool from "../../../util/db";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  const { email, username, password } = await request.json();

  if (!email || !username || !password) {
    return NextResponse.json(
      { success: false, message: "กรุณากรอกข้อมูลให้ครบ" },
      { status: 400 }
    );
  }

  const connection = await pool.getConnection();

  try {
    // ตรวจสอบ email หรือ username ซ้ำ
    const [userByEmail] = await connection.query(
      "SELECT id FROM user WHERE email = ?",
      [email]
    );
    if ((userByEmail as any[]).length > 0) {
      return NextResponse.json(
        { success: false, message: "อีเมลนี้ถูกใช้ไปแล้ว" },
        { status: 409 }
      );
    }

    const [userByUsername] = await connection.query(
      "SELECT id FROM user WHERE username = ?",
      [username]
    );
    if ((userByUsername as any[]).length > 0) {
      return NextResponse.json(
        { success: false, message: "ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await connection.query(
      `INSERT INTO user (email, username, password) VALUES (?, ?, ?)`,
      [email, username, hashedPassword]
    );

    const insertId = (result as any).insertId;

    return NextResponse.json({
      success: true,
      message: "สมัครสมาชิกสำเร็จ",
      user: { id: insertId, email, username },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
