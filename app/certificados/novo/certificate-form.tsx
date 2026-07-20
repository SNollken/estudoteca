"use client";

import { useState } from "react";
import { AppIcon } from "../../app-shell";

type CertificateFields = {
  title: string;
  institution: string;
  category: string;
  workloadHours: string;
  issuedAt: string;
  validationUrl: string;
  summary: string;
  skills: string;
};

const initialFields: CertificateFields = {
  title: "",
  institution: "",
  category: "Tecnologia",
  workloadHours: "",
  issuedAt: "",
  validationUrl: "",
  summary: "",
  skills: "",
};

export function CertificateForm() {
  const [fields, setFields] = useState(initialFields);
  const [file, setFile] = useState<File | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof CertificateFields>(key: K, value: CertificateFields[K]) {
    setFields((previous) => ({ ...previous, [key]: value }));
  }

  function continueToReview() {
    setError("");
    if (!fields.title.trim() || !fields.institution.trim()) {
      setError("Informe o título do curso e a instituição.");
      return;
    }
    if (!file && !fields.validationUrl.trim()) {
      setError("Adicione um arquivo ou informe o link de validação.");
      return;
    }
    if (file && file.size > 10 * 1024 * 1024) {
      setError("O arquivo precisa ter no máximo 10 MB.");
      return;
    }
    setReviewing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveCertificate() {
    setSubmitting(true);
    setError("");
    try {
      const body = new FormData();
      Object.entries(fields).forEach(([key, value]) => body.set(key, value));
      if (file) body.set("file", file);
      const response = await fetch("/api/certificados", { method: "POST", body });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Não foi possível guardar o certificado.");
      setConfirmed(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível guardar o certificado.");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmed) {
    return (
      <div className="certificate-form-layout">
        <section className="app-card form-panel form-confirmation">
          <span className="confirmation-icon"><AppIcon name="check" /></span>
          <span className="app-kicker">Certificado guardado</span>
          <h2>Sua conquista já está na estante.</h2>
          <p className="form-intro">O arquivo e as informações ficam juntos para você encontrar quando precisar.</p>
          <a className="app-action app-action-primary" href="/certificados">Ver meus certificados <AppIcon name="arrow" /></a>
        </section>
        <aside className="app-card form-side-note"><h3>Tudo no lugar</h3><p>Somente você pode acessar o arquivo depois de entrar na sua conta.</p></aside>
      </div>
    );
  }

  return (
    <div className="certificate-form-layout">
      <section className="app-card form-panel">
        <span className="app-kicker">{reviewing ? "Etapa 2 de 2" : "Etapa 1 de 2"}</span>
        <h2>{reviewing ? "Revise antes de guardar" : "Conte sobre essa conquista"}</h2>
        <p className="form-intro">Você pode guardar o arquivo, o link de validação ou os dois juntos.</p>

        {reviewing ? (
          <div className="form-grid certificate-review-grid">
            <div className="form-field form-field-full"><label>Arquivo</label><input value={file?.name || "Somente link de validação"} readOnly /></div>
            <div className="form-field"><label>Título</label><input value={fields.title} readOnly /></div>
            <div className="form-field"><label>Instituição</label><input value={fields.institution} readOnly /></div>
            <div className="form-field"><label>Categoria</label><input value={fields.category || "Não informada"} readOnly /></div>
            <div className="form-field"><label>Carga horária</label><input value={fields.workloadHours ? `${fields.workloadHours} horas` : "Não informada"} readOnly /></div>
            {fields.summary ? <div className="form-field form-field-full"><label>Resumo</label><textarea value={fields.summary} readOnly /></div> : null}
          </div>
        ) : (
          <div className="form-grid">
            <div className="form-field form-field-full">
              <label htmlFor="certificate-file">Arquivo do certificado</label>
              <label className="file-dropzone" htmlFor="certificate-file">
                <input id="certificate-file" type="file" accept=".pdf,image/png,image/jpeg" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
                <div><AppIcon name="upload" /><strong>{file?.name || "Escolha um PDF ou imagem"}</strong><span>PDF, PNG ou JPG de até 10 MB</span></div>
              </label>
            </div>
            <div className="form-field"><label htmlFor="certificate-title">Título do curso</label><input id="certificate-title" value={fields.title} onChange={(event) => update("title", event.target.value)} required /></div>
            <div className="form-field"><label htmlFor="certificate-institution">Instituição</label><input id="certificate-institution" value={fields.institution} onChange={(event) => update("institution", event.target.value)} required /></div>
            <div className="form-field"><label htmlFor="certificate-category">Categoria</label><select id="certificate-category" value={fields.category} onChange={(event) => update("category", event.target.value)}><option>Tecnologia</option><option>Idiomas</option><option>Carreira</option><option>Dados</option><option>Outro</option></select></div>
            <div className="form-field"><label htmlFor="certificate-hours">Carga horária</label><input id="certificate-hours" type="number" min="1" value={fields.workloadHours} onChange={(event) => update("workloadHours", event.target.value)} /><small>Em horas</small></div>
            <div className="form-field"><label htmlFor="certificate-date">Data de conclusão</label><input id="certificate-date" type="date" value={fields.issuedAt} onChange={(event) => update("issuedAt", event.target.value)} /></div>
            <div className="form-field"><label htmlFor="certificate-url">Link de validação</label><input id="certificate-url" type="url" value={fields.validationUrl} onChange={(event) => update("validationUrl", event.target.value)} placeholder="https://..." /></div>
            <div className="form-field form-field-full"><label htmlFor="certificate-summary">Resumo do que você aprendeu</label><textarea id="certificate-summary" value={fields.summary} onChange={(event) => update("summary", event.target.value)} rows={5} /></div>
            <div className="form-field form-field-full"><label htmlFor="certificate-skills">Habilidades</label><input id="certificate-skills" value={fields.skills} onChange={(event) => update("skills", event.target.value)} /><small>Separe as habilidades por vírgula.</small></div>
          </div>
        )}

        {error ? <p className="form-error" role="alert">{error}</p> : null}
        <div className="form-actions">
          {reviewing ? <button className="app-action" type="button" onClick={() => setReviewing(false)} disabled={submitting}>Voltar e editar</button> : null}
          <button className="app-action app-action-primary" type="button" onClick={reviewing ? saveCertificate : continueToReview} disabled={submitting}>{submitting ? "Guardando…" : reviewing ? "Guardar certificado" : "Continuar para revisão"} <AppIcon name="arrow" /></button>
        </div>
      </section>

      <aside className="app-card form-side-note">
        <h3>O arquivo é seu.</h3>
        <p>Ele fica associado à sua conta e só abre depois que você entra novamente.</p>
        <ul>
          <li><AppIcon name="check" /><span>50 MB no plano gratuito</span></li>
          <li><AppIcon name="check" /><span>Até 10 MB por arquivo</span></li>
          <li><AppIcon name="check" /><span>PDF, PNG ou JPG</span></li>
        </ul>
      </aside>
    </div>
  );
}
