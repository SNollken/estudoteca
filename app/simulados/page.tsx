import { AppIcon, AppShell } from "../app-shell";
import { SimuladosCatalog, type CatalogFilter } from "./simulados-catalog";

const filterMap: Record<string, CatalogFilter> = {
  enem: "ENEM",
  "anos-anteriores": "Anos anteriores",
};

export default async function SimuladosPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const rawFilter = typeof params.filtro === "string" ? params.filtro : "";
  const initialFilter = filterMap[rawFilter] ?? "Todos";
  return (
    <AppShell active="simulados" eyebrow="Sala de estudos" title="Simulados">
      <section className="catalog-feature">
        <div className="catalog-feature-copy">
          <span className="app-kicker">Simulado em destaque</span>
          <h2>ENEM 2025</h2>
          <p>Questões da aplicação oficial, cadernos originais do INEP e um treino digital com correção ao finalizar.</p>
          <div className="catalog-feature-actions">
            <a className="app-action" href="/simulados/enem-2025">Ver detalhes <AppIcon name="arrow" /></a>
            <a className="app-action" href="/simulados/enem-2025/prova?prova=enem-2025-dia-2">Começar pelo 2º dia</a>
          </div>
        </div>
        <div className="catalog-feature-stats" aria-label="Informações do ENEM 2025">
          <div><strong>180</strong><span>questões</span></div>
          <div><strong>2</strong><span>dias completos</span></div>
          <div><strong>4</strong><span>áreas do conhecimento</span></div>
          <div><strong>Grátis</strong><span>prova completa</span></div>
        </div>
      </section>

      <SimuladosCatalog initialFilter={initialFilter} viewerPlan="free" />
    </AppShell>
  );
}
