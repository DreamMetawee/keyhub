import { NextRequest, NextResponse } from "next/server";
import pool from "../../../util/db";
import { RowDataPacket } from "mysql2";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      console.warn("[PROFILE API] ❌ Missing user ID in query params");
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT u.id, u.username, u.email, u.avatar,
              s.start_date, s.end_date, s.status,
              p.name AS plan_name, p.price
       FROM users u
       LEFT JOIN subscriptions s ON u.id = s.user_id
       LEFT JOIN subscription_plans p ON s.plan_id = p.id
       WHERE u.id = ?`,
      [userId]
    );

    const user = Array.isArray(rows) ? rows[0] : null;

    if (!user) {
      console.warn(`[PROFILE API] ❌ User not found (id=${userId})`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log(`[PROFILE API] ✅ Found user ${user.username}`);

    return NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      subscription: user.plan_name
        ? {
            plan_name: user.plan_name,
            price: user.price,
            start_date: user.start_date,
            end_date: user.end_date,
            status: user.status,
          }
        : null,
    });
  } catch (error: any) {
    console.error("[PROFILE API] ❌ Unexpected error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error.message, // 👈 แสดง error จริง
        stack: error.stack, // 👈 Stack trace (ใช้เฉพาะ dev)
      },
      { status: 500 }
    );
  }
}
