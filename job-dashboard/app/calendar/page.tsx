import { readJobs } from "@/lib/storage";
import CalendarView from "./CalendarView";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const jobs = await readJobs();
  return <CalendarView jobs={jobs} />;
}
