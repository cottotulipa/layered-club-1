import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { readJobs } from "@/lib/storage";
import KanbanBoard from "./KanbanBoard";

export const dynamic = "force-dynamic";

export default async function KanbanPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const jobs = await readJobs(userId);
  return <KanbanBoard initialJobs={jobs} />;
}
