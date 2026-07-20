import { desc, eq } from "drizzle-orm";
import { getDb } from "../../db";
import { certificates } from "../../db/schema";
import { formatStorage, getOrCreateAppUser } from "../../lib/app-user";
import { AppIcon, AppShell } from "../app-shell";
import { requireChatGPTUser } from "../chatgpt-auth";
import { CertificateLibrary } from "./certificate-library";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
  const identity = await requireChatGPTUser("/certificados");
  const user = await getOrCreateAppUser(identity);
  const db = await getDb();
  const records = await db
    .select({
      id: certificates.id,
      category: certificates.category,
      title: certificates.title,
      institution: certificates.institution,
      workloadHours: certificates.workloadHours,
      issuedAt: certificates.issuedAt,
      validationUrl: certificates.validationUrl,
      skillsJson: certificates.skillsJson,
      fileName: certificates.fileName,
      createdAt: certificates.createdAt,
    })
    .from(certificates)
    .where(eq(certificates.userId, user.id))
    .orderBy(desc(certificates.createdAt));

  const activeRecords = records.filter((record) => record.fileName || record.validationUrl);
  const totalHours = activeRecords.reduce((total, record) => total + (record.workloadHours ?? 0), 0);
  const storagePercent = user.storageLimitBytes ? Math.round((user.storageUsedBytes / user.storageLimitBytes) * 100) : 0;

  return (
    <AppShell
      active="certificados"
      eyebrow="Arquivo de conquistas"
      title="Meus certificados"
      viewer={{
        name: user.displayName ?? identity.displayName,
        storageLabel: `${formatStorage(user.storageUsedBytes)} de ${formatStorage(user.storageLimitBytes)}`,
        storagePercent,
      }}
      headerAction={<a className="app-action app-action-primary" href="/certificados/novo"><AppIcon name="plus" /> Adicionar certificado</a>}
    >
      <section className="certificate-summary">
        <article className="app-card certificate-storage-card">
          <div><span>Espaço utilizado</span><strong>{formatStorage(user.storageUsedBytes)} de {formatStorage(user.storageLimitBytes)}</strong></div>
          <span className="storage-percent">{storagePercent}%</span>
          <div className="app-progress"><i style={{ width: `${Math.min(storagePercent, 100)}%` }} /></div>
        </article>
        <article className="app-card certificate-stat-card"><span>Certificados guardados</span><strong>{activeRecords.length}</strong><span>{activeRecords.length === 1 ? "1 conquista" : `${activeRecords.length} conquistas`}</span></article>
        <article className="app-card certificate-stat-card"><span>Carga horária reunida</span><strong>{totalHours}h</strong><span>Somatório informado por você</span></article>
      </section>

      <CertificateLibrary certificates={activeRecords} />
    </AppShell>
  );
}
