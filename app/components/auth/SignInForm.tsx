"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import Label from "../form/Label";
import Input from "../input/inputfield";
import Checkbox from "../input/checkbox";
import Button from "../ui/button/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import eyeIcon from "../../../public/icons/eye.svg";
import eyeCloseIcon from "../../../public/icons/eye-off.svg";

// ฟังก์ชันเรียก API
async function loginUser(username: string, password: string) {
  const res = await fetch("/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return await res.json();
}

// อัปเดตฟังก์ชัน registerUser ให้รับ email ด้วย
async function registerUser(email: string, username: string, password: string) {
  const res = await fetch("/api/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password }), // ส่ง email ไปด้วย
  });
  return await res.json();
}

export default function SignInForm() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const savedUsername = localStorage.getItem("remember");
    if (savedUsername) {
      setFormData((prev) => ({
        ...prev,
        username: savedUsername,
      }));
      setRememberMe(true);
    }
  }, []);

  const handlerSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const { email, username, password, confirmPassword } = formData;

    // เพิ่มการตรวจสอบ email เมื่อเป็นโหมดสมัครสมาชิก
    if (!username || !password || (!isLogin && (!confirmPassword || !email))) {
      console.warn("กรุณากรอกข้อมูลให้ครบถ้วน");
      setIsPending(false);
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      console.error("รหัสผ่านไม่ตรงกัน");
      setIsPending(false);
      return;
    }

    try {
      const response = isLogin
        ? await loginUser(username, password)
        : await registerUser(email, username, password); // เรียก registerUser พร้อม email

      if (response.success) {
        if (rememberMe) {
          localStorage.setItem("remember", username);
        } else {
          localStorage.removeItem("remember");
        }

        console.log("Success:", response.message);

        if (isLogin) {
          router.push("/"); // Login สำเร็จ ไปหน้า homepage
        } else {
          // Register สำเร็จ: เปลี่ยนไปแสดงฟอร์ม Login และล้างข้อมูลฟอร์ม
          setIsLogin(true);
          setFormData({
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
          });
          console.log("Registration successful, please log in.");
        }
      } else {
        console.error("Error:", response.message);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
    } finally {
      setIsPending(false);
    }
  };

  const handlerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setRememberMe(checked);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="flex flex-1 flex-col min-h-screen">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div className="mb-5 sm:mb-8">
          <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
            {isLogin ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
          </h1>
          <p className="text-sm text-gray-200 dark:text-gray-300">
            {isLogin
              ? "กรอกชื่อผู้ใช้งานและรหัสผ่านของคุณเพื่อเข้าสู่ระบบ!"
              : "กรอกข้อมูลเพื่อสร้างบัญชีผู้ใช้งานใหม่!"}
          </p>
        </div>
        <form onSubmit={handlerSubmit}>
          <div className="space-y-6">
            {/* เพิ่มช่องกรอก Email เฉพาะตอนสมัครสมาชิก */}
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
                value={formData.username}
                name="username"
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

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox checked={rememberMe} onChange={setRememberMe} />
                <span className="text-theme-sm block font-normal text-gray-700 dark:text-gray-400">
                  จำฉันไว้
                </span>
              </div>
            </div>

            <div>
              <Button disabled={isPending} className="w-full" size="sm">
                {isLogin ? "ลงชื่อเข้าใช้" : "สมัครสมาชิก"}
              </Button>
              <div className="mt-3 text-center text-sm">
                {isLogin ? (
                  <>
                    ยังไม่มีบัญชี?{" "}
                    <span
                      onClick={() => setIsLogin(false)}
                      className="cursor-pointer text-blue-500 hover:underline"
                    >
                      สมัครสมาชิก
                    </span>
                  </>
                ) : (
                  <>
                    มีบัญชีอยู่แล้ว?{" "}
                    <span
                      onClick={() => setIsLogin(true)}
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