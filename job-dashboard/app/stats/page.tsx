import { readJobs } from "@/lib/storage";
import StatsCharts from "./StatsCharts";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const jobs = await readJobs();
  return <StatsCharts jobs={jobs} />;
}
