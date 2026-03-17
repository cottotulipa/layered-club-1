import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { readJobs } from "@/lib/storage";
import StatsCharts from "./StatsCharts";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const jobs = await readJobs(userId);
  return <StatsCharts jobs={jobs} />;
}
