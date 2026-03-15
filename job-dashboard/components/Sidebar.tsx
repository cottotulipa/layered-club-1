"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Columns,
  BarChart2,
  CalendarDays,
  Sparkles,
  FileText,
} from "lucide-react";

const nav = [
  { href: "/", icon: LayoutDashboard, label: "대시보드" },
  { href: "/kanban", icon: Columns, label: "칸반보드" },
  { href: "/stats", icon: BarChart2, label: "합격률 통계" },
  { href: "/calendar", icon: CalendarDays, label: "일정 관리" },
  { href: "/insights", icon: Sparkles, label: "AI 인사이트" },
  { href: "/cover-letters", icon: FileText, label: "지원서 관리" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 flex-shrink-0 border-r border-white/[0.06] bg-[#141414] flex flex-col">
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="text-base font-black tracking-tight text-[#f5f4f0]">
            취준
          </span>
          <span className="bg-[#c8ff4d] text-[#0f0f0f] text-[10px] font-bold px-2 py-0.5 rounded-full">
            DASH
          </span>
        </div>
        <p className="text-[11px] text-white/30 mt-1">Job Application Tracker</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
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
        <p className="text-[10px] text-white/20">
          데이터: data/jobs.json
        </p>
      </div>
    </aside>
  );
}
