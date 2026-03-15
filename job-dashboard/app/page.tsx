import { readJobs } from "@/lib/storage";
import { STAGE_LABELS, STAGE_COLORS, Stage } from "@/lib/types";
import Link from "next/link";
import { ArrowRight, Briefcase, CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const jobs = await readJobs();

  const total = jobs.length;
  const offers = jobs.filter((j) => j.stage === "offer").length;
  const rejected = jobs.filter((j) => j.stage === "rejected").length;
  const active = jobs.filter(
    (j) => !["rejected", "withdrawn", "offer"].includes(j.stage)
  ).length;
  const offerRate = total > 0 ? Math.round((offers / total) * 100) : 0;

  // Stage breakdown
  const stageCount: Partial<Record<Stage, number>> = {};
  jobs.forEach((j) => {
    stageCount[j.stage] = (stageCount[j.stage] || 0) + 1;
  });

  // Recent jobs
  const recent = [...jobs]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  // Upcoming events
  const today = new Date();
  const upcoming = jobs
    .filter((j) => j.nextEventDate && new Date(j.nextEventDate) >= today)
    .sort((a, b) => new Date(a.nextEventDate!).getTime() - new Date(b.nextEventDate!).getTime())
    .slice(0, 4);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight">대시보드</h1>
        <p className="text-white/40 text-sm mt-1">취업 활동 전체 현황</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "총 지원", value: total, icon: Briefcase, color: "text-blue-400" },
          { label: "합격", value: offers, icon: CheckCircle, color: "text-[#c8ff4d]" },
          { label: "불합격", value: rejected, icon: XCircle, color: "text-red-400" },
          { label: "진행 중", value: active, icon: Clock, color: "text-orange-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/40 text-xs font-medium">{label}</span>
              <Icon size={16} className={color} />
            </div>
            <div className={`text-3xl font-black ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
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
        <div className="col-span-2 bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-5">
          <h3 className="text-xs font-medium text-white/40 mb-4">전형 단계별 현황</h3>
          <div className="space-y-2.5">
            {Object.entries(stageCount).map(([stage, count]) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              const color = STAGE_COLORS[stage as Stage];
              return (
                <div key={stage} className="flex items-center gap-3">
                  <span className="text-xs text-white/50 w-20 flex-shrink-0">
                    {STAGE_LABELS[stage as Stage]}
                  </span>
                  <div className="flex-1 bg-white/[0.06] rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                  <span className="text-xs text-white/50 w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
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
              <div key={job.id} className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: STAGE_COLORS[job.stage] }}
                />
                <div className="flex-1 min-w-0">
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
              </div>
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
                  <div key={job.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-white/[0.04] border border-white/[0.06] rounded-lg flex flex-col items-center justify-center">
                      <span className="text-[10px] text-white/30 leading-none">
                        {d.getMonth() + 1}월
                      </span>
                      <span className="text-sm font-black leading-none">{d.getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{job.company}</p>
                      <p className="text-[11px] text-white/40 truncate">{job.nextEventNote}</p>
                    </div>
                    <span className={`text-[10px] font-bold flex-shrink-0 ${diff <= 3 ? "text-red-400" : "text-white/30"}`}>
                      {diff === 0 ? "오늘" : `D-${diff}`}
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
