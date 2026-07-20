"use client";

import { useMemo, useSyncExternalStore } from "react";
import { AppIcon } from "../app-shell";

const availableExams = [
  { slug: "enem-2025-dia-1-ingles", title: "ENEM 2025 · 1º dia · Inglês", areas: "Linguagens e Ciências Humanas", href: "/simulados/enem-2025/prova?prova=enem-2025-dia-1-ingles" },
  { slug: "enem-2025-dia-1-espanhol", title: "ENEM 2025 · 1º dia · Espanhol", areas: "Linguagens e Ciências Humanas", href: "/simulados/enem-2025/prova?prova=enem-2025-dia-1-espanhol" },
  { slug: "enem-2025-dia-2", title: "ENEM 2025 · 2º dia", areas: "Natureza e Matemática", href: "/simulados/enem-2025/prova?prova=enem-2025-dia-2" },
];

type Draft = {
  slug: string;
  title: string;
  href: string;
  current: number;
  answered: number;
  savedAt: string;
};

type Result = { percent: number };

function readLocalStudyData() {
  const drafts: Draft[] = [];
  const results: Result[] = [];
  for (const exam of availableExams) {
    try {
      const rawDraft = window.localStorage.getItem(`estudoteca:prova:${exam.slug}`);
      if (rawDraft) {
        const draft = JSON.parse(rawDraft) as { current?: number; answers?: Record<string, number>; savedAt?: string };
        drafts.push({
          slug: exam.slug,
          title: exam.title,
          href: exam.href,
          current: Math.max(0, draft.current ?? 0),
          answered: Object.keys(draft.answers ?? {}).length,
          savedAt: draft.savedAt ?? "",
        });
      }
      const rawResult = window.localStorage.getItem(`estudoteca:resultado:${exam.slug}`);
      if (rawResult) results.push(JSON.parse(rawResult) as Result);
    } catch {
      // Um rascunho inválido não deve impedir o estudante de abrir o painel.
    }
  }
  drafts.sort((a, b) => b.savedAt.localeCompare(a.savedAt));
  return JSON.stringify({ drafts, results });
}

function subscribeToStudyData(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

export function LocalDashboard() {
  const serializedStudyData = useSyncExternalStore(subscribeToStudyData, readLocalStudyData, () => "");
  const { drafts, results } = useMemo(() => {
    if (!serializedStudyData) return { drafts: [] as Draft[], results: [] as Result[] };
    return JSON.parse(serializedStudyData) as { drafts: Draft[]; results: Result[] };
  }, [serializedStudyData]);
  const ready = Boolean(serializedStudyData);

  const answered = drafts.reduce((total, draft) => total + draft.answered, 0);
  const average = results.length
    ? Math.round(results.reduce((total, result) => total + result.percent, 0) / results.length)
    : null;
  const currentDraft = drafts[0] ?? null;
  const progress = currentDraft ? Math.max(1, Math.round(((currentDraft.current + 1) / 90) * 100)) : 0;
  const completedLabel = useMemo(() => results.length === 1 ? "1 prova entregue" : `${results.length} provas entregues`, [results.length]);

  return (
    <>
      <section className="dashboard-welcome">
        <div className="dashboard-welcome-copy">
          <span className="app-kicker">Seu ritmo, sem pressão</span>
          <h2>{currentDraft ? "Sua próxima questão já está esperando." : "Comece por um caderno e avance no seu tempo."}</h2>
          <p>{currentDraft ? `Você respondeu ${currentDraft.answered} questões em ${currentDraft.title}. O progresso fica salvo neste navegador.` : "Escolha um dos cadernos oficiais do ENEM 2025. Você pode pausar, fechar a página e continuar depois no mesmo dispositivo."}</p>
          <a className="app-action" href={currentDraft?.href ?? "/simulados/enem-2025"}>{currentDraft ? "Retomar simulado" : "Escolher caderno"} <AppIcon name="arrow" /></a>
        </div>
        <div className="weekly-ring-card dashboard-local-summary">
          <strong>{ready ? answered : "—"}</strong>
          <div><span>Respostas salvas</span><small>{drafts.length ? `${drafts.length} ${drafts.length === 1 ? "caderno em andamento" : "cadernos em andamento"}` : "Nenhum caderno em andamento"}</small></div>
        </div>
      </section>

      <section className="dashboard-metrics" aria-label="Resumo de estudos neste navegador">
        <article className="app-card metric-card"><span>Cadernos em andamento</span><strong>{ready ? drafts.length : "—"}</strong><small>Salvos neste dispositivo</small></article>
        <article className="app-card metric-card"><span>Média de acertos</span><strong>{ready && average !== null ? `${average}%` : "—"}</strong><small>{average === null ? "Entregue uma prova para calcular" : completedLabel}</small></article>
        <article className="app-card metric-card"><span>Banco disponível</span><strong>180</strong><small>Questões oficiais do ENEM 2025</small></article>
      </section>

      <section className="dashboard-grid">
        <div>
          <div className="app-section-heading"><div><span className="app-kicker">Continue de onde parou</span><h2>Simulado em andamento</h2></div></div>
          {currentDraft ? (
            <article className="app-card resume-card">
              <div className="resume-card-main">
                <div className="resume-cover"><span>Caderno oficial</span><strong>ENEM 2025</strong><span>{currentDraft.title.replace("ENEM 2025 · ", "")}</span></div>
                <div className="resume-copy">
                  <span>Progresso salvo neste navegador</span>
                  <h3>Questão {currentDraft.current + 1} de 90</h3>
                  <p>{currentDraft.answered} respostas marcadas até agora.</p>
                  <div className="resume-progress-row"><span>{progress}% percorrido</span><span>{90 - currentDraft.current - 1} questões à frente</span></div>
                  <div className="app-progress"><i style={{ width: `${progress}%` }} /></div>
                  <a className="app-action app-action-primary" href={currentDraft.href}>Retomar prova <AppIcon name="arrow" /></a>
                </div>
              </div>
            </article>
          ) : (
            <article className="app-card dashboard-zero-state">
              <span className="app-kicker">Mesa livre</span>
              <h3>Nenhum simulado em andamento.</h3>
              <p>Quando você iniciar uma prova, o atalho para continuar aparecerá aqui.</p>
              <a className="app-action app-action-primary" href="/simulados/enem-2025">Abrir ENEM 2025 <AppIcon name="arrow" /></a>
            </article>
          )}
        </div>

        <div>
          <div className="app-section-heading"><div><span className="app-kicker">Cadernos disponíveis</span><h3>ENEM 2025</h3></div></div>
          <div className="app-card dashboard-exam-list">
            {availableExams.map((exam, index) => (
              <a href={exam.href} key={exam.slug}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><strong>{exam.title.replace("ENEM 2025 · ", "")}</strong><small>{exam.areas} · 90 questões</small></div>
                <AppIcon name="arrow" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
