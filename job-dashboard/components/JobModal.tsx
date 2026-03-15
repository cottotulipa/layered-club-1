"use client";

import { useState } from "react";
import { Job, Stage, STAGE_LABELS } from "@/lib/types";
import { X } from "lucide-react";

interface Props {
  job?: Partial<Job>;
  onClose: () => void;
  onSave: (job: Partial<Job>) => Promise<void>;
  onDelete?: () => Promise<void>;
}

const STAGES: Stage[] = [
  "wishlist", "applied", "document_screening",
  "interview_1", "interview_2", "final", "offer", "rejected", "withdrawn",
];

export default function JobModal({ job, onClose, onSave, onDelete }: Props) {
  const [form, setForm] = useState<Partial<Job>>({
    company: "",
    position: "",
    department: "",
    stage: "applied",
    priority: "medium",
    appliedDate: "",
    deadline: "",
    nextEventDate: "",
    nextEventNote: "",
    salary: "",
    location: "",
    jobUrl: "",
    coverLetter: "",
    notes: "",
    tags: [],
    ...job,
  });
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const set = (k: keyof Job, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSave() {
    if (!form.company || !form.position) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  }

  function addTag() {
    if (!tagInput.trim()) return;
    set("tags", [...(form.tags || []), tagInput.trim()]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    set("tags", (form.tags || []).filter((t) => t !== tag));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1a1a1a] border border-white/[0.08] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-base font-bold">{job?.id ? "지원 수정" : "새 지원 추가"}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white/70 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Company & Position */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">회사명 *</label>
              <input
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#c8ff4d]/40 placeholder:text-white/20"
                placeholder="카카오"
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">직무 *</label>
              <input
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#c8ff4d]/40 placeholder:text-white/20"
                placeholder="프로덕트 매니저"
                value={form.position}
                onChange={(e) => set("position", e.target.value)}
              />
            </div>
          </div>

          {/* Stage & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">전형 단계</label>
              <select
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#c8ff4d]/40"
                value={form.stage}
                onChange={(e) => set("stage", e.target.value as Stage)}
              >
                {STAGES.map((s) => (
                  <option key={s} value={s} className="bg-[#1a1a1a]">
                    {STAGE_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">우선순위</label>
              <select
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#c8ff4d]/40"
                value={form.priority}
                onChange={(e) => set("priority", e.target.value as Job["priority"])}
              >
                <option value="high" className="bg-[#1a1a1a]">높음</option>
                <option value="medium" className="bg-[#1a1a1a]">보통</option>
                <option value="low" className="bg-[#1a1a1a]">낮음</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">지원일</label>
              <input
                type="date"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#c8ff4d]/40"
                value={form.appliedDate || ""}
                onChange={(e) => set("appliedDate", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">마감일</label>
              <input
                type="date"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#c8ff4d]/40"
                value={form.deadline || ""}
                onChange={(e) => set("deadline", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">다음 일정</label>
              <input
                type="date"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#c8ff4d]/40"
                value={form.nextEventDate || ""}
                onChange={(e) => set("nextEventDate", e.target.value)}
              />
            </div>
          </div>

          {/* Next event note */}
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">다음 일정 메모</label>
            <input
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#c8ff4d]/40 placeholder:text-white/20"
              placeholder="1차 면접 (비대면, 오후 2시)"
              value={form.nextEventNote || ""}
              onChange={(e) => set("nextEventNote", e.target.value)}
            />
          </div>

          {/* Salary & Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">연봉 범위</label>
              <input
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#c8ff4d]/40 placeholder:text-white/20"
                placeholder="4000-5000만원"
                value={form.salary || ""}
                onChange={(e) => set("salary", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">근무지</label>
              <input
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#c8ff4d]/40 placeholder:text-white/20"
                placeholder="판교"
                value={form.location || ""}
                onChange={(e) => set("location", e.target.value)}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">태그</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {(form.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] bg-white/[0.06] px-2 py-0.5 rounded-full flex items-center gap-1"
                >
                  {tag}
                  <button onClick={() => removeTag(tag)} className="text-white/30 hover:text-white/60">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#c8ff4d]/40 placeholder:text-white/20"
                placeholder="태그 추가"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
              />
              <button
                onClick={addTag}
                className="px-3 py-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-sm hover:bg-white/10 transition-colors"
              >
                추가
              </button>
            </div>
          </div>

          {/* Cover letter */}
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">자기소개서 / 지원서</label>
            <textarea
              rows={4}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#c8ff4d]/40 placeholder:text-white/20 resize-none"
              placeholder="지원서 내용을 저장하세요..."
              value={form.coverLetter || ""}
              onChange={(e) => set("coverLetter", e.target.value)}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">메모</label>
            <textarea
              rows={3}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#c8ff4d]/40 placeholder:text-white/20 resize-none"
              placeholder="탈락 이유, 면접 후기, 참고 사항..."
              value={form.notes || ""}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06]">
          <div>
            {onDelete && (
              <button
                onClick={onDelete}
                className="text-red-400/60 hover:text-red-400 text-sm transition-colors"
              >
                삭제
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.company || !form.position}
              className="px-5 py-2 bg-[#c8ff4d] text-[#0f0f0f] font-bold text-sm rounded-lg hover:bg-[#d4ff66] transition-colors disabled:opacity-40"
            >
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
