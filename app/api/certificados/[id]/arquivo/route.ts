import { and, eq } from "drizzle-orm";
import { getChatGPTUser } from "../../../../chatgpt-auth";
import { getDb } from "../../../../../db";
import { certificates } from "../../../../../db/schema";
import { getOrCreateAppUser } from "../../../../../lib/app-user";
import { getCertificateBucket } from "../../../../../lib/storage";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const identity = await getChatGPTUser();
  if (!identity) return Response.json({ error: "Entre para abrir este arquivo." }, { status: 401 });

  const { id } = await context.params;
  const user = await getOrCreateAppUser(identity);
  const db = await getDb();
  const [certificate] = await db
    .select({
      fileKey: certificates.fileKey,
      fileName: certificates.fileName,
      fileType: certificates.fileType,
    })
    .from(certificates)
    .where(and(eq(certificates.id, id), eq(certificates.userId, user.id), eq(certificates.status, "active")))
    .limit(1);

  if (!certificate?.fileKey) return Response.json({ error: "Arquivo não encontrado." }, { status: 404 });
  const object = await (await getCertificateBucket()).get(certificate.fileKey);
  if (!object) return Response.json({ error: "Arquivo não encontrado." }, { status: 404 });

  const fileName = (certificate.fileName ?? "certificado").replace(/[\r\n"]/g, "");
  return new Response(object.body, {
    headers: {
      "Content-Type": certificate.fileType ?? object.httpMetadata?.contentType ?? "application/octet-stream",
      "Content-Disposition": `inline; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
