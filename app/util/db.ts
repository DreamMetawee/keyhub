import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root", // เปลี่ยนเป็น user จริงของคุณ
  password: "", // ถ้าไม่มี password ให้เว้นว่างแบบนี้
  database: "keyhub", // ชื่อ database ของคุณ
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
