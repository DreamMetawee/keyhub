import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import path from "path";

export async function POST(req: Request) {
  const body = await req.json();
  const { to } = body; // สำหรับ subscription form เราจะส่ง email ของผู้สมัคร
  const subject = "🍁 Autumn Sale - Key Game! 🍁";

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // ต้องเป็น App Password ของ Gmail
    },
  });

  try {
    await transporter.sendMail({
      from: `"KeyHub" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; color: #1a2233; text-align: center; background-color: #f5f5f5; padding: 20px;">
          <h1 style="color: #d35400;">🍁 Autumn Sale - Key Game! 🍁</h1>
          <p style="font-size: 16px;">ลดราคาพิเศษเกมสุดฮิตสำหรับผู้ติดตามของเราเท่านั้น!</p>

          <div style="margin-top: 20px;">
            <img 
              src="cid:poster_1" 
              style="width: 300px; height: auto; margin: 10px; border-radius: 8px;" 
              alt="Poster 1"
            />
            <img 
              src="cid:poster_2" 
              style="width: 300px; height: auto; margin: 10px; border-radius: 8px;" 
              alt="Poster 2"
            />
          </div>

          <p style="margin-top: 20px; font-size: 14px; color: #555;">
            รีบเลย! โปรโมชั่นมีจำนวนจำกัด 🕒
          </p>
        </div>
      `,
      attachments: [
        {
          filename: "poster_1.png",
          path: path.join(process.cwd(), "public", "img", "poster_1.png"),
          cid: "poster_1",
        },
        {
          filename: "poster_2.png",
          path: path.join(process.cwd(), "public", "img", "poster_2.png"),
          cid: "poster_2",
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send email error:", error);
    return NextResponse.json({ success: false, error });
  }
}
