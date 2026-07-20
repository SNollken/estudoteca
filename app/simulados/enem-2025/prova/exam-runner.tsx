"use client";

/* Official question artwork has varied intrinsic dimensions and is intentionally served without transformation. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import { AdSlot, type ViewerPlan } from "../../../ad-slot";
import { AppIcon } from "../../../app-shell";
import { BrandMark } from "../../../brand-mark";

type ContentSegment = { type: "text" | "image"; content: string };

type ExamQuestion = {
  id: number;
  position: number;
  officialNumber: number | null;
  language: string | null;
  area: string;
  topic: string;
  content: ContentSegment[];
  answerStatus: string;
  sourceLabel: string | null;
  sourceUrl: string | null;
  options: Array<{ id: number; label: string; content: ContentSegment[] }>;
};

type ExamInfo = {
  slug: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  questionCount: number;
};

type CorrectionResult = {
  position: number;
  questionId: number;
  officialNumber: number | null;
  selectedOptionId: number | null;
  correctOptionId: number | null;
  correctLabel: string | null;
  answerStatus: string;
  isCorrect: boolean | null;
};

type Correction = {
  score: number;
  total: number;
  totalScored: number;
  annulledCount: number;
  results: CorrectionResult[];
};

type SavedDraft = {
  current: number;
  answers: Record<number, number>;
  flagged: number[];
  remaining: number;
  unlockedBlocks: number;
  savedAt?: string;
};

function formatTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

function improveExtractedSpacing(value: string) {
  return value.replace(/([.!?;:)”’])(?=[A-ZÀ-ÖØ-Þ¿¡“])/g, "$1 ");
}

function Content({ segments, option = false }: { segments: ContentSegment[]; option?: boolean }) {
  return (
    <div className={option ? "answer-content" : "question-content"}>
      {segments.map((segment, index) => segment.type === "image" ? (
        <img
          className={option ? "answer-media" : "question-media"}
          src={segment.content}
          alt={option ? "Conteúdo visual desta alternativa" : "Figura da questão oficial"}
          loading="lazy"
          key={`${segment.content}-${index}`}
        />
      ) : (
        <p key={`${index}-${segment.content.slice(0, 24)}`}>{improveExtractedSpacing(segment.content)}</p>
      ))}
    </div>
  );
}

export function Enem2025Runner({
  examSlug,
  viewerPlan = "free",
}: {
  examSlug: string;
  viewerPlan?: ViewerPlan;
}) {
  const [exam, setExam] = useState<ExamInfo | null>(null);
  const [activePlan, setActivePlan] = useState<ViewerPlan>(viewerPlan);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [remaining, setRemaining] = useState(0);
  const [unlockedBlocks, setUnlockedBlocks] = useState(1);
  const [pendingTarget, setPendingTarget] = useState<number | null>(null);
  const [correction, setCorrection] = useState<Correction | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const storageKey = `estudoteca:prova:${examSlug}`;

  useEffect(() => {
    let active = true;
    fetch("/api/conta/plano")
      .then(async (response) => response.ok ? await response.json() as { plan?: ViewerPlan } : null)
      .then((payload) => {
        if (active && payload?.plan === "plus") setActivePlan("plus");
      })
      .catch(() => {
        // O simulado continua normalmente no plano gratuito se a consulta falhar.
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;

    fetch(`/api/simulados/${examSlug}/questoes?start=1&limit=90`)
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "Não foi possível abrir a prova.");
        return payload as { exam: ExamInfo; questions: ExamQuestion[] };
      })
      .then((payload) => {
        if (!active) return;
        setExam(payload.exam);
        setQuestions(payload.questions);

        let draft: SavedDraft | null = null;
        try {
          const saved = window.localStorage.getItem(storageKey);
          if (saved) draft = JSON.parse(saved) as SavedDraft;
        } catch {
          window.localStorage.removeItem(storageKey);
        }

        const safeCurrent = Math.max(0, Math.min(payload.questions.length - 1, draft?.current ?? 0));
        setCurrent(safeCurrent);
        setAnswers(draft?.answers ?? {});
        setFlagged(new Set(draft?.flagged ?? []));
        setRemaining(Math.max(0, draft?.remaining ?? payload.exam.durationMinutes * 60));
        setUnlockedBlocks(Math.max(1, draft?.unlockedBlocks ?? Math.floor(safeCurrent / 10) + 1));
        setHydrated(true);
      })
      .catch((error) => {
        if (active) setLoadError(error instanceof Error ? error.message : "Não foi possível abrir a prova.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [examSlug, reloadKey, storageKey]);

  useEffect(() => {
    if (!hydrated || pendingTarget !== null || correction || remaining <= 0) return;
    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [correction, hydrated, pendingTarget, remaining]);

  useEffect(() => {
    if (!hydrated || !questions.length || correction) return;
    const draft: SavedDraft = {
      current,
      answers,
      flagged: Array.from(flagged),
      remaining,
      unlockedBlocks,
      savedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(storageKey, JSON.stringify(draft));
  }, [answers, correction, current, flagged, hydrated, questions.length, remaining, storageKey, unlockedBlocks]);

  const question = questions[current];
  const answeredCount = Object.keys(answers).length;
  const resultByQuestion = useMemo(
    () => new Map(correction?.results.map((result) => [result.questionId, result]) ?? []),
    [correction],
  );
  const currentResult = question ? resultByQuestion.get(question.id) : undefined;

  function toggleFlag() {
    if (!question) return;
    setFlagged((previous) => {
      const next = new Set(previous);
      if (next.has(question.id)) next.delete(question.id);
      else next.add(question.id);
      return next;
    });
  }

  function goTo(target: number) {
    const safeTarget = Math.max(0, Math.min(questions.length - 1, target));
    const targetBlock = Math.floor(safeTarget / 10) + 1;
    if (!correction && activePlan === "free" && targetBlock > unlockedBlocks) {
      setPendingTarget(safeTarget);
      return;
    }
    setCurrent(safeTarget);
  }

  function continueAfterAd() {
    if (pendingTarget === null) return;
    setUnlockedBlocks(Math.floor(pendingTarget / 10) + 1);
    setCurrent(pendingTarget);
    setPendingTarget(null);
  }

  async function submitExam() {
    setSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch(`/api/simulados/${examSlug}/corrigir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Não foi possível corrigir a prova agora.");
      const completed = payload as Correction;
      setCorrection(completed);
      setShowResult(true);
      window.localStorage.removeItem(storageKey);
      window.localStorage.setItem(`estudoteca:resultado:${examSlug}`, JSON.stringify({
        title: exam.title,
        score: completed.score,
        totalScored: completed.totalScored,
        percent: completed.totalScored ? Math.round((completed.score / completed.totalScored) * 100) : 0,
        completedAt: new Date().toISOString(),
      }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Não foi possível corrigir a prova agora.");
    } finally {
      setSubmitting(false);
    }
  }

  function startAgain() {
    window.localStorage.removeItem(storageKey);
    setAnswers({});
    setFlagged(new Set());
    setCurrent(0);
    setRemaining((exam?.durationMinutes ?? 300) * 60);
    setUnlockedBlocks(1);
    setCorrection(null);
    setShowResult(false);
  }

  function retryLoad() {
    setLoading(true);
    setLoadError("");
    setHydrated(false);
    setReloadKey((value) => value + 1);
  }

  if (loading) {
    return (
      <div className="exam-runner-shell runner-state-shell">
        <BrandMark />
        <span className="app-kicker">Preparando a sua mesa</span>
        <h1>Carregando o caderno oficial…</h1>
        <p>Organizando as 90 questões e recuperando seu progresso neste dispositivo.</p>
      </div>
    );
  }

  if (loadError || !exam || !question) {
    return (
      <div className="exam-runner-shell runner-state-shell">
        <BrandMark />
        <span className="app-kicker">Não conseguimos abrir o caderno</span>
        <h1>{loadError || "A prova ainda não está disponível."}</h1>
        <p>Confira sua conexão e tente novamente. Suas respostas salvas neste dispositivo não serão apagadas.</p>
        <div className="runner-result-actions">
          <button className="app-action app-action-primary" type="button" onClick={retryLoad}>Tentar novamente</button>
          <a className="app-action" href="/simulados/enem-2025">Voltar aos cadernos</a>
        </div>
      </div>
    );
  }

  if (correction && showResult) {
    const percent = correction.totalScored ? Math.round((correction.score / correction.totalScored) * 100) : 0;
    return (
      <div className="exam-runner-shell">
        <header className="runner-topbar">
          <a className="runner-brand" href="/simulados"><BrandMark /><span>Estudoteca</span></a>
          <div className="runner-progress runner-progress-finished"><span>Prova entregue</span><strong>{exam.title}</strong></div>
          <a className="app-action" href="/simulados/enem-2025">Sair do resultado</a>
        </header>
        <main className="runner-result-layout">
          <section className="app-card runner-result-card">
            <span className="app-kicker">Seu resultado</span>
            <div className="runner-result-score"><strong>{percent}%</strong><span>{correction.score} de {correction.totalScored} questões válidas</span></div>
            <p>O cálculo mostra seus acertos simples. A nota oficial do ENEM usa a TRI e não pode ser reproduzida apenas com a quantidade de acertos.</p>
            {correction.annulledCount ? <small>{correction.annulledCount} questões anuladas pelo INEP ficaram fora do cálculo.</small> : null}
            <div className="runner-result-actions">
              <button className="app-action app-action-primary" type="button" onClick={() => setShowResult(false)}>Revisar respostas</button>
              <button className="app-action" type="button" onClick={startAgain}>Refazer prova</button>
            </div>
          </section>
          <section className="app-card runner-result-map">
            <h2>Mapa do caderno</h2>
            <div className="result-question-list">
              {questions.map((item, index) => {
                const result = resultByQuestion.get(item.id);
                const state = result?.answerStatus === "annulled" ? "result-annulled" : result?.isCorrect ? "result-correct" : "result-wrong";
                const detail = result?.answerStatus === "annulled"
                  ? "Anulada pelo INEP"
                  : result?.isCorrect
                    ? "Acertou"
                    : `Resposta correta: ${result?.correctLabel ?? "—"}`;
                return (
                  <button type="button" onClick={() => { setShowResult(false); setCurrent(index); }} key={item.id}>
                    <span className={state}>{item.officialNumber ?? item.position}</span>
                    <div><strong>{item.area}</strong><small>{detail}</small></div>
                  </button>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="exam-runner-shell">
      <header className="runner-topbar">
        <a className="runner-brand" href="/simulados"><BrandMark /><span>Estudoteca</span></a>
        <div className="runner-progress">
          <div className="runner-progress-label"><span>{exam.title}</span><strong>{current + 1} de {questions.length}</strong></div>
          <div className="app-progress"><i style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div>
        </div>
        <div className="runner-timer"><AppIcon name="clock" /><span>{formatTime(remaining)}</span></div>
      </header>

      <main className="runner-layout">
        <article className="app-card question-panel">
          <div className="question-meta">
            <span>Questão {question.officialNumber ?? question.position} · {question.area}</span>
            <button className={`runner-button ${flagged.has(question.id) ? "runner-button-active" : ""}`} type="button" onClick={toggleFlag}>
              <AppIcon name="bookmark" /> {flagged.has(question.id) ? "Marcada para revisar" : "Marcar para revisar"}
            </button>
          </div>
          {question.sourceUrl ? <a className="question-source" href={question.sourceUrl} target="_blank" rel="noreferrer">Fonte: {question.sourceLabel ?? "INEP"}</a> : null}

          <div className="question-taxonomy" aria-label="Assuntos da questão"><span>{question.topic}</span></div>
          {question.answerStatus === "annulled" ? (
            <div className="question-annulled"><strong>Questão anulada</strong><span>Ela permanece no caderno para o treino, mas não entra no cálculo de acertos.</span></div>
          ) : null}
          <Content segments={question.content} />

          <div className="answer-list" role="radiogroup" aria-label={`Alternativas da questão ${question.officialNumber ?? question.position}`}>
            {question.options.map((option) => {
              const selected = answers[question.id] === option.id;
              const isCorrect = currentResult?.correctOptionId === option.id;
              const isWrongSelection = Boolean(currentResult && selected && currentResult.isCorrect === false);
              return (
                <label className={`answer-option${isCorrect ? " answer-option-correct" : ""}${isWrongSelection ? " answer-option-wrong" : ""}`} key={option.id}>
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option.id}
                    checked={selected}
                    disabled={Boolean(correction)}
                    onChange={() => setAnswers((previous) => ({ ...previous, [question.id]: option.id }))}
                  />
                  <span className="answer-letter">{option.label}</span>
                  <Content segments={option.content} option />
                </label>
              );
            })}
          </div>

          <div className="runner-navigation">
            <button className="app-action" type="button" onClick={() => goTo(current - 1)} disabled={current === 0}>Anterior</button>
            {correction ? (
              <button className="app-action app-action-primary" type="button" onClick={() => setShowResult(true)}>Voltar ao resultado <AppIcon name="arrow" /></button>
            ) : current < questions.length - 1 ? (
              <button className="app-action app-action-primary" type="button" onClick={() => goTo(current + 1)}>Próxima <AppIcon name="arrow" /></button>
            ) : (
              <button className="app-action app-action-primary" type="button" onClick={submitExam} disabled={submitting}>{submitting ? "Corrigindo…" : "Entregar prova"} <AppIcon name="arrow" /></button>
            )}
          </div>
          {submitError ? <p className="form-error" role="alert">{submitError}</p> : null}
        </article>

        <aside className="app-card runner-side">
          <div><h2>Mapa da prova</h2><p>{answeredCount} respondidas · {flagged.size} marcadas</p></div>
          <div className="question-palette">
            {questions.map((item, index) => {
              const result = resultByQuestion.get(item.id);
              return (
                <button
                  className={`${current === index ? "palette-current" : ""} ${answers[item.id] !== undefined ? "palette-answered" : ""} ${flagged.has(item.id) ? "palette-flagged" : ""} ${result?.isCorrect ? "palette-correct" : ""} ${result?.isCorrect === false ? "palette-wrong" : ""}`}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Ir para questão ${item.officialNumber ?? item.position}`}
                  key={item.id}
                >{item.officialNumber ?? item.position}</button>
              );
            })}
          </div>
          <div className="palette-legend"><span><i /> Respondida</span><span><i /> Marcada para revisão</span><span><i /> Ainda não respondida</span></div>
          {!correction ? <button className="app-action runner-submit-side" type="button" onClick={submitExam} disabled={submitting}>Entregar prova</button> : null}
          <small className="runner-save-note">Progresso salvo automaticamente neste dispositivo.</small>
        </aside>
      </main>

      {pendingTarget !== null ? (
        <div className="ad-break-backdrop" role="dialog" aria-modal="true" aria-labelledby="ad-break-title">
          <div className="app-card ad-break-card">
            <span className="app-kicker">Pausa entre blocos</span>
            <h2 id="ad-break-title">Hora de respirar um pouco.</h2>
            <p>Suas respostas já estão salvas neste dispositivo. A próxima sequência começa quando você continuar.</p>
            <AdSlot placement={`prova-bloco-${Math.floor(pendingTarget / 10)}`} viewerPlan={activePlan} format="rectangle" />
            <button className="app-action app-action-primary" type="button" onClick={continueAfterAd}>Continuar para a questão {questions[pendingTarget].officialNumber ?? pendingTarget + 1}</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
