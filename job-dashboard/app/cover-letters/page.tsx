import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { readJobs } from "@/lib/storage";
import CoverLettersView from "./CoverLettersView";

export const dynamic = "force-dynamic";

export default async function CoverLettersPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const jobs = await readJobs(userId);
  const withContent = jobs.filter((j) => j.coverLetter);
  return <CoverLettersView jobs={withContent} />;
}
