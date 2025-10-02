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
  subject: `Welcome, ${
    favoriteGenre || "game"
  } fan! Here are some games for you!`,
  html: `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
      <h1 style="color: #4A90E2;">Welcome to KeyHub!</h1>
      <p>Hi <strong>${email}</strong>,</p>
      <p>Thanks for subscribing. As a <strong>${
        favoriteGenre || "game"
      }</strong> fan, we think you'll love KEYHUB!</p>
      <p>We'll send you updates and exclusive game keys to this email: <strong>${email}</strong></p>
      <p>Check out our site for more info: 
        <a href="https://sites.google.com/udru.ac.th/keyhub/%E0%B8%AB%E0%B8%99%E0%B8%B2%E0%B9%81%E0%B8%A3%E0%B8%81" target="_blank" style="color: #4A90E2;">KeyHub Google Site</a>
      </p>
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
