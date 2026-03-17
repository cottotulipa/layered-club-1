import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "취준 대시보드",
  description: "취업 지원 현황 관리 대시보드",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#c8ff4d",
          colorBackground: "#141414",
          colorInputBackground: "#1a1a1a",
          colorText: "#f5f4f0",
        },
      }}
    >
      <html lang="ko">
        <body className="flex h-screen overflow-hidden bg-[#0f0f0f] text-[#f5f4f0]">
          <Sidebar />
          <main className="flex-1 overflow-y-auto scrollbar-thin pt-14 md:pt-0">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
