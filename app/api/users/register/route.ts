import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/util/db";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

// ฟังก์ชันช่วยเพิ่ม headers CORS
function withCors(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  return response;
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();
    console.log("Register request:", { name, email });

    if (!name || !email || !password) {
      return withCors(
        NextResponse.json(
          { success: false, message: "กรุณากรอกข้อมูลให้ครบ" },
          { status: 400 }
        )
      );
    }

    const connection = await pool.getConnection();

    try {
      // ตรวจสอบ email ซ้ำ
      const [userByEmail] = await connection.query(
        "SELECT id FROM user WHERE email = ?",
        [email]
      );
      if ((userByEmail as any[]).length > 0) {
        return withCors(
          NextResponse.json(
            { success: false, message: "อีเมลนี้ถูกใช้ไปแล้ว" },
            { status: 409 }
          )
        );
      }

      // ตรวจสอบ username ซ้ำ
      const [userByName] = await connection.query(
        "SELECT id FROM user WHERE name = ?",
        [name]
      );
      if ((userByName as any[]).length > 0) {
        return withCors(
          NextResponse.json(
            { success: false, message: "ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว" },
            { status: 409 }
          )
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const [result] = await connection.query(
        "INSERT INTO user (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
      );

      const insertId = (result as any).insertId;

      // ---------- ส่งอีเมลยืนยัน ----------
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
  subject: "ยืนยันการสมัครสมาชิก KeyHub ✅",
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
    </head>
    <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:28px 12px;">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
              
              <!-- Header -->
              <tr>
                <td style="background:#2563eb;padding:20px;text-align:center;color:#fff;">
                  <h1 style="margin:0;font-size:22px;">🎉 ยินดีต้อนรับสู่ KeyHub!</h1>
                </td>
              </tr>
              
              <!-- Body -->
              <tr>
                <td style="padding:24px;">
                  <p style="font-size:16px;color:#0f172a;">สวัสดี ${name},</p>
                  <p style="font-size:15px;color:#334155;line-height:1.6;">
                    ขอบคุณที่สมัครสมาชิกกับ <strong>KeyHub</strong>  
                    ตอนนี้คุณสามารถเริ่มใช้งานและเลือกซื้อเกมโปรดได้ทันที!
                  </p>

                  <!-- Promotion highlight -->
                  <div style="margin:20px 0;padding:16px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;">
                    <h3 style="margin:0 0 8px 0;color:#0369a1;">🔥 สิทธิพิเศษสำหรับสมาชิกใหม่</h3>
                    <img src="cid:newCustomerImage" alt="Welcome" style="width:100%;max-width:560px;border-radius:6px;margin-bottom:12px;"/>
                    <ul style="margin:0;padding-left:20px;color:#0f172a;font-size:14px;line-height:1.6;">
                      <li>รับส่วนลด <strong>10%</strong> สำหรับการสั่งซื้อครั้งแรก</li>
                      <li>ติดตามโปรโมชั่นเกมใหม่ ๆ และดีลสุดคุ้มก่อนใคร</li>
                      <li>อัปเดตข่าวสารวงการเกมและกิจกรรมพิเศษ</li>
                    </ul>
                  </div>

                  <div style="text-align:center;margin:24px 0;">
                    <a href="${process.env.SITE_URL ?? "#"}" 
                      style="display:inline-block;padding:14px 24px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;">
                      🔑 เริ่มต้นใช้งาน KeyHub
                    </a>
                  </div>

                  <p style="font-size:13px;color:#64748b;margin:0;">
                    หากคุณไม่ต้องการรับข่าวสารโปรโมชั่น สามารถยกเลิกการรับอีเมลได้ทุกเมื่อที่ <a href="${process.env.SITE_URL ?? "#"}" style="color:#2563eb;">ที่นี่</a>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#0f172a;color:#94a3b8;padding:16px;text-align:center;font-size:12px;">
                  KeyHub • Bangkok, Thailand<br/>
                  <a href="mailto:support@keyhub.example" style="color:#94a3b8;">support@keyhub.example</a>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
  attachments: [
    {
      filename: "newCustomer.png",
      path: "D:/Digital_Maarketing/KeyHub/keyhub/public/img/newCustomer.png", // path จริงของไฟล์
      cid: "newCustomerImage" // ต้องตรงกับ src cid
    }
  ]
});


      return withCors(
        NextResponse.json(
          {
            success: true,
            message: "สมัครสมาชิกสำเร็จและส่งอีเมลเรียบร้อยแล้ว",
            user: { id: insertId, name, email },
          },
          { status: 201 }
        )
      );
    } finally {
      connection.release();
    }
  } catch (err: any) {
    console.error("Register error:", err);
    return withCors(
      NextResponse.json(
        { success: false, message: err.message || "เกิดข้อผิดพลาด" },
        { status: 500 }
      )
    );
  }
}

export async function OPTIONS() {
  return withCors(NextResponse.json({}));
}
