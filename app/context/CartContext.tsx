"use client";

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useMemo,
} from "react";

// 1. กำหนด Type ของสินค้าในตะกร้าให้เป็นมาตรฐานเดียว
export interface CartItem {
  productId: number; // ใช้ number เป็นหลัก
  name: string;
  price: number; // ใช้ price (ราคาต่อชิ้น)
  quantity: number;
}

// 2. กำหนด Type ของ Context ให้ครบถ้วน
interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  total: number; // เพิ่ม total เข้ามา
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export default function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // 3. นำ Logic จาก useCart.ts มาใส่: โหลดข้อมูลจาก localStorage ตอนเริ่ม
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("shopping-cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // ตรวจสอบข้อมูลก่อน set เพื่อป้องกัน error
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      setCart([]); // ถ้ามีปัญหา ให้ใช้ตะกร้าว่าง
    }
  }, []);

  // 4. นำ Logic จาก useCart.ts มาใส่: บันทึกข้อมูลลง localStorage ทุกครั้งที่ cart เปลี่ยน
  useEffect(() => {
    localStorage.setItem("shopping-cart", JSON.stringify(cart));
  }, [cart]);

  // ฟังก์ชันเพิ่มสินค้า
  const addToCart = (itemToAdd: Omit<CartItem, "quantity">) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.productId === itemToAdd.productId
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === itemToAdd.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...itemToAdd, quantity: 1 }];
    });
  };

  // ฟังก์ชันลบสินค้า
  const removeFromCart = (productId: number) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.productId !== productId)
    );
  };

  // ฟังก์ชันอัปเดตจำนวน
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  // ฟังก์ชันล้างตะกร้า
  const clearCart = () => {
    setCart([]);
  };

  // 5. นำ Logic จาก useCart.ts มาใส่: คำนวณยอดรวม
  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// 6. สร้าง Custom Hook เพื่อเรียกใช้ Context นี้เท่านั้น
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
