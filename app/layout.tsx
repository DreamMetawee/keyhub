// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/sidebar";
import Header from "./components/header";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KeyHub - Game Platform",
  description: "Game key marketplace interface",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} 
          bg-gradient-to-br from-black via-gray-900 to-gray-800 
          text-white min-h-screen flex`}
      >
        {/* Sidebar */}
        <aside
          className="hidden md:flex fixed left-0 top-0 h-full w-64 
            bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800
            border-r border-gray-700 shadow-lg"
        >
          <Sidebar />
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col ml-0 md:ml-64">
          <Header />
          <main className="flex-1 mt-[72px] overflow-y-auto p-4 bg-gray-900">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
