import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import MobileNav from "@/components/layout/Navbar/Mobilenav";
import AppLayout from "@/components/layout/Applayout/Applayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TASKLY",
  description: "Task Management System",
  icons: "/Icon.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased min-h-screen bg-background text-foreground`}
      >
        <AppLayout>{children}</AppLayout>

        <Toaster position="top-center" richColors />
        <MobileNav />
      </body>
    </html>
  );
}
