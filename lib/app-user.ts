import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { users } from "../db/schema";
import type { ChatGPTUser } from "../app/chatgpt-auth";

async function stableUserId(email: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(email.trim().toLowerCase()));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function getOrCreateAppUser(identity: ChatGPTUser) {
  const db = await getDb();
  const id = await stableUserId(identity.email);
  const displayName = identity.fullName ?? identity.email.split("@")[0];

  await db
    .insert(users)
    .values({ id, email: identity.email, displayName })
    .onConflictDoUpdate({
      target: users.email,
      set: { displayName, updatedAt: new Date().toISOString() },
    });

  const [user] = await db.select().from(users).where(eq(users.email, identity.email)).limit(1);
  if (!user) throw new Error("Não foi possível preparar a conta.");
  return user;
}

export function formatStorage(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(0, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} MB`;
}
