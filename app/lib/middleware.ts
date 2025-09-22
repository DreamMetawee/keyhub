import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession, IronSession } from "iron-session";
import { sessionOptions } from "./session";

// Define the session data interface
interface SessionData {
  userId?: number;
}

export async function middleware(req: NextRequest) {
  // เรียก session จาก request และ response
  const res = NextResponse.next();
  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  if (!session.userId) {
    // ถ้า user ยังไม่ login ให้ redirect ไป /login
    return NextResponse.redirect(new URL("/login", req.url));
  }
  res.headers.set("x-user-id", session.userId.toString());

  return res;
}

// กำหนด path ที่ middleware จะทำงาน
export const config = {
  matcher: ["/profile/:path*", "/api/users/profile"],
};
