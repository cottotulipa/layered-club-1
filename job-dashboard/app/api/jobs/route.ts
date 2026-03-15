import { NextRequest, NextResponse } from 'next/server';
import { readJobs, upsertJob } from '@/lib/storage';
import { Job } from '@/lib/types';
import { nanoid } from 'nanoid';

export async function GET() {
  const jobs = await readJobs();
  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const now = new Date().toISOString();
  const job: Job = {
    ...body,
    id: nanoid(),
    createdAt: now,
    updatedAt: now,
  };
  const saved = await upsertJob(job);
  return NextResponse.json(saved, { status: 201 });
}
