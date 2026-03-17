"use client";

import { useState } from "react";
import { Job, Stage, STAGE_LABELS, STAGE_COLORS } from "@/lib/types";
import JobModal from "@/components/JobModal";
import { Plus, MapPin, DollarSign, Calendar, Flag, ArrowUpDown } from "lucide-react";

const KANBAN_STAGES: Stage[] = [
  "wishlist", "applied", "document_screening",
  "interview_1", "interview_2", "final", "offer", "rejected",
];

const PRIORITY_COLOR = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#6b7280",
};

type SortKey = "updatedAt" | "deadline" | "appliedDate";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "updatedAt", label: "최신순" },
  { key: "deadline", label: "마감일순" },
  { key: "appliedDate", label: "지원일순" },
];

interface Props {
  initialJobs: Job[];
}

export default function KanbanBoard({ initialJobs }: Props) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [modal, setModal] = useState<{ open: boolean; job?: Partial<Job> }>({ open: false });
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<Stage | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>("updatedAt");

  async function saveJob(data: Partial<Job>) {
    const method = data.id ? "PATCH" : "POST";
    const url = data.id ? `/api/jobs/${data.id}` : "/api/jobs";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const saved: Job = await res.json();
    setJobs((prev) => {
      const idx = prev.findIndex((j) => j.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [...prev, saved];
    });
    setModal({ open: false });
  }

  async function deleteJob(id: string) {
    await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    setJobs((prev) => prev.filter((j) => j.id !== id));
    setModal({ open: false });
  }

  async function moveJob(id: string, stage: Stage) {
    const job = jobs.find((j) => j.id === id);
    if (!job || job.stage === stage) return;
    await saveJob({ ...job, stage });
  }

  function handleDragStart(e: React.DragEvent, id: string) {
    e.dataTransfer.setData("jobId", id);
    setDragging(id);
  }

  async function handleDrop(e: React.DragEvent, stage: Stage) {
    e.preventDefault();
    const id = e.dataTransfer.getData("jobId");
    if (id) await moveJob(id, stage);
    setDragging(null);
    setDragOver(null);
  }

  function sortJobs(list: Job[]): Job[] {
    return [...list].sort((a, b) => {
      if (sortBy === "updatedAt") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      if (sortBy === "deadline") {
        const aDate = a.deadline || a.nextEventDate || "9999-12-31";
        const bDate = b.deadline || b.nextEventDate || "9999-12-31";
        return aDate.localeCompare(bDate);
      }
      // appliedDate
      const aDate = a.appliedDate || a.createdAt;
      const bDate = b.appliedDate || b.createdAt;
      return bDate.localeCompare(aDate);
    });
  }

  const byStage = (stage: Stage) => sortJobs(jobs.filter((j) => j.stage === stage));

  return (
    <div className="p-4 sm:p-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-wrap items-start sm:items-center justify-between gap-3 mb-6 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-black tracking-tight">지원현황</h1>
          <p className="text-white/40 text-sm mt-1">전형 단계별 지원 현황</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Sort controls */}
          <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-lg p-1">
            <ArrowUpDown size={12} className="text-white/30 ml-1" />
            {SORT_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                  sortBy === key
                    ? "bg-[#c8ff4d] text-[#0f0f0f]"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setModal({ open: true, job: {} })}
            className="flex items-center gap-2 bg-[#c8ff4d] text-[#0f0f0f] font-bold text-sm px-4 py-2 rounded-lg hover:bg-[#d4ff66] transition-colors"
          >
            <Plus size={15} />
            지원 추가
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="flex gap-3 overflow-x-auto scrollbar-thin pb-4 flex-1">
        {KANBAN_STAGES.map((stage) => {
          const stageJobs = byStage(stage);
          const color = STAGE_COLORS[stage];
          const isDragTarget = dragOver === stage;

          return (
            <div
              key={stage}
              className="flex-shrink-0 w-56 sm:w-60 flex flex-col"
              onDragOver={(e) => { e.preventDefault(); setDragOver(stage); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => handleDrop(e, stage)}
            >
              {/* Column header */}
              <div
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg mb-2 border transition-colors ${
                  isDragTarget ? "bg-white/[0.06] border-white/20" : "bg-white/[0.03] border-white/[0.06]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="text-xs font-bold text-white/70">{STAGE_LABELS[stage]}</span>
                </div>
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: `${color}20`, color }}
                >
                  {stageJobs.length}
                </span>
              </div>

              {/* Cards */}
              <div className={`flex-1 space-y-2 min-h-20 rounded-lg transition-colors p-1 ${isDragTarget ? "bg-white/[0.02]" : ""}`}>
                {stageJobs.map((job) => (
                  <div
                    key={job.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, job.id)}
                    onDragEnd={() => setDragging(null)}
                    onClick={() => setModal({ open: true, job })}
                    className={`bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-3.5 cursor-pointer hover:border-white/20 transition-all ${
                      dragging === job.id ? "opacity-40 scale-95" : ""
                    }`}
                  >
                    {/* Priority + company */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="text-sm font-bold leading-tight">{job.company}</p>
                        <p className="text-[11px] text-white/40 mt-0.5">{job.position}</p>
                      </div>
                      <Flag
                        size={11}
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: PRIORITY_COLOR[job.priority] }}
                        fill={PRIORITY_COLOR[job.priority]}
                      />
                    </div>

                    {/* Meta */}
                    <div className="space-y-1.5">
                      {job.location && (
                        <div className="flex items-center gap-1.5 text-[11px] text-white/30">
                          <MapPin size={10} />
                          {job.location}
                        </div>
                      )}
                      {job.salary && (
                        <div className="flex items-center gap-1.5 text-[11px] text-white/30">
                          <DollarSign size={10} />
                          {job.salary}
                        </div>
                      )}
                      {job.nextEventDate && (
                        <div className="flex items-center gap-1.5 text-[11px] text-[#c8ff4d]/70">
                          <Calendar size={10} />
                          {new Date(job.nextEventDate).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
                          {job.nextEventNote && (
                            <span className="text-white/25 truncate max-w-[80px]">{job.nextEventNote}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {job.tags && job.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {job.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] bg-white/[0.05] px-1.5 py-0.5 rounded-full text-white/40"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Add button */}
                <button
                  onClick={() => setModal({ open: true, job: { stage } })}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-white/[0.08] text-[11px] text-white/20 hover:text-white/40 hover:border-white/20 transition-colors"
                >
                  <Plus size={11} />
                  추가
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modal.open && (
        <JobModal
          job={modal.job}
          onClose={() => setModal({ open: false })}
          onSave={saveJob}
          onDelete={modal.job?.id ? () => deleteJob(modal.job!.id!) : undefined}
        />
      )}
    </div>
  );
}
