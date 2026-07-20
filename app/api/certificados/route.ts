import { eq, sql } from "drizzle-orm";
import { getChatGPTUser } from "../../chatgpt-auth";
import { getDb } from "../../../db";
import { certificates, users } from "../../../db/schema";
import { getOrCreateAppUser } from "../../../lib/app-user";
import { getCertificateBucket } from "../../../lib/storage";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const acceptedTypes = new Set(["application/pdf", "image/png", "image/jpeg"]);

function field(form: FormData, name: string, maxLength: number) {
  const value = form.get(name);
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function safeValidationUrl(value: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const identity = await getChatGPTUser();
  if (!identity) return Response.json({ error: "Entre para guardar certificados." }, { status: 401 });

  let fileKey: string | null = null;
  try {
    const form = await request.formData();
    const title = field(form, "title", 160);
    const institution = field(form, "institution", 160);
    const category = field(form, "category", 80) || null;
    const summary = field(form, "summary", 2500) || null;
    const issuedAt = field(form, "issuedAt", 10) || null;
    const validationInput = field(form, "validationUrl", 500);
    const validationUrl = safeValidationUrl(validationInput);
    const skills = field(form, "skills", 800)
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean)
      .slice(0, 20);
    const workloadInput = Number(field(form, "workloadHours", 6));
    const workloadHours = Number.isFinite(workloadInput) && workloadInput > 0 ? Math.round(workloadInput) : null;
    const rawFile = form.get("file");
    const file = rawFile instanceof File && rawFile.size > 0 ? rawFile : null;

    if (!title || !institution) {
      return Response.json({ error: "Informe o título e a instituição." }, { status: 400 });
    }
    if (validationInput && !validationUrl) {
      return Response.json({ error: "O link de validação precisa começar com http:// ou https://." }, { status: 400 });
    }
    if (!file && !validationUrl) {
      return Response.json({ error: "Adicione um arquivo ou um link de validação." }, { status: 400 });
    }
    if (file && (!acceptedTypes.has(file.type) || file.size > MAX_FILE_BYTES)) {
      return Response.json({ error: "Envie um PDF, PNG ou JPG de até 10 MB." }, { status: 400 });
    }

    const user = await getOrCreateAppUser(identity);
    const fileSize = file?.size ?? 0;
    if (user.storageUsedBytes + fileSize > user.storageLimitBytes) {
      return Response.json({ error: "Este arquivo ultrapassa o espaço disponível na sua estante." }, { status: 413 });
    }

    const certificateId = crypto.randomUUID();
    const safeFileName = file?.name.replace(/[^\p{L}\p{N}._-]+/gu, "-").slice(0, 120) || null;
    if (file && safeFileName) {
      fileKey = `certificates/${user.id}/${certificateId}/${safeFileName}`;
      const bucket = await getCertificateBucket();
      await bucket.put(fileKey, file.stream(), {
        httpMetadata: { contentType: file.type },
        customMetadata: { ownerId: user.id, certificateId },
      });
    }

    const db = await getDb();
    try {
      await db.batch([
        db.insert(certificates).values({
          id: certificateId,
          userId: user.id,
          title,
          institution,
          category,
          workloadHours,
          issuedAt,
          validationUrl,
          summary,
          skillsJson: JSON.stringify(skills),
          fileKey,
          fileName: file?.name ?? null,
          fileType: file?.type ?? null,
          fileSizeBytes: fileSize,
        }),
        db.update(users)
          .set({
            storageUsedBytes: sql`${users.storageUsedBytes} + ${fileSize}`,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(users.id, user.id)),
      ]);
    } catch (error) {
      if (fileKey) await (await getCertificateBucket()).delete(fileKey);
      throw error;
    }

    return Response.json({ id: certificateId }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível guardar o certificado.";
    return Response.json({ error: message }, { status: 500 });
  }
}
