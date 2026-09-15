"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./../Navbar/Navbar";
import Sidebar from "./../Sidebar/Sidebar";
import MobileNav from "./../Navbar/Mobilenav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  // 1. تحديد قائمة بمسارات صفحات الـ Auth
  const authRoutes = ["/logIn", "/sign-up", "/forgotPass", "/resetPass"];

  // 2. التحقق مما إذا كان المستخدم في إحدى صفحات Auth
  const isAuthPage = authRoutes.some((route) => pathname.startsWith(route));

  // 3. عرض المحتوى فقط بدون Sidebar/Navbar إذا كانت صفحة Auth
  if (isAuthPage) {
    return <main className="min-h-screen w-full bg-surface">{children}</main>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isCollapsed ? "md:pl-20" : "md:pl-64"
        }`}
      >
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-auto pb-20 md:pb-6">{children}</main>
      </div>

      <MobileNav />
    </div>
  );
}
