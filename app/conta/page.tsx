import Link from "next/link";
import { formatStorage, getOrCreateAppUser } from "../../lib/app-user";
import { AppIcon, AppShell } from "../app-shell";
import { chatGPTSignOutPath, requireChatGPTUser } from "../chatgpt-auth";

export const dynamic = "force-dynamic";

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "EU";
}

export default async function AccountPage() {
  const identity = await requireChatGPTUser("/conta");
  const user = await getOrCreateAppUser(identity);
  const name = user.displayName ?? identity.displayName;
  const storagePercent = user.storageLimitBytes ? Math.round((user.storageUsedBytes / user.storageLimitBytes) * 100) : 0;

  return (
    <AppShell
      active="conta"
      eyebrow="Preferências"
      title="Conta e plano"
      viewer={{
        name,
        storageLabel: `${formatStorage(user.storageUsedBytes)} de ${formatStorage(user.storageLimitBytes)}`,
        storagePercent,
      }}
    >
      <div className="account-grid">
        <section className="app-card account-card">
          <div className="account-profile">
            <span className="account-avatar">{initials(name)}</span>
            <div><strong>{name}</strong><span>{identity.email}</span></div>
            <a className="app-action" href={chatGPTSignOutPath("/")}>Sair</a>
          </div>

          <div className="account-section">
            <h3>Seu acesso</h3>
            <div className="account-row"><div><strong>Simulados</strong><span>Todos os cadernos disponíveis continuam acessíveis no plano gratuito</span></div><span>Completo</span></div>
            <div className="account-row"><div><strong>Publicidade</strong><span>Uma pausa entre blocos de 10 questões</span></div><span>Ativa</span></div>
            <div className="account-row"><div><strong>Tema</strong><span>Claro ou escuro, salvo neste dispositivo</span></div><span>No cabeçalho</span></div>
          </div>

          <div className="account-section">
            <h3>Arquivos</h3>
            <div className="account-row"><div><strong>Espaço para certificados</strong><span>{formatStorage(user.storageUsedBytes)} utilizados</span></div><span>{formatStorage(user.storageLimitBytes)}</span></div>
            <div className="account-row"><div><strong>Privacidade e suporte</strong><span>Consulte como seus dados são usados ou fale diretamente com a Sofia</span></div><div className="account-inline-links"><Link href="/privacidade">Privacidade</Link><Link href="/contato">Contato</Link></div></div>
          </div>
        </section>

        <aside className="app-card account-plan-card">
          <div className="account-plan-top">
            <span className="app-kicker">Plano atual</span>
            <h2>Estudoteca Grátis</h2>
            <div className="account-plan-price"><strong>R$ 0</strong><span>sem prazo</span></div>
            <p>Simulados completos, progresso salvo no dispositivo e 50 MB para certificados.</p>
            <Link className="app-action" href="/contato">Quero conhecer o Plus <AppIcon name="arrow" /></Link>
          </div>
          <div className="account-storage-steps">
            <span>Uso da sua estante</span>
            <div className="app-progress"><i style={{ width: `${Math.min(storagePercent, 100)}%` }} /></div>
            <div className="mini-storage-labels"><span>{formatStorage(user.storageUsedBytes)}</span><span>{formatStorage(user.storageLimitBytes)}</span></div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
