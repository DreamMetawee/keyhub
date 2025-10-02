import { createContext, FC, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { AuthSending } from "../util/api";
import { API_ENDPOINT, API_VERSION } from "../util/process";

export interface UserProps {
  id: string;
  name: string;
  nickname: string;
  permission: "member" | "admin";
  username: string;
  phone: string; // Corrected: This is the required property
  avatar: string;
  status: boolean;
  email: string; // Added email property
}

interface UserContextProps {
  isLoggedIn: boolean;
  session: UserProps | null;
  loading: boolean;
  initialSession: () => void;
  login: (
    username: string,
    password: string
  ) => Promise<{
    success: boolean;
    message: string;
    token: string;
    user: UserProps;
  }>;
  // เพิ่ม register function ที่นี่
  register: (
    username: string,
    password: string,
    name: string,
    nickname: string
  ) => Promise<{
    success: boolean;
    message: string;
    token?: string; // token อาจจะไม่มีถ้า register ไม่สำเร็จ
    user?: UserProps; // user อาจจะไม่มีถ้า register ไม่สำเร็จ
  }>;
  logout: () => void;
}

const UserContext = createContext<UserContextProps>({
  isLoggedIn: false,
  session: null,
  loading: true,
  initialSession: () => {},
  login: async () => ({
    success: false,
    message: "",
    token: "",
    user: {
      id: "",
      name: "",
      nickname: "",
      permission: "member",
      username: "",
      phone: "", // Corrected: Changed from sphone to phone
      avatar: "",
      status: true,
      email:"",
    },
  }),
  // เพิ่ม default register function ที่นี่
  register: async () => ({
    success: false,
    message: "",
  }),
  logout: () => {},
});

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [session, setSession] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const initialSession = async () => {
    const token = Cookies.get("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await AuthSending().get(
        `${API_ENDPOINT}${API_VERSION}users/authen`
      );
      const { data } = response;
      if (data?.success) {
        setIsLoggedIn(true);
        setSession(data.user);
      } else {
        logout();
      }
    } catch (error: any) {
      console.error("Authentication failed:", error); // Log error instead of toast
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    username: string,
    password: string
  ): Promise<{
    success: boolean;
    message: string;
    token: string;
    user: UserProps;
  }> => {
    const res = await AuthSending().post(
      `${API_ENDPOINT}${API_VERSION}users/login`,
      { username: username.trim(), password: password.trim() }
    );

    if (res.data.success) {
      Cookies.set("token", res.data.token);
      Cookies.set("refreshToken", res.data.refreshToken);
      setIsLoggedIn(true);
      setSession(res.data.user);
    }

    return res.data;
  };

  // เพิ่ม implement ของ register function ที่นี่
  const register = async (
    username: string,
    password: string,
    name: string,
    nickname: string
  ): Promise<{
    success: boolean;
    message: string;
    token?: string;
    user?: UserProps;
  }> => {
    try {
      const res = await AuthSending().post(
        `${API_ENDPOINT}${API_VERSION}users/register`, // สมมุติ endpoint สำหรับ register
        {
          username: username.trim(),
          password: password.trim(),
          name: name.trim(),
          nickname: nickname.trim(),
        }
      );

      // ถ้าการลงทะเบียนสำเร็จ อาจจะ login อัตโนมัติ หรือแค่คืนค่าสำเร็จ
      if (res.data.success) {
        // คุณอาจจะเลือกที่จะล็อกอินผู้ใช้ทันทีหลังจากการลงทะเบียน
        // หรือแค่คืนค่าสำเร็จและให้ผู้ใช้ไปล็อกอินเอง
        // ในตัวอย่างนี้ ผมจะคืนค่า token และ user ถ้ามี
        if (res.data.token && res.data.user) {
          Cookies.set("token", res.data.token);
          Cookies.set("refreshToken", res.data.refreshToken);
          setIsLoggedIn(true);
          setSession(res.data.user);
        }
        return {
          success: true,
          message: res.data.message || "Registration successful!",
          token: res.data.token,
          user: res.data.user,
        };
      } else {
        return {
          success: false,
          message: res.data.message || "Registration failed.",
        };
      }
    } catch (error: any) {
      console.error("Registration failed:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred during registration.",
      };
    }
  };

  useEffect(() => {
    initialSession();
  }, []);

  const logout = () => {
    setIsLoggedIn(false);
    setSession(null);
    Cookies.remove("token");
    Cookies.remove("refreshToken"); // Also remove refreshToken on logout
  };

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        session,
        loading,
        initialSession,
        login,
        register,
        logout,
      }} // เพิ่ม register ใน value
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
