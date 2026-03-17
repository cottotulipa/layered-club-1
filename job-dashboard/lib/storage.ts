import { createSupabaseClient } from "./supabase";
import { Job } from "./types";

// DB row (snake_case) → Job (camelCase)
function dbToJob(row: Record<string, unknown>): Job {
  return {
    id: row.id as string,
    company: row.company as string,
    position: row.position as string,
    department: row.department as string | undefined,
    stage: row.stage as Job["stage"],
    appliedDate: row.applied_date as string | undefined,
    deadline: row.deadline as string | undefined,
    nextEventDate: row.next_event_date as string | undefined,
    nextEventNote: row.next_event_note as string | undefined,
    salary: row.salary as string | undefined,
    location: row.location as string | undefined,
    jobUrl: row.job_url as string | undefined,
    coverLetter: row.cover_letter as string | undefined,
    notes: row.notes as string | undefined,
    tags: (row.tags as string[]) ?? [],
    priority: row.priority as Job["priority"],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// Job (camelCase) → DB row (snake_case)
function jobToDb(job: Job, userId: string) {
  return {
    id: job.id,
    user_id: userId,
    company: job.company,
    position: job.position,
    department: job.department ?? null,
    stage: job.stage,
    applied_date: job.appliedDate ?? null,
    deadline: job.deadline ?? null,
    next_event_date: job.nextEventDate ?? null,
    next_event_note: job.nextEventNote ?? null,
    salary: job.salary ?? null,
    location: job.location ?? null,
    job_url: job.jobUrl ?? null,
    cover_letter: job.coverLetter ?? null,
    notes: job.notes ?? null,
    tags: job.tags ?? [],
    priority: job.priority,
    created_at: job.createdAt,
    updated_at: job.updatedAt,
  };
}

export async function readJobs(userId: string): Promise<Job[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(`readJobs 오류: ${error.message}`);
  return (data ?? []).map(dbToJob);
}

export async function getJob(id: string, userId: string): Promise<Job | null> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(`getJob 오류: ${error.message}`);
  return data ? dbToJob(data) : null;
}

export async function upsertJob(job: Job, userId: string): Promise<Job> {
  const supabase = createSupabaseClient();
  const now = new Date().toISOString();
  const row = jobToDb({ ...job, updatedAt: now }, userId);

  const { data, error } = await supabase
    .from("jobs")
    .upsert(row, { onConflict: "id" })
    .select()
    .single();

  if (error) throw new Error(`upsertJob 오류: ${error.message}`);
  return dbToJob(data);
}

export async function deleteJob(id: string, userId: string): Promise<void> {
  const supabase = createSupabaseClient();
  const { error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw new Error(`deleteJob 오류: ${error.message}`);
}
