import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { readJobs } from "@/lib/storage";
import CalendarView from "./CalendarView";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const jobs = await readJobs(userId);
  return <CalendarView jobs={jobs} />;
}
