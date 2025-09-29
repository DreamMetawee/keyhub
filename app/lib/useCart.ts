// lib/hooks/useCart.ts
import { useState, useEffect, useMemo } from "react";

export interface CartItem {
  productId: string;
  name: string;
  totalPrice: number;
  quantity: number;
}

const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // โหลดตะกร้าจาก localStorage เมื่อเริ่มต้น
  useEffect(() => {
    const savedCart = localStorage.getItem("shopping-cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // บันทึกตะกร้าลง localStorage ทุกครั้งที่มีการเปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem("shopping-cart", JSON.stringify(cart));
  }, [cart]);

    const total = useMemo(() => {
      return cart.reduce(
        (sum, item) => sum + item.totalPrice * item.quantity,
        0
      );
    }, [cart]);

  const addToCart = (
    product: Omit<CartItem, "quantity">,
    quantity: number = 1
  ) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.productId === product.productId
      );
      if (existingItem) {
        // ถ้ามีสินค้าอยู่แล้ว ให้อัปเดตจำนวน
        return prevCart.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      // ถ้าเป็นสินค้าใหม่ ให้เพิ่มเข้าไป
      return [...prevCart, { ...product, quantity }];
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) => {
      if (newQuantity <= 0) {
        // ถ้าจำนวนเป็น 0 หรือน้อยกว่า ให้ลบสินค้านั้นออก
        return prevCart.filter((item) => item.productId !== productId);
      }
      return prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.productId !== productId)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
    total,
  };
};

export default useCart;
