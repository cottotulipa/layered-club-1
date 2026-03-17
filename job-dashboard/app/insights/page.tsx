import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import InsightsView from "./InsightsView";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return <InsightsView />;
}
