"use client";

import { useMemo, useState } from "react";
import { AppIcon } from "../app-shell";

type CertificateRecord = {
  id: string;
  category: string | null;
  title: string;
  institution: string;
  workloadHours: number | null;
  issuedAt: string | null;
  validationUrl: string | null;
  skillsJson: string;
  fileName: string | null;
  createdAt: string;
};

export function CertificateLibrary({ certificates }: { certificates: CertificateRecord[] }) {
  const filters = useMemo(
    () => ["Todos", ...Array.from(new Set(certificates.map((certificate) => certificate.category).filter((category): category is string => Boolean(category))))],
    [certificates],
  );
  const [activeFilter, setActiveFilter] = useState("Todos");
  const visibleCertificates = useMemo(
    () => activeFilter === "Todos" ? certificates : certificates.filter((certificate) => certificate.category === activeFilter),
    [activeFilter, certificates],
  );

  return (
    <>
      <div className="certificate-library-toolbar">
        <div><span className="app-kicker">Sua estante</span><h2>Conquistas organizadas</h2></div>
        {filters.length > 1 ? (
          <div className="catalog-filters" aria-label="Filtrar certificados">
            {filters.map((filter) => (
              <button
                className={`filter-pill${activeFilter === filter ? " filter-pill-active" : ""}`}
                type="button"
                aria-pressed={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
                key={filter}
              >
                {filter}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <section className="certificate-grid" aria-label="Biblioteca de certificados">
        {visibleCertificates.map((certificate) => {
          let skills: string[] = [];
          try { skills = JSON.parse(certificate.skillsJson) as string[]; } catch { skills = []; }
          const year = certificate.issuedAt?.slice(0, 4) ?? new Date(certificate.createdAt).getFullYear().toString();
          return (
            <article className="app-card certificate-card-app" key={certificate.id}>
              <span className="certificate-category">{certificate.category || "Certificado"}</span>
              <h3>{certificate.title}</h3>
              <p>{certificate.institution}</p>
              {skills.length ? <div className="certificate-tags">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div> : null}
              <div className="certificate-card-actions">
                {certificate.fileName ? <a href={`/api/certificados/${certificate.id}/arquivo`} target="_blank" rel="noreferrer">Abrir arquivo</a> : null}
                {certificate.validationUrl ? <a href={certificate.validationUrl} target="_blank" rel="noreferrer">Validar</a> : null}
              </div>
              <div className="certificate-card-meta"><span>{certificate.workloadHours ? `${certificate.workloadHours}h` : "Carga horária não informada"}</span><span>{year}</span></div>
            </article>
          );
        })}

        {!visibleCertificates.length ? (
          <a className="app-card certificate-empty-card certificate-empty-card-wide" href="/certificados/novo">
            <div><AppIcon name="plus" /><strong>Guarde sua primeira conquista</strong><span>Envie um PDF ou imagem, ou registre somente o link de validação.</span></div>
          </a>
        ) : (
          <a className="app-card certificate-empty-card" href="/certificados/novo">
            <div><AppIcon name="plus" /><strong>Adicionar nova conquista</strong><span>PDF, imagem ou link de validação</span></div>
          </a>
        )}
      </section>
    </>
  );
}
