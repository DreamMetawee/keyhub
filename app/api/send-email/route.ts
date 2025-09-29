import { NextResponse } from "next/server";
import pool from "@/app/util/db";
import nodemailer from "nodemailer";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const body = await req.json(); // ✅ 1. รับ favoriteGenre เพิ่มจาก body
  const { to: email, source, favoriteGenre } = body;

  if (!email) {
    return NextResponse.json(
      { success: false, error: "Email is required" },
      { status: 400 }
    );
  }

  const connection = await pool.getConnection();

  try {
    const subscriberId = randomUUID(); // ✅ 2. เพิ่มคอลัมน์ favoriteGenre ในคำสั่ง SQL

    const insertQuery =
      "INSERT INTO EmailSubscriber (id, email, subscribedAt, source, favoriteGenre) VALUES (?, ?, NOW(), ?, ?)"; // ✅ 3. เพิ่มค่า favoriteGenre เข้าไปใน array ของ parameters

    await connection.query(insertQuery, [
      subscriberId,
      email,
      source || "Unknown",
      favoriteGenre || null, // ถ้าไม่มีค่ามาให้ใส่เป็น null
    ]); // --- ส่วนการส่งอีเมล (เหมือนเดิม) ---

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"KeyHub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Welcome, ${favoriteGenre} fan! Here are some games for you!`,
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h1 style="color: #4A90E2;">Welcome to KeyHub!</h1>
            <p>Thanks for subscribing. As a ${favoriteGenre} fan, we think you'll love KEYHUB!</p>
            
        </div>
    `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { success: false, error: "This email is already subscribed." },
        { status: 409 }
      );
    }
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
