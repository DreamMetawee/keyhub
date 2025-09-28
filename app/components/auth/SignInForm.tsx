"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Label from "../form/Label";
import Input from "../input/inputfield";
import Checkbox from "../input/checkbox";
import Button from "../ui/button/button";
import eyeIcon from "../../../public/icons/eye.svg";
import eyeCloseIcon from "../../../public/icons/eye-off.svg";
// import { strict } from "assert"; // สามารถลบออกได้ถ้าไม่ได้ใช้


// --- API Functions (ส่วนนี้ถูกต้องแล้ว) ---
async function loginUser(name: string, password: string) {
  const res = await fetch("http://localhost:3001/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.msg || "Something went wrong");
  }
  return data;
}

async function registerUser(name: string, email: string, password: string) {
  const res = await fetch("http://localhost:3001/api/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.msg || "Something went wrong");
  }
  return data;
}

export default function SignInForm() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  // ... state อื่นๆ เหมือนเดิม
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  // --- handlerSubmit with Type Annotation ---
  // TYPE FIX 1: เพิ่ม Type ให้กับ 'e'
  const handlerSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError("");

    const { email, name, password, confirmPassword } = formData;

    try {
      if (isLogin) {
        const response = await loginUser(formData.name, password);

        console.log("✅ Login response:", response);

        // ถ้า backend ยังไม่ได้ส่ง token สามารถใช้ id หรือ name เป็นเงื่อนไขได้
        if (response.success) {
          if (response.token) {
            localStorage.setItem("token", response.token);
          }
          localStorage.setItem("user", JSON.stringify(response.user)); // เก็บ user object ไว้ใช้
          console.log("Login Success! Redirecting to home...");
          router.push("/"); // ✅ เปลี่ยนหน้าไป Homepage
        } else {
          setError(response.message || "เข้าสู่ระบบไม่สำเร็จ");
        }
      } else {
        await registerUser(name, email, password);
        console.log("Registration successful, please log in.");
        setIsLogin(true);
        setFormData({
          email: formData.email,
          name: formData.name,
          password: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      console.error("Operation failed:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("เกิดข้อผิดพลาดไม่ทราบสาเหตุ");
      }
    } finally {
      setIsPending(false);
    }
  };


  // --- handlerChange with Type Annotation ---
  // TYPE FIX 3: เพิ่ม Type ให้กับ 'e'
  const handlerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- JSX (ไม่ต้องแก้ไข) ---
  return (
    <div className="flex flex-1 flex-col min-h-screen">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div className="mb-5 sm:mb-8">
          <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
            {isLogin ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
          </h1>
          <p className="text-sm text-gray-200 dark:text-gray-300">
            {isLogin
              ? "กรอกอีเมลและรหัสผ่านของคุณเพื่อเข้าสู่ระบบ!"
              : "กรอกข้อมูลเพื่อสร้างบัญชีผู้ใช้งานใหม่!"}
          </p>
        </div>
        <form onSubmit={handlerSubmit}>
          <div className="space-y-6">
            {/* Input fields */}
            {!isLogin && (
              <div>
                <Label>
                  อีเมล <span className="text-error-500">*</span>
                </Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handlerChange}
                  placeholder="example@email.com"
                  className="text-white"
                />
              </div>
            )}
            <div>
              <Label>
                ชื่อผู้ใช้งาน <span className="text-error-500">*</span>
              </Label>
              <Input
                value={formData.name}
                name="name"
                onChange={handlerChange}
                placeholder="กรุณากรอกชื่อผู้ใช้งาน"
                className="text-white"
              />
            </div>
            <div>
              <Label>
                รหัสผ่าน <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  value={formData.password}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handlerChange}
                  placeholder="กรุณากรอกรหัสผ่าน"
                  className="text-white"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
                >
                  <Image
                    src={showPassword ? eyeIcon : eyeCloseIcon}
                    alt="toggle password"
                    width={20}
                    height={20}
                    className="invert dark:invert-0"
                  />
                </span>
              </div>
            </div>
            {!isLogin && (
              <div>
                <Label>
                  ยืนยันรหัสผ่าน <span className="text-error-500">*</span>
                </Label>
                <Input
                  value={formData.confirmPassword}
                  type="password"
                  name="confirmPassword"
                  onChange={handlerChange}
                  placeholder="กรุณายืนยันรหัสผ่าน"
                  className="text-white"
                />
              </div>
            )}

            {/* Error display */}
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {/* Submit button and toggle */}
            <div>
              <Button disabled={isPending} className="w-full" size="sm">
                {isPending
                  ? "กำลังโหลด..."
                  : isLogin
                  ? "ลงชื่อเข้าใช้"
                  : "สมัครสมาชิก"}
              </Button>
              <div className="mt-3 text-center text-sm">
                {isLogin ? (
                  <>
                    ยังไม่มีบัญชี?{" "}
                    <span
                      onClick={() => {
                        setIsLogin(false);
                        setError("");
                      }}
                      className="cursor-pointer text-blue-500 hover:underline"
                    >
                      สมัครสมาชิก
                    </span>
                  </>
                ) : (
                  <>
                    มีบัญชีอยู่แล้ว?{" "}
                    <span
                      onClick={() => {
                        setIsLogin(true);
                        setError("");
                      }}
                      className="cursor-pointer text-blue-500 hover:underline"
                    >
                      เข้าสู่ระบบ
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
