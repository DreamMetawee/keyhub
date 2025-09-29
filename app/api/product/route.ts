import { NextResponse } from "next/server";
import pool from "@/app/util/db"; // ปรับ path ตามโปรเจกต์ของคุณ

export async function GET() {
  const connection = await pool.getConnection();
  try {
    // ดึงข้อมูลสินค้าทั้งหมด อาจจะต้อง JOIN กับตารางอื่นเพื่อเอารูปภาพหรือหมวดหมู่
    const [products] = await connection.query(`
      SELECT 
        p.id, p.title, p.price, p.slug, p.image_url, 
        c.name as categoryName 
      FROM product p
      LEFT JOIN category c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `);

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  } finally {
    connection.release();
  }
}
