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
        className={`${geistSans.variable} ${geistMono.variable} bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white min-h-screen`}
      >
        <div className="bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
          {/* Sidebar fixed */}
          <Sidebar />

          <div className="flex-1 flex flex-col " style={{ marginLeft: "256px" }}>
            <Header />
            <main className="flex-1 mt-[72px] overflow-y-auto p-4 bg-gray-900 text-white">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
