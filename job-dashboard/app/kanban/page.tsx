import { readJobs } from "@/lib/storage";
import KanbanBoard from "./KanbanBoard";

export const dynamic = "force-dynamic";

export default async function KanbanPage() {
  const jobs = await readJobs();
  return <KanbanBoard initialJobs={jobs} />;
}
