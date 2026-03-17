import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { readJobs } from "@/lib/storage";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const jobs = await readJobs(userId);
  return <DashboardClient jobs={jobs} />;
}
