import nodemailer from "nodemailer";

export default async function sendWelcomeEmail(email: string, name: string) {
  try {
    const transporter = nodemailer.createTransport({
        service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.Email_PASS, // ใช้รหัสผ่านแอป (App Password) แทนรหัสผ่านปกติ
      },
    });

    await transporter.sendMail({
      from: `"KeyHub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "ยินดีต้อนรับสู่ KeyHub!",
      html: `<!DOCTYPE html>
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
                    <ul style="margin:0;padding-left:20px;color:#0f172a;font-size:14px;line-height:1.6;">
                    <img src="/public/img/newCustomer.png" alt="Welcome" style="width:100%;max-width:560px;border-radius:6px;margin-bottom:12px;"/>
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
                    หากคุณไม่ต้องการรับข่าวสารโปรโมชั่น สามารถยกเลิกการรับอีเมลได้ทุกเมื่อที่ <a href="${
                      process.env.SITE_URL ?? "#"
                    }" style="color:#2563eb;">ที่นี่</a>
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
    </html>`,
    });

    console.log("✅ Welcome email sent to", email);
  } catch (err) {
    console.error("❌ Failed to send welcome email:", err);
  }
}
