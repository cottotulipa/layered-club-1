"use client";

import { useEffect, useState } from "react";
import { Sparkles, RefreshCw, TrendingUp, AlertCircle, Zap, CheckSquare } from "lucide-react";

interface Insights {
  overall: string;
  rejectionPattern: string;
  improvements: string[];
  actions: string[];
}

export default function InsightsView() {
  const [data, setData] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchInsights() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai");
      if (!res.ok) throw new Error("API 오류");
      const json = await res.json();
      setData(json);
    } catch {
      setError("인사이트를 불러오는 중 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchInsights(); }, []);

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-wrap items-start sm:items-center justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Sparkles size={22} className="text-[#c8ff4d]" />
            AI 인사이트
          </h1>
          <p className="text-white/40 text-sm mt-1">Claude AI가 분석한 취업 활동 인사이트</p>
        </div>
        <button
          onClick={fetchInsights}
          disabled={loading}
          className="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-40"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          새로고침
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-10 h-10 border-2 border-[#c8ff4d]/30 border-t-[#c8ff4d] rounded-full animate-spin" />
          <p className="text-white/30 text-sm">AI가 분석 중이에요...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 text-red-400 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && data && (
        <div className="space-y-5">
          {/* Overall */}
          <div className="bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-[#c8ff4d]" />
              <h2 className="text-sm font-bold text-white/70">전반적인 평가</h2>
            </div>
            <p className="text-[#f5f4f0] text-base leading-relaxed">{data.overall}</p>
          </div>

          {/* Rejection pattern */}
          <div className="bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={16} className="text-orange-400" />
              <h2 className="text-sm font-bold text-white/70">탈락 패턴 분석</h2>
            </div>
            <p className="text-white/75 text-sm leading-relaxed">{data.rejectionPattern}</p>
          </div>

          {/* Improvements */}
          <div className="bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Zap size={16} className="text-blue-400" />
              <h2 className="text-sm font-bold text-white/70">개선 포인트</h2>
            </div>
            <div className="space-y-3">
              {data.improvements.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-blue-400/60 font-black text-sm flex-shrink-0 mt-0.5">0{i + 1}</span>
                  <p className="text-white/70 text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gradient-to-br from-[#c8ff4d]/[0.06] to-transparent border border-[#c8ff4d]/[0.12] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <CheckSquare size={16} className="text-[#c8ff4d]" />
              <h2 className="text-sm font-bold text-white/70">이번 주 액션 아이템</h2>
            </div>
            <div className="space-y-3">
              {data.actions.map((action, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/[0.03] rounded-lg p-3">
                  <div className="w-5 h-5 rounded border border-[#c8ff4d]/30 flex-shrink-0 mt-0.5" />
                  <p className="text-white/80 text-sm leading-relaxed">{action}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-[11px] text-white/20 pt-2">
            * 인사이트는 data/jobs.json의 현재 데이터를 기반으로 생성됩니다.
            {" "}ANTHROPIC_API_KEY가 없는 경우 기본 분석을 제공합니다.
          </p>
        </div>
      )}
    </div>
  );
}
