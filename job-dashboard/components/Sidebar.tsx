"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { UserButton, useUser, SignedIn } from "@clerk/nextjs";
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

function NavContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="text-base font-black tracking-tight text-[#f5f4f0]">취준</span>
          <span className="bg-[#c8ff4d] text-[#0f0f0f] text-[10px] font-bold px-2 py-0.5 rounded-full">
            DASH
          </span>
        </div>
        <p className="text-[11px] text-white/30 mt-1">Job Application Tracker</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onLinkClick}
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

      {/* User info + sign out */}
      <SignedIn>
        <div className="px-4 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                  userButtonPopoverCard: "bg-[#1a1a1a] border border-white/10",
                },
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-white/80">
                {user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? "사용자"}
              </p>
              <p className="text-[10px] text-white/30 truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
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

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 flex-shrink-0 border-r border-white/[0.06] bg-[#141414] flex-col h-screen sticky top-0">
        <NavContent />
      </aside>

      {/* Mobile sidebar (drawer) */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-[#141414] border-r border-white/[0.06] flex flex-col transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-end px-4 pt-4">
          <button
            className="text-white/40 hover:text-white/70 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        <NavContent onLinkClick={() => setMobileOpen(false)} />
      </aside>
    </>
  );
}
