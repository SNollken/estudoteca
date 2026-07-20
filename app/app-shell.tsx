import type { ReactNode } from "react";
import Link from "next/link";
import { BrandMark } from "./brand-mark";
import { chatGPTSignInPath } from "./chatgpt-auth-paths";
import { ThemeToggle } from "./theme-toggle";

export type AppSection = "painel" | "simulados" | "certificados" | "contato" | "conta";

type AppShellProps = {
  active: AppSection;
  eyebrow: string;
  title: string;
  children: ReactNode;
  headerAction?: ReactNode;
  viewer?: {
    name: string;
    storageLabel?: string;
    storagePercent?: number;
  } | null;
};

const navigation = [
  { key: "painel" as const, label: "Visão geral", href: "/painel", icon: "home" },
  { key: "simulados" as const, label: "Simulados", href: "/simulados", icon: "exam" },
  { key: "certificados" as const, label: "Certificados", href: "/certificados", icon: "award" },
  { key: "contato" as const, label: "Contato e feedback", href: "/contato", icon: "message" },
  { key: "conta" as const, label: "Conta e plano", href: "/conta", icon: "user" },
];

export function AppIcon({ name }: { name: string }) {
  if (name === "home") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 10 8-6 8 6v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9Z" /></svg>;
  }
  if (name === "exam") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10v4H7zM5 5H4v16h16V5h-1M8 12h8M8 16h5" /></svg>;
  }
  if (name === "award") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="5" /><path d="m9 13-2 8 5-3 5 3-2-8M10 9l1.3 1.3L14 7.7" /></svg>;
  }
  if (name === "user") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4.5 21c.8-4.2 3.3-6.3 7.5-6.3s6.7 2.1 7.5 6.3" /></svg>;
  }
  if (name === "message") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v11H9l-4 3V5Z" /><path d="M8 9h8M8 12h5" /></svg>;
  }
  if (name === "arrow") {
    return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 6l4 4-4 4" /></svg>;
  }
  if (name === "plus") {
    return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4v12M4 10h12" /></svg>;
  }
  if (name === "clock") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
  }
  if (name === "check") {
    return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4 10 4 4 8-9" /></svg>;
  }
  if (name === "bookmark") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10v17l-5-3-5 3V4Z" /></svg>;
  }
  if (name === "upload") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M5 14v6h14v-6" /></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "EU";
}

export function AppShell({ active, eyebrow, title, children, headerAction, viewer = null }: AppShellProps) {
  const profileName = viewer?.name.split(/\s+/)[0] || "Entrar";
  const profileMonogram = viewer ? initials(viewer.name) : "EU";
  const accountHref = viewer ? "/conta" : chatGPTSignInPath(`/${active === "painel" ? "painel" : active}`);
  const storagePercent = Math.max(0, Math.min(100, viewer?.storagePercent ?? 0));
  return (
    <div className="product-shell">
      <aside className="product-sidebar">
        <Link className="product-brand" href="/" aria-label="Voltar para a página inicial da Estudoteca">
          <BrandMark />
          <span>Estudoteca</span>
        </Link>

        <nav className="product-nav" aria-label="Área do estudante">
          <span className="product-nav-label">Área de estudos</span>
          {navigation.map((item) => (
            <a className={active === item.key ? "product-nav-active" : ""} href={item.href} key={item.key}>
              <AppIcon name={item.icon} />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="sidebar-storage">
          <div><span>Espaço para certificados</span><strong>{viewer?.storageLabel ?? "50 MB disponíveis"}</strong></div>
          <div className="storage-meter"><i style={{ width: `${storagePercent}%` }} /></div>
          <Link href="/#planos">Aumentar minha estante <AppIcon name="arrow" /></Link>
        </div>

        <Link className="sidebar-contact" href="/contato">
          <AppIcon name="message" />
          <span><strong>Falar com a Sofia</strong><small>Dúvidas, ideias ou algum erro na prova</small></span>
          <AppIcon name="arrow" />
        </Link>

        <div className="sidebar-profile">
          <span className="profile-monogram">{profileMonogram}</span>
          <div><strong>{profileName}</strong><small>{viewer ? "Plano gratuito" : "Salvar meu progresso"}</small></div>
          <a href={accountHref} aria-label={viewer ? "Abrir conta" : "Entrar com ChatGPT"}>•••</a>
        </div>
      </aside>

      <div className="product-workspace">
        <header className="product-topbar">
          <Link className="mobile-product-brand" href="/" aria-label="Estudoteca — página inicial"><BrandMark /><span>Estudoteca</span></Link>
          <div className="product-title">
            <span>{eyebrow}</span>
            <h1>{title}</h1>
          </div>
          <div className="product-header-actions">
            {headerAction}
            <ThemeToggle />
            <a className="topbar-avatar" href={accountHref} aria-label={viewer ? "Abrir conta" : "Entrar com ChatGPT"}>{profileMonogram}</a>
          </div>
        </header>

        <main className="product-content">{children}</main>
      </div>

      <nav className="product-mobile-nav" aria-label="Navegação móvel da área do estudante">
        {navigation.map((item) => (
          <a className={active === item.key ? "product-nav-active" : ""} href={item.href} key={item.key}>
            <AppIcon name={item.icon} />
            <span>{item.label === "Visão geral" ? "Início" : item.label.split(" ")[0]}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
