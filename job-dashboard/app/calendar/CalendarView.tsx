"use client";

import { useState } from "react";
import { Job, STAGE_COLORS } from "@/lib/types";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

interface CalEvent {
  date: string;
  label: string;
  company: string;
  type: "deadline" | "event";
  color: string;
}

interface Props {
  jobs: Job[];
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function CalendarView({ jobs }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  // Build events map
  const eventsByDate: Record<string, CalEvent[]> = {};
  jobs.forEach((job) => {
    if (job.deadline) {
      const d = job.deadline;
      if (!eventsByDate[d]) eventsByDate[d] = [];
      eventsByDate[d].push({
        date: d,
        label: "마감",
        company: job.company,
        type: "deadline",
        color: "#ef4444",
      });
    }
    if (job.nextEventDate) {
      const d = job.nextEventDate;
      if (!eventsByDate[d]) eventsByDate[d] = [];
      eventsByDate[d].push({
        date: d,
        label: job.nextEventNote || "일정",
        company: job.company,
        type: "event",
        color: STAGE_COLORS[job.stage],
      });
    }
  });

  // Calendar grid
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete rows
  while (cells.length % 7 !== 0) cells.push(null);

  const todayStr = today.toISOString().slice(0, 10);

  // Upcoming events list (next 30 days)
  const upcoming = jobs
    .flatMap((job) => {
      const evts: CalEvent[] = [];
      if (job.deadline) {
        evts.push({ date: job.deadline, label: "마감", company: job.company, type: "deadline", color: "#ef4444" });
      }
      if (job.nextEventDate && job.nextEventNote) {
        evts.push({ date: job.nextEventDate, label: job.nextEventNote, company: job.company, type: "event", color: STAGE_COLORS[job.stage] });
      }
      return evts;
    })
    .filter((e) => e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 8);

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-black tracking-tight">일정 관리</h1>
        <p className="text-white/40 text-sm mt-1">마감일 및 면접 일정</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-4 sm:p-6">
          {/* Nav */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white/80 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <h2 className="text-base font-bold">
              {year}년 {month + 1}월
            </h2>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white/80 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-2">
            {WEEKDAYS.map((d, i) => (
              <div
                key={d}
                className={`text-center text-xs font-medium py-1 ${
                  i === 0 ? "text-red-400/60" : i === 6 ? "text-blue-400/60" : "text-white/30"
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (day === null) return <div key={i} />;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isToday = dateStr === todayStr;
              const events = eventsByDate[dateStr] || [];
              const dayOfWeek = i % 7;

              return (
                <div
                  key={i}
                  className={`min-h-[52px] sm:min-h-[72px] rounded-lg p-1 sm:p-1.5 border transition-colors ${
                    isToday
                      ? "border-[#c8ff4d]/40 bg-[#c8ff4d]/[0.05]"
                      : "border-white/[0.04] hover:border-white/[0.1] hover:bg-white/[0.02]"
                  }`}
                >
                  <span
                    className={`text-xs font-bold block mb-1 ${
                      isToday
                        ? "text-[#c8ff4d]"
                        : dayOfWeek === 0
                        ? "text-red-400/60"
                        : dayOfWeek === 6
                        ? "text-blue-400/60"
                        : "text-white/50"
                    }`}
                  >
                    {day}
                  </span>
                  <div className="space-y-0.5">
                    {events.slice(0, 2).map((evt, ei) => (
                      <div
                        key={ei}
                        className="text-[9px] leading-tight px-1 py-0.5 rounded truncate"
                        style={{ background: `${evt.color}20`, color: evt.color }}
                        title={`${evt.company} - ${evt.label}`}
                      >
                        {evt.company}
                      </div>
                    ))}
                    {events.length > 2 && (
                      <div className="text-[9px] text-white/30 pl-1">+{events.length - 2}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-red-400/30" />
              <span className="text-[11px] text-white/30">마감일</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#c8ff4d]/30" />
              <span className="text-[11px] text-white/30">면접/일정</span>
            </div>
          </div>
        </div>

        {/* Upcoming list */}
        <div className="bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Clock size={13} className="text-white/30" />
            <h3 className="text-xs font-medium text-white/40">다가오는 일정</h3>
          </div>

          {upcoming.length === 0 ? (
            <p className="text-white/20 text-sm text-center py-12">예정된 일정이 없어요</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((evt, i) => {
                const d = new Date(evt.date);
                const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b border-white/[0.04] last:border-0 last:pb-0">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-lg flex flex-col items-center justify-center"
                      style={{ background: `${evt.color}15` }}
                    >
                      <span className="text-[9px] font-medium leading-none" style={{ color: evt.color }}>
                        {d.getMonth() + 1}월
                      </span>
                      <span className="text-sm font-black leading-none" style={{ color: evt.color }}>
                        {d.getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold leading-tight">{evt.company}</p>
                      <p className="text-[11px] text-white/40 mt-0.5 truncate">{evt.label}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold flex-shrink-0 ${
                        diff === 0 ? "text-[#c8ff4d]" : diff <= 3 ? "text-red-400" : "text-white/25"
                      }`}
                    >
                      {diff === 0 ? "오늘" : diff < 0 ? `+${Math.abs(diff)}` : `D-${diff}`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
