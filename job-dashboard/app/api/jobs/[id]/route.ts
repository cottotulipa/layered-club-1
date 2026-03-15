import { NextRequest, NextResponse } from 'next/server';
import { getJob, upsertJob, deleteJob } from '@/lib/storage';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const job = await getJob(params.id);
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(job);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const job = await getJob(params.id);
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const body = await req.json();
  const updated = await upsertJob({ ...job, ...body, id: params.id });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await deleteJob(params.id);
  return new NextResponse(null, { status: 204 });
}
