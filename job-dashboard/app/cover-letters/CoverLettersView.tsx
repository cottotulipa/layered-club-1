"use client";

import { useState } from "react";
import { Job } from "@/lib/types";
import { FileText, Building2, Briefcase, ChevronRight } from "lucide-react";
import JobModal from "@/components/JobModal";

interface Props {
  jobs: Job[];
}

export default function CoverLettersView({ jobs }: Props) {
  const [selected, setSelected] = useState<Job | null>(jobs[0] ?? null);
  const [modal, setModal] = useState<{ open: boolean; job?: Partial<Job> }>({ open: false });

  async function saveJob(data: Partial<Job>) {
    const method = data.id ? "PATCH" : "POST";
    const url = data.id ? `/api/jobs/${data.id}` : "/api/jobs";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setModal({ open: false });
    window.location.reload();
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight">지원서 관리</h1>
          <p className="text-white/40 text-sm mt-1">회사별 자기소개서 및 지원서 저장</p>
        </div>
        <button
          onClick={() => setModal({ open: true, job: {} })}
          className="flex items-center gap-2 bg-[#c8ff4d] text-[#0f0f0f] font-bold text-sm px-4 py-2 rounded-lg hover:bg-[#d4ff66] transition-colors"
        >
          <FileText size={14} />
          새 지원서
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <FileText size={40} className="text-white/10" />
          <p className="text-white/30 text-sm">저장된 지원서가 없어요.</p>
          <p className="text-white/20 text-xs">칸반보드에서 자기소개서를 입력하면 여기에 표시돼요.</p>
        </div>
      ) : (
        <div className="flex gap-5 h-[calc(100vh-200px)]">
          {/* List */}
          <div className="w-64 flex-shrink-0 space-y-2 overflow-y-auto scrollbar-thin">
            {jobs.map((job) => (
              <button
                key={job.id}
                onClick={() => setSelected(job)}
                className={`w-full text-left p-4 rounded-xl border transition-colors ${
                  selected?.id === job.id
                    ? "bg-[#c8ff4d]/[0.08] border-[#c8ff4d]/30"
                    : "bg-[#1a1a1a] border-white/[0.06] hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Building2 size={11} className="text-white/30 flex-shrink-0" />
                      <p className="text-sm font-bold truncate">{job.company}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase size={10} className="text-white/20 flex-shrink-0" />
                      <p className="text-[11px] text-white/40 truncate">{job.position}</p>
                    </div>
                  </div>
                  <ChevronRight size={13} className="text-white/20 flex-shrink-0" />
                </div>
                <p className="text-[10px] text-white/25 mt-2 line-clamp-2 leading-relaxed">
                  {job.coverLetter}
                </p>
              </button>
            ))}
          </div>

          {/* Content */}
          {selected && (
            <div className="flex-1 bg-[#1a1a1a] border border-white/[0.06] rounded-xl overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold">{selected.company}</h2>
                  <p className="text-xs text-white/40">{selected.position}</p>
                </div>
                <button
                  onClick={() => setModal({ open: true, job: selected })}
                  className="text-xs px-3 py-1.5 bg-white/[0.06] rounded-lg hover:bg-white/10 transition-colors"
                >
                  수정
                </button>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
                <div className="mb-6">
                  <p className="text-[11px] text-white/30 mb-3 uppercase tracking-widest font-bold">자기소개서</p>
                  <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-5">
                    <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                      {selected.coverLetter || "내용 없음"}
                    </p>
                  </div>
                </div>

                {selected.notes && (
                  <div>
                    <p className="text-[11px] text-white/30 mb-3 uppercase tracking-widest font-bold">메모</p>
                    <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-5">
                      <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">
                        {selected.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {modal.open && (
        <JobModal
          job={modal.job}
          onClose={() => setModal({ open: false })}
          onSave={saveJob}
        />
      )}
    </div>
  );
}
