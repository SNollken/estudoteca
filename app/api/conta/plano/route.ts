import { and, eq, gt, inArray } from "drizzle-orm";
import { getDb } from "../../../../db";
import { subscriptions } from "../../../../db/schema";
import { getOrCreateAppUser } from "../../../../lib/app-user";
import { getChatGPTUser } from "../../../chatgpt-auth";

export async function GET() {
  const identity = await getChatGPTUser();
  if (!identity) return Response.json({ plan: "free" });

  const user = await getOrCreateAppUser(identity);
  const [activeSubscription] = await (await getDb())
    .select({ id: subscriptions.id })
    .from(subscriptions)
    .where(and(
      eq(subscriptions.userId, user.id),
      inArray(subscriptions.status, ["active", "approved"]),
      gt(subscriptions.endsAt, new Date().toISOString()),
    ))
    .limit(1);

  return Response.json({ plan: activeSubscription ? "plus" : "free" });
}
