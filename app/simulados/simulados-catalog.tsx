"use client";

import { useMemo, useState } from "react";
import { AdSlot, type ViewerPlan } from "../ad-slot";
import { AppIcon } from "../app-shell";

const filters = ["Todos", "ENEM", "Anos anteriores"] as const;
export type CatalogFilter = (typeof filters)[number];

const exams = [
  { type: "1º dia · Inglês", title: "ENEM 2025 — Linguagens e Humanas", description: "Caderno azul completo com as cinco questões de língua inglesa e correção pelo gabarito oficial.", questions: "90 questões", time: "5h30", href: "/simulados/enem-2025/prova?prova=enem-2025-dia-1-ingles", filters: ["ENEM", "Anos anteriores"] },
  { type: "1º dia · Espanhol", title: "ENEM 2025 — Linguagens e Humanas", description: "Caderno azul completo com as cinco questões de língua espanhola e correção pelo gabarito oficial.", questions: "90 questões", time: "5h30", href: "/simulados/enem-2025/prova?prova=enem-2025-dia-1-espanhol", filters: ["ENEM", "Anos anteriores"] },
  { type: "2º dia", title: "ENEM 2025 — Natureza e Matemática", description: "Caderno azul completo, com identificação dos itens anulados e correção pelo gabarito oficial.", questions: "90 questões", time: "5h", href: "/simulados/enem-2025/prova?prova=enem-2025-dia-2", filters: ["ENEM", "Anos anteriores"] },
] satisfies Array<{
  type: string;
  title: string;
  description: string;
  questions: string;
  time: string;
  href: string;
  filters: string[];
}>;

function updateCatalogUrl(filter: CatalogFilter) {
  const url = new URL(window.location.href);
  if (filter === "Todos") url.searchParams.delete("filtro");
  else url.searchParams.set("filtro", filter.toLowerCase().replace(" ", "-"));
  url.searchParams.delete("area");
  window.history.replaceState({}, "", url);
}

export function SimuladosCatalog({
  initialFilter = "Todos",
  viewerPlan = "free",
}: {
  initialFilter?: CatalogFilter;
  viewerPlan?: ViewerPlan;
}) {
  const [activeFilter, setActiveFilter] = useState<CatalogFilter>(initialFilter);

  const visibleExams = useMemo(() => {
    return activeFilter === "Todos" ? exams : exams.filter((exam) => exam.filters.includes(activeFilter));
  }, [activeFilter]);

  function selectFilter(filter: CatalogFilter) {
    setActiveFilter(filter);
    updateCatalogUrl(filter);
  }

  return (
    <>
      <div className="catalog-toolbar">
        <div className="catalog-filters" aria-label="Filtrar simulados">
          {filters.map((filter) => (
            <button
              className={`filter-pill${activeFilter === filter ? " filter-pill-active" : ""}`}
              type="button"
              aria-pressed={activeFilter === filter}
              onClick={() => selectFilter(filter)}
              key={filter}
            >
              {filter}
            </button>
          ))}
        </div>
        <span className="catalog-count" aria-live="polite">{visibleExams.length} {visibleExams.length === 1 ? "simulado" : "simulados"}</span>
      </div>

      <section className="exam-card-grid" aria-label="Catálogo de simulados">
        {visibleExams.map((exam) => (
          <article className="app-card exam-card" key={`${exam.type}-${exam.title}`}>
            <div className="exam-card-top"><span className="exam-card-type">{exam.type}</span><span className="exam-card-free">Grátis</span></div>
            <h3>{exam.title}</h3>
            <p>{exam.description}</p>
            <div className="exam-card-meta"><span>{exam.questions}</span><span>{exam.time}</span></div>
            <a className="catalog-link" href={exam.href}>Abrir simulado <AppIcon name="arrow" /></a>
          </article>
        ))}
      </section>

      <AdSlot placement="catalogo-entre-simulados" viewerPlan={viewerPlan} />
    </>
  );
}
