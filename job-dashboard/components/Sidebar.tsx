"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Columns,
  BarChart2,
  CalendarDays,
  Sparkles,
  FileText,
  Menu,
  X,
} from "lucide-react";

const nav = [
  { href: "/", icon: LayoutDashboard, label: "대시보드" },
  { href: "/kanban", icon: Columns, label: "지원현황" },
  { href: "/stats", icon: BarChart2, label: "합격률 통계" },
  { href: "/calendar", icon: CalendarDays, label: "일정 관리" },
  { href: "/insights", icon: Sparkles, label: "AI 인사이트" },
  { href: "/cover-letters", icon: FileText, label: "지원서 관리" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <>
      <div className="px-5 py-5 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base font-black tracking-tight text-[#f5f4f0]">취준</span>
          <span className="bg-[#c8ff4d] text-[#0f0f0f] text-[10px] font-bold px-2 py-0.5 rounded-full">
            DASH
          </span>
        </div>
        <button
          className="md:hidden text-white/40 hover:text-white/70 transition-colors"
          onClick={() => setMobileOpen(false)}
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-[#c8ff4d]/10 text-[#c8ff4d]"
                  : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-white/[0.06]">
        <p className="text-[10px] text-white/20">데이터: data/jobs.json</p>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-[#1a1a1a] border border-white/[0.1] p-2 rounded-lg text-white/60 hover:text-white/90 transition-colors"
        onClick={() => setMobileOpen(true)}
        aria-label="메뉴 열기"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop sidebar (always visible) */}
      <aside className="hidden md:flex w-56 flex-shrink-0 border-r border-white/[0.06] bg-[#141414] flex-col h-screen sticky top-0">
        {navContent}
      </aside>

      {/* Mobile sidebar (drawer) */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-[#141414] border-r border-white/[0.06] flex flex-col transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </aside>
    </>
  );
}
