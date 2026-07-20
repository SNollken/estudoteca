import { formatStorage, getOrCreateAppUser } from "../../../lib/app-user";
import { AppShell } from "../../app-shell";
import { requireChatGPTUser } from "../../chatgpt-auth";
import { CertificateForm } from "./certificate-form";

export const dynamic = "force-dynamic";

export default async function NewCertificatePage() {
  const identity = await requireChatGPTUser("/certificados/novo");
  const user = await getOrCreateAppUser(identity);
  const storagePercent = user.storageLimitBytes ? Math.round((user.storageUsedBytes / user.storageLimitBytes) * 100) : 0;
  return (
    <AppShell
      active="certificados"
      eyebrow="Nova conquista"
      title="Adicionar certificado"
      viewer={{
        name: user.displayName ?? identity.displayName,
        storageLabel: `${formatStorage(user.storageUsedBytes)} de ${formatStorage(user.storageLimitBytes)}`,
        storagePercent,
      }}
      headerAction={<a className="app-action" href="/certificados">Cancelar</a>}
    >
      <CertificateForm />
    </AppShell>
  );
}
