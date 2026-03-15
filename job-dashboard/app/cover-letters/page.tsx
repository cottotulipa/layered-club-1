import { readJobs } from "@/lib/storage";
import CoverLettersView from "./CoverLettersView";

export const dynamic = "force-dynamic";

export default async function CoverLettersPage() {
  const jobs = await readJobs();
  const withContent = jobs.filter((j) => j.coverLetter);
  return <CoverLettersView jobs={withContent} />;
}
