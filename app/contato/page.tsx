"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { AppIcon, AppShell } from "../app-shell";

const categories = [
  { value: "duvida", label: "Tenho uma dúvida" },
  { value: "sugestao", label: "Quero sugerir uma melhoria" },
  { value: "problema", label: "Encontrei um problema no site" },
  { value: "conteudo", label: "Encontrei um erro em uma questão" },
  { value: "parceria", label: "Quero falar sobre parceria" },
  { value: "plano", label: "Quero conhecer o Estudoteca Plus" },
];

export default function ContactPage() {
  const searchParams = useSearchParams();
  const requestedCategory = searchParams.get("categoria");
  const initialCategory = categories.some((item) => item.value === requestedCategory)
    ? requestedCategory ?? "duvida"
    : "duvida";
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [subject, setSubject] = useState(searchParams.get("assunto")?.slice(0, 120) ?? "");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, pageUrl: document.referrer || window.location.href }),
      });
      const payload = await response.json() as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Não foi possível enviar sua mensagem.");
      form.reset();
      setCategory("duvida");
      setSubject("");
      setStatus("sent");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Não foi possível enviar sua mensagem.");
      setStatus("error");
    }
  }

  return (
    <AppShell active="contato" eyebrow="Conversa aberta" title="Contato e feedback">
      <div className="contact-layout">
        <section className="app-card contact-intro-card">
          <span className="app-kicker">Fale com a Sofia</span>
          <h2>Sua experiência ajuda a Estudoteca a ficar melhor.</h2>
          <p>Envie uma dúvida, uma ideia ou avise se alguma questão estiver com enunciado, alternativa ou gabarito incorreto.</p>
          <div className="contact-reasons">
            <div><span>01</span><div><strong>Questão com erro?</strong><small>Informe o número da questão e a prova.</small></div></div>
            <div><span>02</span><div><strong>Algo difícil de usar?</strong><small>Conte o que tentou fazer e onde travou.</small></div></div>
            <div><span>03</span><div><strong>Teve uma boa ideia?</strong><small>Sugestões de estudantes são sempre bem-vindas.</small></div></div>
          </div>
        </section>

        <section className="app-card contact-form-card">
          {status === "sent" ? (
            <div className="contact-success" role="status">
              <span><AppIcon name="check" /></span>
              <h2>Mensagem recebida.</h2>
              <p>Obrigada por ajudar. A Sofia vai ler seu contato pelo endereço informado.</p>
              <button className="app-action app-action-primary" type="button" onClick={() => setStatus("idle")}>Enviar outra mensagem</button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="form-heading"><span className="app-kicker">Escreva para a gente</span><h2>Como podemos ajudar?</h2></div>
              <label className="form-field">
                <span>Assunto</span>
                <select name="category" value={category} onChange={(event) => setCategory(event.target.value)} required>
                  {categories.map((category) => <option value={category.value} key={category.value}>{category.label}</option>)}
                </select>
              </label>
              <div className="form-field-row">
                <label className="form-field"><span>Seu nome</span><input name="name" autoComplete="name" maxLength={80} required /></label>
                <label className="form-field"><span>Seu e-mail</span><input name="email" type="email" autoComplete="email" maxLength={160} required /></label>
              </div>
              <label className="form-field"><span>Título <small>opcional</small></span><input name="subject" maxLength={120} value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Ex.: questão 103 do ENEM 2025" /></label>
              <label className="form-field"><span>Mensagem</span><textarea name="message" minLength={15} maxLength={4000} rows={7} placeholder="Conte com detalhes o que aconteceu ou o que você gostaria de sugerir." required /></label>
              <label className="form-honeypot" aria-hidden="true">Empresa<input name="company" tabIndex={-1} autoComplete="off" /></label>
              {error ? <p className="form-error" role="alert">{error}</p> : null}
              <div className="form-submit-row">
                <p>Usaremos seus dados apenas para responder ao contato, conforme a <a href="/privacidade">Política de Privacidade</a>.</p>
                <button className="app-action app-action-primary" type="submit" disabled={status === "sending"}>{status === "sending" ? "Enviando…" : <>Enviar mensagem <AppIcon name="arrow" /></>}</button>
              </div>
            </form>
          )}
        </section>
      </div>
    </AppShell>
  );
}
