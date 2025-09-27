// src/lib/utils.ts

/**
 * จัดรูปแบบตัวเลขให้เป็นสกุลเงินบาทไทย (THB)
 * @param amount ตัวเลข (number) ที่ต้องการจัดรูปแบบ
 * @returns String ที่เป็นรูปแบบเงิน เช่น "999.50 ฿"
 */
export function formatCurrency(amount: number): string {
  // 💡 ใช้ 'th-TH' เพื่อให้แสดงผลตามหลักการของไทย
  return amount.toLocaleString("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 2, // กำหนดให้มีทศนิยมอย่างน้อย 2 ตำแหน่ง
  });
}
