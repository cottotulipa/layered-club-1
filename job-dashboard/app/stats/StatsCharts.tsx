"use client";

import { Job, Stage, STAGE_LABELS, STAGE_COLORS } from "@/lib/types";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

interface Props {
  jobs: Job[];
}

export default function StatsCharts({ jobs }: Props) {
  const total = jobs.length;
  const offers = jobs.filter((j) => j.stage === "offer").length;
  const rejected = jobs.filter((j) => j.stage === "rejected").length;

  // Stage pie data
  const stageMap: Partial<Record<Stage, number>> = {};
  jobs.forEach((j) => { stageMap[j.stage] = (stageMap[j.stage] || 0) + 1; });
  const pieData = Object.entries(stageMap).map(([stage, count]) => ({
    name: STAGE_LABELS[stage as Stage],
    value: count,
    color: STAGE_COLORS[stage as Stage],
  }));

  // Monthly applications
  const monthMap: Record<string, number> = {};
  jobs.forEach((j) => {
    if (j.appliedDate) {
      const m = j.appliedDate.slice(0, 7);
      monthMap[m] = (monthMap[m] || 0) + 1;
    }
  });
  const monthData = Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({
      month: month.replace(/^\d{4}-/, ""),
      count,
    }));

  // Funnel: progression from applied to offer
  const funnelStages: Stage[] = [
    "applied", "document_screening", "interview_1", "interview_2", "final", "offer",
  ];
  const funnelData = funnelStages.map((s) => ({
    name: STAGE_LABELS[s],
    count: jobs.filter((j) => {
      const stageIdx = funnelStages.indexOf(j.stage);
      const thisIdx = funnelStages.indexOf(s);
      return stageIdx >= thisIdx || j.stage === "offer";
    }).length,
    passed: jobs.filter((j) => {
      const stageIdx = funnelStages.indexOf(j.stage as Stage);
      const thisIdx = funnelStages.indexOf(s);
      return stageIdx > thisIdx || j.stage === "offer";
    }).length,
  }));

  // Pass rate by stage
  const passRateData = funnelStages.slice(0, -1).map((s, i) => {
    const thisCount = funnelData[i].count;
    const nextCount = funnelData[i + 1]?.count || 0;
    const rate = thisCount > 0 ? Math.round((nextCount / thisCount) * 100) : 0;
    return { name: STAGE_LABELS[s], rate };
  });

  // Priority distribution
  const priorityMap = { high: 0, medium: 0, low: 0 };
  jobs.forEach((j) => { priorityMap[j.priority]++; });
  const priorityData = [
    { name: "높음", value: priorityMap.high, color: "#ef4444" },
    { name: "보통", value: priorityMap.medium, color: "#f59e0b" },
    { name: "낮음", value: priorityMap.low, color: "#6b7280" },
  ];

  const CustomTooltip = ({ payload, label }: { payload?: { name: string; value: number }[]; label?: string }) => {
    if (payload && payload.length) {
      return (
        <div className="bg-[#242424] border border-white/10 rounded-lg px-3 py-2 text-xs">
          {label && <p className="text-white/50 mb-1">{label}</p>}
          {payload.map((p) => (
            <p key={p.name} className="text-white/80">
              {p.name}: <span className="font-bold text-white">{p.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-black tracking-tight">합격률 통계</h1>
        <p className="text-white/40 text-sm mt-1">지원 현황 데이터 분석</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          { label: "총 지원", value: total, unit: "건" },
          { label: "최종 합격", value: offers, unit: "건", accent: true },
          { label: "서류 합격률", value: total > 0 ? Math.round(((total - rejected) / total) * 100) : 0, unit: "%" },
          { label: "최종 합격률", value: total > 0 ? Math.round((offers / total) * 100) : 0, unit: "%", accent: true },
        ].map(({ label, value, unit, accent }) => (
          <div key={label} className="bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-5">
            <p className="text-xs text-white/40 mb-2">{label}</p>
            <p className={`text-3xl font-black ${accent ? "text-[#c8ff4d]" : "text-white"}`}>
              {value}<span className="text-base font-medium opacity-50">{unit}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Stage distribution pie */}
        <div className="bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-5">
          <h3 className="text-xs font-medium text-white/40 mb-4">전형 단계 분포</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-white/60">{d.name}</span>
                  </div>
                  <span className="font-bold">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly applications */}
        <div className="bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-5">
          <h3 className="text-xs font-medium text-white/40 mb-4">월별 지원 현황</h3>
          {monthData.length === 0 ? (
            <p className="text-white/20 text-sm text-center py-16">지원 날짜 데이터가 없어요</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="지원 수" fill="#c8ff4d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Funnel / pass rate bar */}
        <div className="bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-5">
          <h3 className="text-xs font-medium text-white/40 mb-4">단계별 통과율</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={passRateData} barSize={20} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} unit="%" />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="rate" name="통과율" fill="#ff6b35" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority distribution */}
        <div className="bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-5">
          <h3 className="text-xs font-medium text-white/40 mb-4">우선순위 분포</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={160}>
              <PieChart>
                <Pie
                  data={priorityData.filter((d) => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {priorityData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {priorityData.map((d) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                    <span className="text-sm text-white/60">{d.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold">{d.value}</span>
                    <span className="text-xs text-white/30 ml-1">
                      ({total > 0 ? Math.round((d.value / total) * 100) : 0}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
