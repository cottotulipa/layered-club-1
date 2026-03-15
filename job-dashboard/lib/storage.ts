import { promises as fs } from 'fs';
import path from 'path';
import { Job } from './types';

const DATA_FILE = path.join(process.cwd(), 'data', 'jobs.json');

export async function readJobs(): Promise<Job[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as Job[];
  } catch {
    return [];
  }
}

export async function writeJobs(jobs: Job[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(jobs, null, 2), 'utf-8');
}

export async function getJob(id: string): Promise<Job | null> {
  const jobs = await readJobs();
  return jobs.find((j) => j.id === id) ?? null;
}

export async function upsertJob(job: Job): Promise<Job> {
  const jobs = await readJobs();
  const idx = jobs.findIndex((j) => j.id === job.id);
  const now = new Date().toISOString();
  const updated = { ...job, updatedAt: now };
  if (idx >= 0) {
    jobs[idx] = updated;
  } else {
    jobs.push({ ...updated, createdAt: now });
  }
  await writeJobs(jobs);
  return updated;
}

export async function deleteJob(id: string): Promise<void> {
  const jobs = await readJobs();
  await writeJobs(jobs.filter((j) => j.id !== id));
}
