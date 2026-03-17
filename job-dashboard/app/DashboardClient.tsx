"use client";

import { useState } from "react";
import Link from "next/link";
import { Job, Stage, STAGE_LABELS, STAGE_COLORS } from "@/lib/types";
import {
  ArrowRight, Briefcase, CheckCircle, XCircle, Clock, TrendingUp, X,
} from "lucide-react";

interface Props {
  jobs: Job[];
}

interface PopupState {
  title: string;
  jobs: Job[];
}

export default function DashboardClient({ jobs }: Props) {
  const [popup, setPopup] = useState<PopupState | null>(null);

  const total = jobs.length;
  const offers = jobs.filter((j) => j.stage === "offer").length;
  const rejected = jobs.filter((j) => j.stage === "rejected").length;
  const active = jobs.filter(
    (j) => !["rejected", "withdrawn", "offer"].includes(j.stage)
  ).length;
  const offerRate = total > 0 ? Math.round((offers / total) * 100) : 0;

  const stageCount: Partial<Record<Stage, number>> = {};
  jobs.forEach((j) => {
    stageCount[j.stage] = (stageCount[j.stage] || 0) + 1;
  });

  const recent = [...jobs]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const today = new Date();
  const upcoming = jobs
    .filter((j) => j.nextEventDate && new Date(j.nextEventDate) >= today)
    .sort((a, b) => new Date(a.nextEventDate!).getTime() - new Date(b.nextEventDate!).getTime())
    .slice(0, 4);

  function openPopup(title: string, filtered: Job[]) {
    setPopup({ title, jobs: filtered });
  }

  const statsCards = [
    {
      label: "총 지원",
      value: total,
      icon: Briefcase,
      color: "text-blue-400",
      filtered: jobs,
    },
    {
      label: "합격",
      value: offers,
      icon: CheckCircle,
      color: "text-[#c8ff4d]",
      filtered: jobs.filter((j) => j.stage === "offer"),
    },
    {
      label: "불합격",
      value: rejected,
      icon: XCircle,
      color: "text-red-400",
      filtered: jobs.filter((j) => j.stage === "rejected"),
    },
    {
      label: "진행 중",
      value: active,
      icon: Clock,
      color: "text-orange-400",
      filtered: jobs.filter((j) => !["rejected", "withdrawn", "offer"].includes(j.stage)),
    },
  ];

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-black tracking-tight">대시보드</h1>
        <p className="text-white/40 text-sm mt-1">취업 활동 전체 현황</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {statsCards.map(({ label, value, icon: Icon, color, filtered }) => (
          <button
            key={label}
            onClick={() => openPopup(label, filtered)}
            className="bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-5 text-left hover:border-white/20 hover:bg-[#1f1f1f] transition-all active:scale-[0.98] cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/40 text-xs font-medium">{label}</span>
              <Icon size={16} className={`${color} group-hover:scale-110 transition-transform`} />
            </div>
            <div className={`text-3xl font-black ${color}`}>{value}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Offer rate */}
        <div className="bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-[#c8ff4d]" />
            <span className="text-xs font-medium text-white/40">합격률</span>
          </div>
          <div className="text-5xl font-black text-[#c8ff4d] tracking-tight">
            {offerRate}<span className="text-2xl text-white/30">%</span>
          </div>
          <div className="w-full bg-white/[0.06] rounded-full h-1.5">
            <div
              className="bg-[#c8ff4d] h-1.5 rounded-full transition-all"
              style={{ width: `${offerRate}%` }}
            />
          </div>
        </div>

        {/* Stage breakdown */}
        <div className="md:col-span-2 bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-5">
          <h3 className="text-xs font-medium text-white/40 mb-4">전형 단계별 현황</h3>
          <div className="space-y-2.5">
            {Object.entries(stageCount).map(([stage, count]) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              const color = STAGE_COLORS[stage as Stage];
              const stageJobs = jobs.filter((j) => j.stage === stage);
              return (
                <button
                  key={stage}
                  onClick={() => openPopup(STAGE_LABELS[stage as Stage], stageJobs)}
                  className="w-full flex items-center gap-3 hover:bg-white/[0.03] rounded-lg px-1 py-0.5 -mx-1 transition-colors group cursor-pointer"
                >
                  <span className="text-xs text-white/50 w-20 flex-shrink-0 text-left group-hover:text-white/70 transition-colors">
                    {STAGE_LABELS[stage as Stage]}
                  </span>
                  <div className="flex-1 bg-white/[0.06] rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                  <span className="text-xs text-white/50 w-6 text-right">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent updates */}
        <div className="bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-medium text-white/40">최근 업데이트</h3>
            <Link href="/kanban" className="text-[10px] text-[#c8ff4d] flex items-center gap-1 hover:opacity-70">
              전체 보기 <ArrowRight size={10} />
            </Link>
          </div>
          <div className="space-y-3">
            {recent.map((job) => (
              <button
                key={job.id}
                onClick={() => openPopup(job.company, [job])}
                className="w-full flex items-center gap-3 hover:bg-white/[0.03] rounded-lg px-1 py-0.5 -mx-1 transition-colors cursor-pointer"
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: STAGE_COLORS[job.stage] }}
                />
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-semibold truncate">{job.company}</p>
                  <p className="text-[11px] text-white/30 truncate">{job.position}</p>
                </div>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                  style={{
                    background: `${STAGE_COLORS[job.stage]}20`,
                    color: STAGE_COLORS[job.stage],
                  }}
                >
                  {STAGE_LABELS[job.stage]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Upcoming events */}
        <div className="bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-medium text-white/40">다가오는 일정</h3>
            <Link href="/calendar" className="text-[10px] text-[#c8ff4d] flex items-center gap-1 hover:opacity-70">
              캘린더 <ArrowRight size={10} />
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-white/20 text-sm text-center py-6">예정된 일정이 없어요.</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((job) => {
                const d = new Date(job.nextEventDate!);
                const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <button
                    key={job.id}
                    onClick={() => openPopup(job.company, [job])}
                    className="w-full flex items-start gap-3 hover:bg-white/[0.03] rounded-lg px-1 py-0.5 -mx-1 transition-colors cursor-pointer"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-white/[0.04] border border-white/[0.06] rounded-lg flex flex-col items-center justify-center">
                      <span className="text-[10px] text-white/30 leading-none">
                        {d.getMonth() + 1}월
                      </span>
                      <span className="text-sm font-black leading-none">{d.getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-semibold truncate">{job.company}</p>
                      <p className="text-[11px] text-white/40 truncate">{job.nextEventNote}</p>
                    </div>
                    <span className={`text-[10px] font-bold flex-shrink-0 ${diff <= 3 ? "text-red-400" : "text-white/30"}`}>
                      {diff === 0 ? "오늘" : `D-${diff}`}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Popup */}
      {popup && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setPopup(null)}
        >
          <div
            className="bg-[#1a1a1a] border border-white/[0.1] rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Popup header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <div>
                <h2 className="font-bold text-sm">{popup.title}</h2>
                <p className="text-[11px] text-white/40 mt-0.5">{popup.jobs.length}개 항목</p>
              </div>
              <button
                onClick={() => setPopup(null)}
                className="text-white/40 hover:text-white/70 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Popup body */}
            <div className="overflow-y-auto flex-1 p-3 space-y-2">
              {popup.jobs.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-8">해당 항목이 없어요.</p>
              ) : (
                popup.jobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-start gap-3 bg-[#141414] border border-white/[0.06] rounded-xl p-3.5"
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                      style={{ background: STAGE_COLORS[job.stage] }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{job.company}</p>
                      <p className="text-[11px] text-white/40 truncate">{job.position}</p>
                      {job.nextEventDate && (
                        <p className="text-[10px] text-[#c8ff4d]/60 mt-1">
                          다음 일정: {new Date(job.nextEventDate).toLocaleDateString("ko-KR")}
                          {job.nextEventNote && ` · ${job.nextEventNote}`}
                        </p>
                      )}
                    </div>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 mt-0.5"
                      style={{
                        background: `${STAGE_COLORS[job.stage]}20`,
                        color: STAGE_COLORS[job.stage],
                      }}
                    >
                      {STAGE_LABELS[job.stage]}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Popup footer */}
            <div className="px-5 py-3 border-t border-white/[0.06]">
              <Link
                href="/kanban"
                onClick={() => setPopup(null)}
                className="text-xs text-[#c8ff4d] flex items-center gap-1 hover:opacity-70"
              >
                지원현황에서 상세 보기 <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
