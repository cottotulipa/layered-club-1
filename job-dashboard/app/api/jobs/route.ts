import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { readJobs, upsertJob } from "@/lib/storage";
import { Job } from "@/lib/types";
import { nanoid } from "nanoid";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const jobs = await readJobs(userId);
  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const now = new Date().toISOString();
  const job: Job = {
    ...body,
    id: nanoid(),
    createdAt: now,
    updatedAt: now,
  };
  const saved = await upsertJob(job, userId);
  return NextResponse.json(saved, { status: 201 });
}
