import { getDb } from "../../../db";
import { contactMessages } from "../../../db/schema";

const categories = new Set(["duvida", "sugestao", "problema", "conteudo", "parceria", "plano"]);

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    if (clean(body.company, 100)) return Response.json({ ok: true }, { status: 201 });

    const name = clean(body.name, 80);
    const email = clean(body.email, 160).toLowerCase();
    const category = clean(body.category, 30);
    const subject = clean(body.subject, 120);
    const message = clean(body.message, 4_000);
    const pageUrl = clean(body.pageUrl, 500);

    if (name.length < 2 || !email.includes("@") || !categories.has(category) || message.length < 15) {
      return Response.json({ error: "Revise os campos obrigatórios." }, { status: 400 });
    }

    const db = await getDb();
    await db.insert(contactMessages).values({
      id: crypto.randomUUID(),
      name,
      email,
      category,
      subject: subject || null,
      message,
      pageUrl: pageUrl || null,
    });

    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: "Não foi possível enviar agora. Tente novamente em instantes." }, { status: 500 });
  }
}
