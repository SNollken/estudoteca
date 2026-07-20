import type { ReactNode } from "react";
import Link from "next/link";
import { BrandMark } from "./brand-mark";
import { ThemeToggle } from "./theme-toggle";

type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
};

export function LegalPage({ eyebrow, title, intro, updated, sections }: LegalPageProps) {
  return (
    <div className="site-shell legal-shell">
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>

      <header className="site-header">
        <div className="header-inner legal-header-inner">
          <Link className="brand" href="/" aria-label="Estudoteca — página inicial">
            <BrandMark />
            <span>Estudoteca</span>
          </Link>
          <nav className="desktop-nav" aria-label="Navegação principal">
            <Link href="/simulados">Simulados</Link>
            <Link href="/certificados">Certificados</Link>
            <Link href="/#planos">Planos</Link>
          </nav>
          <div className="header-actions">
            <ThemeToggle />
            <Link className="button button-small button-primary" href="/simulados">Começar grátis</Link>
          </div>
        </div>
      </header>

      <main id="conteudo" className="legal-main">
        <header className="legal-hero">
          <p className="section-kicker">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{intro}</p>
          <span>Última atualização: {updated}</span>
        </header>

        <div className="legal-layout">
          <aside className="legal-toc" aria-label={`Índice de ${title}`}>
            <span>Nesta página</span>
            <nav>
              {sections.map((section, index) => (
                <a href={`#${section.id}`} key={section.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          <article className="legal-content">
            {sections.map((section, index) => (
              <section id={section.id} key={section.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h2>{section.title}</h2>
                <div>{section.content}</div>
              </section>
            ))}
          </article>
        </div>
      </main>

      <footer className="site-footer legal-footer">
        <div className="footer-brand"><BrandMark /><div><strong>Estudoteca</strong><span>Simulados, desempenho e conquistas.</span></div></div>
        <nav aria-label="Links do rodapé"><Link href="/simulados">Simulados</Link><Link href="/#duvidas">Dúvidas</Link><Link href="/termos">Termos</Link><Link href="/privacidade">Privacidade</Link></nav>
        <p>© 2026 Estudoteca.</p>
      </footer>
    </div>
  );
}
